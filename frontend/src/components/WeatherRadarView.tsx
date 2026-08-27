"use client";

import React from "react";
import { 
  CloudRain, 
  Sun, 
  Thermometer, 
  Droplets 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area 
} from "recharts";
import { WeatherTelemetry } from "@/types";
import MicroclimateSprayForecaster from "@/components/MicroclimateSprayForecaster";

interface WeatherRadarViewProps {
  weather: WeatherTelemetry | null;
  loading: boolean;
  farmName?: string;
}

export default function WeatherRadarView({ 
  weather, 
  loading,
  farmName = "My Farm Plot",
}: WeatherRadarViewProps) {
  if (loading || !weather) {
    return (
      <div className="h-80 bg-[#F0EBE5]/60 rounded-[2.25rem] border border-[#DED8CF] animate-pulse flex items-center justify-center text-[#78786C] text-xs">
        Loading ECMWF Meteorological Physics...
      </div>
    );
  }

  const current = weather.current;
  const soilPhys = current.soil_physics;
  const forecast14 = weather.forecast_14_days || [];

  const soilTempDepthData = [
    { depth: "Surface (0cm)", temp_c: soilPhys.soil_temp_surface_c },
    { depth: "Seed Bed (6cm)", temp_c: soilPhys.soil_temp_6cm_c },
    { depth: "Root Core (18cm)", temp_c: soilPhys.soil_temp_18cm_c },
    { depth: "Subsoil (54cm)", temp_c: soilPhys.soil_temp_54cm_c },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Top Metrics Quick Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-[#FEFEFA] p-5 rounded-[2rem] border border-[#DED8CF] shadow-soft flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20 flex items-center justify-center">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#78786C] block">14-Day Rain Sum</span>
            <span className="text-xl font-bold font-serif text-[#2C2C24]">
              {weather.agronomic_summary.total_predicted_14d_rainfall_mm} mm
            </span>
          </div>
        </div>

        <div className="bg-[#FEFEFA] p-5 rounded-[2rem] border border-[#DED8CF] shadow-soft flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#C18C5D]/10 text-[#C18C5D] border border-[#C18C5D]/20 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#78786C] block">Daily FAO ET0</span>
            <span className="text-xl font-bold font-serif text-[#C18C5D]">
              {weather.agronomic_summary.average_daily_evapotranspiration_mm} mm/d
            </span>
          </div>
        </div>

        <div className="bg-[#FEFEFA] p-5 rounded-[2rem] border border-[#DED8CF] shadow-soft flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20 flex items-center justify-center">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#78786C] block">Ambient Temp</span>
            <span className="text-xl font-bold font-serif text-[#2C2C24]">
              {current.temperature_celsius} °C
            </span>
          </div>
        </div>

        <div className="bg-[#FEFEFA] p-5 rounded-[2rem] border border-[#DED8CF] shadow-soft flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#C18C5D]/10 text-[#C18C5D] border border-[#C18C5D]/20 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#78786C] block">Humidity</span>
            <span className="text-xl font-bold font-serif text-[#2C2C24]">
              {current.relative_humidity_pct}%
            </span>
          </div>
        </div>

      </div>

      {/* 2. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 14-Day Precipitation & ET0 Balance Chart */}
        <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#2C2C24] font-serif">
                14-Day Cumulative Rainfall (mm) vs Evapotranspiration Loss (ET0)
              </h3>
              <p className="text-xs text-[#78786C]">
                Water balance timeline to schedule supplemental drip cycles
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20 font-bold">
              ECMWF Model
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecast14} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                <XAxis dataKey="date" stroke="#78786C" fontSize={10} tickFormatter={(d) => d.slice(5)} />
                <YAxis stroke="#78786C" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#FEFEFA", borderColor: "#DED8CF", borderRadius: "1rem", fontSize: "11px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="rain_sum_mm" name="Rainfall (mm)" fill="#5D7052" radius={[4, 4, 0, 0]} />
                <Bar dataKey="et0_fao_mm" name="Daily ET0 Loss (mm)" fill="#C18C5D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Soil Temperature Profile at 4 Layers */}
        <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#2C2C24] font-serif">
                Soil Thermal Profile Across Profile Depths (°C)
              </h3>
              <p className="text-xs text-[#78786C]">
                Determines seed germination velocity and microbial enzymatic activity
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#C18C5D]/10 text-[#C18C5D] border border-[#C18C5D]/20 font-bold">
              4 Physical Layers
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={soilTempDepthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                <XAxis dataKey="depth" stroke="#78786C" fontSize={10} />
                <YAxis stroke="#78786C" fontSize={11} domain={[15, 35]} />
                <Tooltip contentStyle={{ backgroundColor: "#FEFEFA", borderColor: "#DED8CF", borderRadius: "1rem", fontSize: "11px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="temp_c" name="Soil Temp (°C)" stroke="#C18C5D" fill="#C18C5D" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 14-Day Optimal Spray Window & Drift Forecaster */}
      <MicroclimateSprayForecaster
        weather={weather}
        farmName={farmName}
      />

    </div>
  );
}
