-- ============================================================================
-- AGRISENSE AI: COMPLETE SUPABASE POSTGRESQL + POSTGIS SCHEMA
-- Run this in your Supabase Dashboard -> SQL Editor -> Run
-- ============================================================================

-- 1. Enable Spatial & UUID Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE,
    preferred_language TEXT DEFAULT 'en', -- 'en', 'hi', 'mr', 'te', 'ta'
    state TEXT,
    district TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Farms (With PostGIS Spatial Boundaries)
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID DEFAULT '00000000-0000-0000-0000-000000000000',
    farm_name TEXT NOT NULL,
    total_area_acres NUMERIC(6, 2) NOT NULL,
    soil_type TEXT,
    primary_water_source TEXT,
    center_latitude NUMERIC(10, 7) NOT NULL,
    center_longitude NUMERIC(10, 7) NOT NULL,
    boundary_polygon GEOMETRY(Polygon, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for high-speed geospatial bounding box queries
CREATE INDEX IF NOT EXISTS idx_farms_boundary ON public.farms USING GIST (boundary_polygon);

-- 4. Soil Health Records (Lab Tests & ISRIC Sync)
CREATE TABLE IF NOT EXISTS public.soil_health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    test_date DATE DEFAULT CURRENT_DATE,
    nitrogen_ppm NUMERIC(6, 2),
    phosphorus_ppm NUMERIC(6, 2),
    potassium_ppm NUMERIC(6, 2),
    ph_level NUMERIC(4, 2),
    organic_carbon_pct NUMERIC(4, 2),
    electrical_conductivity NUMERIC(5, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Crop Rotation History
CREATE TABLE IF NOT EXISTS public.crop_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    variety TEXT,
    season TEXT NOT NULL, -- 'Kharif', 'Rabi', 'Zaid'
    cycle_year INT NOT NULL,
    sowing_date DATE,
    harvest_date DATE,
    yield_quintal_per_acre NUMERIC(6, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Fertilizer & Nutrient Logs
CREATE TABLE IF NOT EXISTS public.fertilizer_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    application_date DATE DEFAULT CURRENT_DATE,
    input_type TEXT NOT NULL, -- 'Synthetic', 'Bio-fertilizer', 'Manure'
    product_name TEXT NOT NULL,
    quantity_kg_per_acre NUMERIC(6, 2) NOT NULL,
    method TEXT, -- 'Broadcasting', 'Foliar Spray', 'Fertigation'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Farmer Qualitative Feedback & Symptoms
CREATE TABLE IF NOT EXISTS public.farmer_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    observed_date DATE DEFAULT CURRENT_DATE,
    observation_text TEXT NOT NULL,
    audio_voice_note_url TEXT,
    symptoms_tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Satellite Snapshots (Remote Sensing Cache)
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

-- 9. Gemini Multimodal Recommendations
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    target_season TEXT NOT NULL,
    recommended_crop TEXT NOT NULL,
    recommended_variety TEXT,
    confidence_score NUMERIC(4, 2),
    summary_rationale TEXT NOT NULL,
    full_gemini_payload JSONB NOT NULL,
    farmer_accepted BOOLEAN DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertilizer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.satellite_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Public / Authenticated Access Policies
CREATE POLICY "Allow public read access on farms" ON public.farms FOR SELECT USING (true);
CREATE POLICY "Allow public insert on farms" ON public.farms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public all on recommendations" ON public.ai_recommendations FOR ALL USING (true);
CREATE POLICY "Allow public all on soil records" ON public.soil_health_records FOR ALL USING (true);
CREATE POLICY "Allow public all on satellite snapshots" ON public.satellite_snapshots FOR ALL USING (true);
