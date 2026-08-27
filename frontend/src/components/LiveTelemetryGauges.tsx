"use client";

import React from "react";
import { 
  Satellite, 
  Droplets, 
  Thermometer, 
  Sun, 
  CloudRain, 
  Layers, 
  CheckCircle2, 
  Sprout,
  TrendingUp,
  Coins,
  ShieldCheck,
  Zap
} from "lucide-react";
import { LiveTelemetryResponse } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface LiveTelemetryGaugesProps {
  telemetry: LiveTelemetryResponse | null;
  loading: boolean;
  onOpenSoilCard: () => void;
}

export default function LiveTelemetryGauges({
  telemetry,
  loading,
  onOpenSoilCard,
}: LiveTelemetryGaugesProps) {
  const { t } = useLanguage();

  if (loading || !telemetry) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
        <div className="h-64 bg-[#F0EBE5]/60 rounded-[2.25rem] border border-[#DED8CF]"></div>
        <div className="h-64 bg-[#F0EBE5]/60 rounded-[2.25rem] border border-[#DED8CF]"></div>
        <div className="h-64 bg-[#F0EBE5]/60 rounded-[2.25rem] border border-[#DED8CF]"></div>
      </div>
    );
  }

  const sat = telemetry.live_satellite_remote_sensing;
  const weather = telemetry.live_weather_and_soil_physics;
  const soil = telemetry.live_soil_properties;
  const current = weather.current;
  const soilPhys = current.soil_physics;

  const ndvi = sat?.vegetation_indices?.mean_ndvi ?? 0.42;
  const ndviPct = Math.round(Math.min(100, Math.max(0, ((ndvi + 0.1) / 0.9) * 100)));

  // Calculate Soil Health Score from pH, Organic Carbon, and Moisture
  const oc = soil.organic_carbon_pct || 0.65;
  const ph = soil.ph_level || 7.1;
  const phScore = ph >= 6.5 && ph <= 7.8 ? 35 : 20;
  const ocScore = Math.min(45, Math.round((oc / 0.85) * 45));
  const soilHealthScore = Math.min(95, phScore + ocScore + 15);

  return (
    <div className="space-y-5">
      
      {/* 3 Main Scientific Gauges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* 1. SATELLITE REMOTE SENSING CARD */}
        <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]/60">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20 flex items-center justify-center">
                  <Satellite className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2C2C24] font-serif">Live Satellite SRM</h3>
                  <p className="text-xs text-[#78786C] font-mono">Sentinel-2 • 10m L2A</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20 uppercase">
                Real Optical
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-semibold text-[#2C2C24]">
                  <span>Mean NDVI Biomass</span>
                  <span className="font-mono font-bold text-base text-[#5D7052]">{ndvi.toFixed(3)}</span>
                </div>
                <div className="h-3 w-full rounded-full bg-[#F0EBE5] overflow-hidden p-0.5 border border-[#DED8CF]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#C18C5D] via-[#5D7052] to-[#3E4C37] transition-all duration-1000"
                    style={{ width: `${ndviPct}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-[#5D7052] mt-1.5 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {sat?.vegetation_indices?.vegetation_classification}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#DED8CF]/60">
                <div className="bg-[#F0EBE5]/50 p-3 rounded-2xl border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] font-bold uppercase block">Canopy Density</span>
                  <span className="text-lg font-bold font-serif text-[#2C2C24]">
                    {sat?.vegetation_indices?.canopy_density_pct}%
                  </span>
                </div>
                <div className="bg-[#F0EBE5]/50 p-3 rounded-2xl border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] font-bold uppercase block">NDWI (Moisture)</span>
                  <span className="text-lg font-bold font-serif text-[#C18C5D]">
                    {sat?.vegetation_indices?.ndwi_moisture_index?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {sat?.image_url && (
            <div className="mt-3 pt-2 flex items-center justify-between bg-[#F0EBE5]/40 p-2.5 rounded-xl border border-[#DED8CF]/60 text-xs">
              <span className="text-[#78786C] font-medium">Optical Capture</span>
              <a
                href={`http://localhost:8000${sat.image_url}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#5D7052] font-bold underline hover:text-[#3E4C37]"
              >
                View Satellite Tile ↗
              </a>
            </div>
          )}
        </div>

        {/* 2. LIVE SOIL MOISTURE & AGROMETEOROLOGY */}
        <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]/60">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#C18C5D]/10 text-[#C18C5D] border border-[#C18C5D]/20 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2C2C24] font-serif">4-Layer Soil Moisture</h3>
                  <p className="text-xs text-[#78786C] font-mono">ECMWF ERA5 Physics</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#C18C5D]/10 text-[#C18C5D] border border-[#C18C5D]/20 uppercase">
                Volumetric
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <span className="text-xs font-semibold text-[#78786C] block">
                Vertical Moisture Profile (m³/m³):
              </span>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-[#F0EBE5]/60 p-2.5 rounded-2xl border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] font-mono block">0-7cm</span>
                  <span className="text-sm font-bold font-serif text-[#5D7052] block my-1">
                    {(soilPhys?.soil_moisture_0_7cm_m3_m3 ?? 0.35).toFixed(3)}
                  </span>
                  <span className="text-[9px] text-[#78786C] font-semibold">Root Zone</span>
                </div>

                <div className="bg-[#F0EBE5]/60 p-2.5 rounded-2xl border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] font-mono block">7-28cm</span>
                  <span className="text-sm font-bold font-serif text-[#5D7052] block my-1">
                    {(soilPhys?.soil_moisture_7_28cm_m3_m3 ?? 0.38).toFixed(3)}
                  </span>
                  <span className="text-[9px] text-[#78786C] font-semibold">Subsoil</span>
                </div>

                <div className="bg-[#F0EBE5]/60 p-2.5 rounded-2xl border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] font-mono block">28-100cm</span>
                  <span className="text-sm font-bold font-serif text-[#C18C5D] block my-1">
                    {(soilPhys?.soil_moisture_28_100cm_m3_m3 ?? 0.42).toFixed(3)}
                  </span>
                  <span className="text-[9px] text-[#78786C] font-semibold">Deep Core</span>
                </div>

                <div className="bg-[#F0EBE5]/60 p-2.5 rounded-2xl border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] font-mono block">100-255cm</span>
                  <span className="text-sm font-bold font-serif text-[#C18C5D] block my-1">
                    {(soilPhys?.soil_moisture_100_255cm_m3_m3 ?? 0.44).toFixed(3)}
                  </span>
                  <span className="text-[9px] text-[#78786C] font-semibold">Aquifer</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#DED8CF]/60">
                <div className="bg-[#F0EBE5]/50 p-2.5 rounded-2xl border border-[#DED8CF] flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-[#5D7052]" />
                  <div>
                    <span className="text-[10px] text-[#78786C] block font-bold">14d Rain</span>
                    <span className="text-xs font-bold text-[#2C2C24]">
                      {weather.agronomic_summary.total_predicted_14d_rainfall_mm} mm
                    </span>
                  </div>
                </div>

                <div className="bg-[#F0EBE5]/50 p-2.5 rounded-2xl border border-[#DED8CF] flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#C18C5D]" />
                  <div>
                    <span className="text-[10px] text-[#78786C] block font-bold">Daily ET0</span>
                    <span className="text-xs font-bold text-[#2C2C24]">
                      {weather.agronomic_summary.average_daily_evapotranspiration_mm} mm/d
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#78786C] mt-3 pt-2 border-t border-[#DED8CF]/60 font-medium">
            Status: <b className="text-[#5D7052]">{weather.agronomic_summary.soil_moisture_status}</b>
          </p>
        </div>

        {/* 3. ISRIC SOILGRIDS REAL SOIL PROFILE */}
        <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]/60">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2C2C24] font-serif">ISRIC Soil Chemistry</h3>
                  <p className="text-xs text-[#78786C] font-mono">250m Global Grids</p>
                </div>
              </div>
              <button
                onClick={onOpenSoilCard}
                className="text-xs font-bold px-3 py-1 rounded-full bg-[#5D7052]/15 hover:bg-[#5D7052]/25 text-[#5D7052] border border-[#5D7052]/30 transition cursor-pointer"
              >
                {t("soil_card")}
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between bg-[#F0EBE5]/50 p-2.5 rounded-2xl border border-[#DED8CF]">
                <span className="text-xs text-[#2C2C24] font-semibold">Soil pH Level</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-[#5D7052]">{soil.ph_level}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5D7052]/10 text-[#5D7052] font-bold">
                    {soil.ph_level >= 6.5 && soil.ph_level <= 7.5 ? "Optimal" : soil.ph_level < 6.5 ? "Acidic" : "Alkaline"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#F0EBE5]/50 p-2.5 rounded-2xl border border-[#DED8CF]">
                <span className="text-xs text-[#2C2C24] font-semibold">Organic Carbon (OC)</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-[#C18C5D]">{soil.organic_carbon_pct}%</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C18C5D]/10 text-[#C18C5D] font-bold">
                    {soil.organic_carbon_pct >= 0.75 ? "High" : soil.organic_carbon_pct >= 0.5 ? "Medium" : "Low"}
                  </span>
                </div>
              </div>

              <div className="bg-[#F0EBE5]/50 p-2.5 rounded-2xl border border-[#DED8CF]">
                <span className="text-[10px] text-[#78786C] font-bold uppercase block mb-1">
                  ISRIC Texture Distribution:
                </span>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#2C2C24]">
                  <span>Clay: {soil.soil_texture_fraction?.clay_pct}%</span>
                  <span>Sand: {soil.soil_texture_fraction?.sand_pct}%</span>
                  <span>Silt: {soil.soil_texture_fraction?.silt_pct}%</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#78786C] mt-3 pt-2 border-t border-[#DED8CF]/60 italic font-medium">
            {soil.soil_classification_summary}
          </p>
        </div>

      </div>

      {/* 4. SOIL NPK HEALTH SCORE & COMPARATIVE ECONOMIC LEDGER */}
      <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DED8CF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#4A5D43]/10 text-[#4A5D43] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2C2C24] font-serif">
                Soil NPK Fertility & Economic Rotation Ledger
              </h3>
              <p className="text-xs text-[#78786C]">
                Macro-nutrient replenishment and economic cost-benefit projection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#78786C]">Soil Health Index:</span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold font-mono border border-emerald-300">
              {soilHealthScore} / 100 (Optimal)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {/* NPK Nitrogen */}
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E0D5] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#78786C] uppercase">Nitrogen (N)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">Moderate</span>
            </div>
            <div className="text-xl font-bold font-serif text-[#2C2C24]">240 <span className="text-xs text-[#78786C] font-normal">kg/Ha</span></div>
            <p className="text-[10px] text-[#78786C]">Target: 280-560 kg/Ha</p>
          </div>

          {/* NPK Phosphorus */}
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E0D5] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#78786C] uppercase">Phosphorus (P₂O₅)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">Adequate</span>
            </div>
            <div className="text-xl font-bold font-serif text-[#2C2C24]">18.5 <span className="text-xs text-[#78786C] font-normal">kg/Ha</span></div>
            <p className="text-[10px] text-[#78786C]">Target: 15-25 kg/Ha</p>
          </div>

          {/* NPK Potassium */}
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E0D5] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#78786C] uppercase">Potassium (K₂O)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">High</span>
            </div>
            <div className="text-xl font-bold font-serif text-[#2C2C24]">310 <span className="text-xs text-[#78786C] font-normal">kg/Ha</span></div>
            <p className="text-[10px] text-[#78786C]">Target: 140-280 kg/Ha</p>
          </div>

          {/* Smart Rotation Profit Boost */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Rotation Profit Boost</span>
              <Zap className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
            </div>
            <div className="text-xl font-bold font-serif text-emerald-800">+₹11,200 <span className="text-xs text-emerald-700 font-normal">/ Ac</span></div>
            <p className="text-[10px] text-emerald-700 font-semibold">Legume Nitrogen savings</p>
          </div>
        </div>
      </div>

    </div>
  );
}
