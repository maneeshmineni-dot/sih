"use client";

import React from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Satellite, 
  Layers, 
  ShieldCheck, 
  Globe, 
  Sprout, 
  Compass, 
  CheckCircle2,
  TrendingUp,
  Cpu,
  LogIn
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface HomeOverviewHeroProps {
  onOpenDashboard: () => void;
  onExploreFeatures: () => void;
}

export default function HomeOverviewHero({
  onOpenDashboard,
  onExploreFeatures,
}: HomeOverviewHeroProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleDashboardClick = () => {
    if (user) {
      onOpenDashboard();
    } else {
      router.push("/login");
    }
  };

  const handleExploreClick = () => {
    if (user) {
      onExploreFeatures();
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="space-y-12 py-4 sm:py-8 text-center max-w-5xl mx-auto">
      
      {/* 1. Top Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAE6DD] text-[#3D4C37] text-xs font-bold border border-[#DAD5C9] shadow-soft animate-in fade-in duration-300">
        <Sparkles className="w-3.5 h-3.5 text-[#4A5D43]" />
        <span>Next-Gen Agricultural Intelligence & Cloud SRM • SIH 2026</span>
      </div>

      {/* 2. Hero Headline */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#2C2C24] font-serif leading-[1.12]">
          Precision Agronomy Powered by{" "}
          <span className="text-[#4A5D43] italic font-normal block sm:inline">
            Super-Resolution Satellites
          </span>{" "}
          <span className="font-light">&</span> AI
        </h1>

        <p className="text-sm sm:text-base text-[#6B665C] max-w-2xl mx-auto leading-relaxed font-medium">
          Unifying ISRO/Sentinel sub-meter satellite super-resolution, ICAR soil health diagnostics, and Krishi Mitra AI to empower Indian farmers with data-driven yield precision.
        </p>
      </div>

      {/* 3. Hero CTA Buttons (Guarded by Login) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
        <button
          onClick={handleDashboardClick}
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#4A5D43] hover:bg-[#3A4B34] text-white font-bold text-sm shadow-soft-lg hover:shadow-soft transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 group hover:scale-[1.02] active:scale-[0.98]"
        >
          {user ? (
            <>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              <span>Open My Farm Dashboard</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 text-white" />
              <span>Sign In to Access Farm Dashboard</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <button
          onClick={handleExploreClick}
          className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#FEFEFA] hover:bg-[#FAF8F3] text-[#2C2C24] font-bold text-sm border border-[#DAD5C9] shadow-soft transition-all duration-200 cursor-pointer hover:border-[#4A5D43] flex items-center justify-center gap-2"
        >
          <span>{user ? "Explore Platform Features" : "Sign In to Explore Features"}</span>
          {!user && <LogIn className="w-3.5 h-3.5 text-[#4A5D43]" />}
        </button>
      </div>

      {/* 4. Bottom 4 Feature Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
        
        {/* Card 1 */}
        <div className="bg-[#FEFEFA] rounded-3xl p-5 border border-[#EAE6DD] shadow-soft text-left space-y-1 hover:border-[#4A5D43] transition-all group">
          <span className="text-[10px] uppercase font-extrabold text-[#8A857A] tracking-wider block font-sans">
            SUPER-RESOLUTION
          </span>
          <h4 className="text-base sm:text-lg font-bold text-[#2C2C24] font-serif group-hover:text-[#4A5D43] transition-colors">
            2.5m Sub-Meter
          </h4>
          <p className="text-xs text-[#6B665C] font-medium">
            GeoSR-AI multispectral
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#FEFEFA] rounded-3xl p-5 border border-[#EAE6DD] shadow-soft text-left space-y-1 hover:border-[#4A5D43] transition-all group">
          <span className="text-[10px] uppercase font-extrabold text-[#8A857A] tracking-wider block font-sans">
            SOIL KNOWLEDGE
          </span>
          <h4 className="text-base sm:text-lg font-bold text-[#2C2C24] font-serif group-hover:text-[#4A5D43] transition-colors">
            100% ICAR-Grounded
          </h4>
          <p className="text-xs text-[#6B665C] font-medium">
            Government soil health
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#FEFEFA] rounded-3xl p-5 border border-[#EAE6DD] shadow-soft text-left space-y-1 hover:border-[#4A5D43] transition-all group">
          <span className="text-[10px] uppercase font-extrabold text-[#8A857A] tracking-wider block font-sans">
            CLOUD PRIVACY
          </span>
          <h4 className="text-base sm:text-lg font-bold text-[#2C2C24] font-serif group-hover:text-[#4A5D43] transition-colors">
            User Isolated DB
          </h4>
          <p className="text-xs text-[#6B665C] font-medium">
            Row-Level Security
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-[#FEFEFA] rounded-3xl p-5 border border-[#EAE6DD] shadow-soft text-left space-y-1 hover:border-[#4A5D43] transition-all group">
          <span className="text-[10px] uppercase font-extrabold text-[#8A857A] tracking-wider block font-sans">
            DECISION ENGINE
          </span>
          <h4 className="text-base sm:text-lg font-bold text-[#2C2C24] font-serif group-hover:text-[#4A5D43] transition-colors">
            Gemini 3.6 Multimodal
          </h4>
          <p className="text-xs text-[#6B665C] font-medium">
            Stage-by-stage schedule
          </p>
        </div>

      </div>

    </div>
  );
}
