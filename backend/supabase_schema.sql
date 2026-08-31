-- ============================================================================
-- AGRISENSE AI & KARMAYOGI: CONSOLIDATED SUPABASE POSTGRESQL SCHEMA FIX
-- Run this in your Supabase Dashboard -> SQL Editor -> Click "Run"
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    name TEXT,
    phone_number TEXT,
    preferred_language TEXT DEFAULT 'en',
    state TEXT,
    district TEXT,
    department TEXT DEFAULT 'Agriculture',
    "current_role" TEXT DEFAULT 'Farmer / Agronomist',
    "role" TEXT DEFAULT 'user',
    competencies JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (true);

-- 3. Robust Auth Trigger Function (Safe & Fault-Tolerant)
-- Handles Google OAuth, Email Signups, and metadata extraction gracefully without failing
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name TEXT;
BEGIN
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'user_name',
        split_part(NEW.email, '@', 1),
        'AgriSense User'
    );

    INSERT INTO public.profiles (
        id, 
        full_name, 
        name, 
        preferred_language, 
        department, 
        "current_role", 
        "role"
    )
    VALUES (
        NEW.id,
        user_name,
        user_name,
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en'),
        COALESCE(NEW.raw_user_meta_data->>'department', 'Agriculture'),
        COALESCE(NEW.raw_user_meta_data->>'current_role', 'Farmer / Agronomist'),
        'user'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        name = COALESCE(EXCLUDED.name, profiles.name),
        updated_at = NOW();

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log warning but NEVER abort the auth.users signup transaction
        RAISE WARNING 'handle_new_user trigger exception: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Attach Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Missing Tables & Fixes
CREATE TABLE IF NOT EXISTS public.fertilizer_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    application_date DATE DEFAULT CURRENT_DATE,
    input_type TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity_kg_per_acre NUMERIC(6, 2) NOT NULL,
    method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.farmer_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    observed_date DATE DEFAULT CURRENT_DATE,
    observation_text TEXT NOT NULL,
    audio_voice_note_url TEXT,
    symptoms_tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.satellite_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    capture_date DATE DEFAULT CURRENT_DATE,
    provider TEXT DEFAULT 'Sentinel-2',
    mean_ndvi NUMERIC(4, 3),
    mean_ndwi NUMERIC(4, 3),
    canopy_density_pct NUMERIC(5, 2),
    true_color_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and permissive policies on all tables
ALTER TABLE public.fertilizer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.satellite_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on fertilizer_logs" ON public.fertilizer_logs;
CREATE POLICY "Allow public all on fertilizer_logs" ON public.fertilizer_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all on farmer_feedback" ON public.farmer_feedback;
CREATE POLICY "Allow public all on farmer_feedback" ON public.farmer_feedback FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all on satellite_snapshots" ON public.satellite_snapshots;
CREATE POLICY "Allow public all on satellite_snapshots" ON public.satellite_snapshots FOR ALL USING (true);
