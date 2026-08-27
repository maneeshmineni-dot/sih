"use client";

import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  CloudRain, 
  Activity, 
  Info,
  Sparkles 
} from "lucide-react";

// State Agricultural Yield & Production Data
const stateProductionData = [
  { state: "Punjab", wheat_yield: 5.12, rice_yield: 4.38, soil_index: 84 },
  { state: "Maharashtra", soybean_yield: 2.85, cotton_yield: 1.94, soil_index: 78 },
  { state: "Uttar Pradesh", wheat_yield: 3.84, sugarcane_yield: 72.4, soil_index: 75 },
  { state: "Madhya Pradesh", soybean_yield: 2.42, chickpea_yield: 1.78, soil_index: 81 },
  { state: "Andhra Pradesh", rice_yield: 4.15, groundnut_yield: 1.62, soil_index: 76 },
  { state: "Gujarat", groundnut_yield: 2.10, cotton_yield: 2.25, soil_index: 79 },
];

// Historical Climate vs Yield Correlation (2018 - 2024)
const climateImpactData = [
  { year: "2018", rainfall_mm: 1040, national_yield_t_ha: 2.32, economic_loss_m_inr: 420 },
  { year: "2019", rainfall_mm: 1280, national_yield_t_ha: 2.48, economic_loss_m_inr: 310 },
  { year: "2020", rainfall_mm: 1210, national_yield_t_ha: 2.56, economic_loss_m_inr: 290 },
  { year: "2021", rainfall_mm: 1180, national_yield_t_ha: 2.62, economic_loss_m_inr: 340 },
  { year: "2022", rainfall_mm: 1090, national_yield_t_ha: 2.58, economic_loss_m_inr: 580 },
  { year: "2023", rainfall_mm: 1010, national_yield_t_ha: 2.64, economic_loss_m_inr: 720 },
  { year: "2024", rainfall_mm: 1195, national_yield_t_ha: 2.76, economic_loss_m_inr: 380 },
];

// Multi-dimensional Soil Health & Fertility Radar
const soilHealthRadar = [
  { crop: "Soybean", soil_health_score: 82, nitrogen_fixation: 94, organic_carbon: 78, moisture_efficiency: 85 },
  { crop: "Chickpea", soil_health_score: 88, nitrogen_fixation: 96, organic_carbon: 74, moisture_efficiency: 92 },
  { crop: "Wheat", soil_health_score: 79, nitrogen_fixation: 35, organic_carbon: 82, moisture_efficiency: 78 },
  { crop: "Maize", soil_health_score: 71, nitrogen_fixation: 25, organic_carbon: 70, moisture_efficiency: 68 },
  { crop: "Cotton", soil_health_score: 68, nitrogen_fixation: 30, organic_carbon: 65, moisture_efficiency: 72 },
  { crop: "Rice", soil_health_score: 74, nitrogen_fixation: 40, organic_carbon: 80, moisture_efficiency: 54 },
];

export default function NationalAnalytics() {
  const [activeTab, setActiveTab] = useState<"yield" | "climate" | "radar">("yield");

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#2C2C24] font-serif">
              National Agricultural Analytics & Climate Resilience Matrix
            </h2>
          </div>
          <p className="text-xs text-[#78786C] mt-1 font-medium">
            Aggregated time-series agronomic benchmarks, state-level yield distributions, and ICAR soil stability indicators.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#F0EBE5]/60 p-1.5 rounded-full border border-[#DED8CF] text-xs">
          <button
            onClick={() => setActiveTab("yield")}
            className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              activeTab === "yield"
                ? "bg-[#5D7052] text-[#FEFEFA] shadow-soft"
                : "text-[#78786C] hover:text-[#2C2C24]"
            }`}
          >
            State Yields
          </button>
          <button
            onClick={() => setActiveTab("climate")}
            className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              activeTab === "climate"
                ? "bg-[#5D7052] text-[#FEFEFA] shadow-soft"
                : "text-[#78786C] hover:text-[#2C2C24]"
            }`}
          >
            Rainfall vs Yield
          </button>
          <button
            onClick={() => setActiveTab("radar")}
            className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              activeTab === "radar"
                ? "bg-[#5D7052] text-[#FEFEFA] shadow-soft"
                : "text-[#78786C] hover:text-[#2C2C24]"
            }`}
          >
            Soil Health Radar
          </button>
        </div>
      </div>

      {/* 1. STATE YIELD BENCHMARKS TAB */}
      {activeTab === "yield" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#2C2C24] font-serif">
                  State-Wise Major Crop Yields (Tonnes / Hectare)
                </h3>
                <p className="text-xs text-[#78786C]">
                  High-productivity irrigated belts vs rainfed black cotton zones
                </p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20 font-bold">
                ICAR 2024
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateProductionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                  <XAxis dataKey="state" stroke="#78786C" fontSize={11} />
                  <YAxis stroke="#78786C" fontSize={11} domain={[0, 6]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FEFEFA", borderColor: "#DED8CF", borderRadius: "1rem", fontSize: "11px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="wheat_yield" name="Wheat Yield (t/ha)" fill="#5D7052" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="soybean_yield" name="Soybean Yield (t/ha)" fill="#C18C5D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
              <Sparkles className="w-4 h-4 text-[#5D7052] shrink-0" />
              <span>Punjab leads in cereal yields; Central India (MH/MP) excels in legume oilseed efficiency.</span>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#2C2C24] font-serif">
                  Regional Soil Health Index (0-100)
                </h3>
                <p className="text-xs text-[#78786C]">
                  Soil organic resilience against seasonal monsoon fluctuations
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stateProductionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                  <XAxis dataKey="state" stroke="#78786C" fontSize={11} />
                  <YAxis stroke="#78786C" fontSize={11} domain={[50, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FEFEFA", borderColor: "#DED8CF", borderRadius: "1rem", fontSize: "11px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="soil_index" name="Soil Health Score" stroke="#5D7052" fill="#5D7052" fillOpacity={0.25} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
              <Activity className="w-4 h-4 text-[#5D7052] shrink-0" />
              <span>States with active legume crop rotation maintain Soil Health Indices above 80 points.</span>
            </div>
          </div>

        </div>
      )}

      {/* 2. RAINFALL VS YIELD CORRELATION TAB */}
      {activeTab === "climate" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#2C2C24] font-serif">
                  National Rainfall (mm) vs Crop Productivity (t/ha)
                </h3>
                <p className="text-xs text-[#78786C]">
                  Decoupling of crop yields from drought stress via precision agro-climate systems
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={climateImpactData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                  <XAxis dataKey="year" stroke="#78786C" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#5D7052" fontSize={11} domain={[900, 1400]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#C18C5D" fontSize={11} domain={[2.0, 3.0]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FEFEFA", borderColor: "#DED8CF", borderRadius: "1rem", fontSize: "11px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line yAxisId="left" type="monotone" dataKey="rainfall_mm" name="Rainfall (mm)" stroke="#5D7052" strokeWidth={2.5} />
                  <Line yAxisId="right" type="monotone" dataKey="national_yield_t_ha" name="National Yield (t/ha)" stroke="#C18C5D" strokeWidth={2.5} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
              <CloudRain className="w-4 h-4 text-[#5D7052] shrink-0" />
              <span>Yield growth continues upward trajectory despite sub-1050mm rain in 2023 due to micro-irrigation expansion.</span>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#2C2C24] font-serif">
                  Extreme Weather Crop Damage (₹ Crores INR)
                </h3>
                <p className="text-xs text-[#78786C]">
                  Unseasonal hailstorms, early heatwaves, and flood incidents
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={climateImpactData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                  <XAxis dataKey="year" stroke="#78786C" fontSize={11} />
                  <YAxis stroke="#78786C" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FEFEFA", borderColor: "#DED8CF", borderRadius: "1rem", fontSize: "11px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="economic_loss_m_inr" name="Estimated Weather Loss (₹ Cr)" fill="#A85448" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
              <Info className="w-4 h-4 text-[#A85448] shrink-0" />
              <span>2023 saw terminal heat spikes impacting wheat; AgriSense early warning avoids late-sowing penalties.</span>
            </div>
          </div>

        </div>
      )}

      {/* 3. SOIL HEALTH RADAR TAB */}
      {activeTab === "radar" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#2C2C24] font-serif">
                  Crop-Wise Soil Rehabilitation & Nutrition Radar
                </h3>
                <p className="text-xs text-[#78786C]">
                  Compares Nitrogen nodulation vs Soil Organic Carbon preservation
                </p>
              </div>
            </div>

            <div className="h-72 w-full flex items-center justify-center pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={soilHealthRadar}>
                  <PolarGrid stroke="#DED8CF" />
                  <PolarAngleAxis dataKey="crop" stroke="#78786C" fontSize={11} />
                  <PolarRadiusAxis stroke="#5D7052" fontSize={9} domain={[0, 100]} />
                  <Radar name="Soil Health Score" dataKey="soil_health_score" stroke="#5D7052" fill="#5D7052" fillOpacity={0.35} />
                  <Radar name="Nitrogen Fixation Index" dataKey="nitrogen_fixation" stroke="#C18C5D" fill="#C18C5D" fillOpacity={0.25} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#FEFEFA", borderColor: "#DED8CF", borderRadius: "1rem", fontSize: "11px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
              <Activity className="w-4 h-4 text-[#5D7052] shrink-0" />
              <span>Chickpea and Soybean score 96% and 94% in biological nitrogen replenishment.</span>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#2C2C24] font-serif">
                  Water-Use Efficiency & Moisture Envelope
                </h3>
                <p className="text-xs text-[#78786C]">
                  Crop suitability in root zone moisture conditions
                </p>
              </div>
            </div>

            <div className="h-72 w-full flex items-center justify-center pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={soilHealthRadar}>
                  <PolarGrid stroke="#DED8CF" />
                  <PolarAngleAxis dataKey="crop" stroke="#78786C" fontSize={11} />
                  <PolarRadiusAxis stroke="#5D7052" fontSize={9} domain={[0, 100]} />
                  <Radar name="Moisture Efficiency" dataKey="moisture_efficiency" stroke="#5D7052" fill="#5D7052" fillOpacity={0.35} />
                  <Radar name="Organic Carbon Retention" dataKey="organic_carbon" stroke="#C18C5D" fill="#C18C5D" fillOpacity={0.25} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#FEFEFA", borderColor: "#DED8CF", borderRadius: "1rem", fontSize: "11px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
              <Sparkles className="w-4 h-4 text-[#C18C5D] shrink-0" />
              <span>Legumes achieve optimal photosynthetic productivity with 40% less irrigation than cereal monocultures.</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
