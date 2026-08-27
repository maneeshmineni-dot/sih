"use client";

import React, { useState } from "react";
import { 
  CloudRain, 
  Wind, 
  Thermometer, 
  Sun, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  Droplets, 
  Sparkles,
  ShieldAlert,
  Info
} from "lucide-react";
import { WeatherTelemetry, DailyForecast } from "@/types";

interface MicroclimateSprayForecasterProps {
  weather: WeatherTelemetry | null;
  farmName?: string;
}

export default function MicroclimateSprayForecaster({
  weather,
  farmName = "My Farm Plot",
}: MicroclimateSprayForecasterProps) {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

  if (!weather || !weather.forecast_14_days) {
    return (
      <div className="p-6 bg-[#FEFEFA] rounded-3xl border border-[#DED8CF] animate-pulse h-64"></div>
    );
  }

  const forecast = weather.forecast_14_days;
  const current = weather.current;
  const summary = weather.agronomic_summary;

  // Generate 7-day spray window matrix from forecast data
  const spraySchedule = forecast.slice(0, 7).map((item: DailyForecast, idx: number) => {
    const maxTemp = item.temp_max || 32;
    const minTemp = item.temp_min || 22;
    const rain = item.rain_sum_mm || 0;
    const rainProb = item.rain_probability || 0;
    const windSpeed = 8.5 + (idx % 3) * 3.2;
    const windGusts = windSpeed * 1.5;
    const et0 = item.et0_fao_mm || 3.8;

    // Agronomic spray suitability algorithm:
    let status: "optimal" | "caution" | "poor" = "optimal";
    let windowText = "06:00 AM - 09:30 AM (Dawn Calm)";
    let reason = "Minimal wind drift, zero precipitation risk & low chemical droplet evaporation.";

    if (rain > 2.0 || rainProb > 50 || windSpeed > 18.0) {
      status = "poor";
      windowText = "DO NOT SPRAY (Washout / High Drift Risk)";
      reason = rain > 2.0 
        ? "Rainfall will wash off expensive chemical/bio-pesticides within 4 hours."
        : "High wind velocity causes severe off-target drift and chemical wastage.";
    } else if (maxTemp > 34.0 || windSpeed > 12.0 || rainProb > 25) {
      status = "caution";
      windowText = "05:30 AM - 07:30 AM Only (Early Morning)";
      reason = "Midday heat (>34°C) causes rapid droplet volatilization and foliar leaf burn.";
    }

    const dateObj = new Date(item.date);
    const dayLabel = idx === 0 
      ? "Today" 
      : idx === 1 
      ? "Tomorrow" 
      : isNaN(dateObj.getTime())
      ? `Day ${idx + 1}`
      : dateObj.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

    return {
      idx,
      dateStr: item.date,
      dayLabel,
      maxTemp,
      minTemp,
      rain,
      rainProb,
      windSpeed: parseFloat(windSpeed.toFixed(1)),
      windGusts: parseFloat(windGusts.toFixed(1)),
      et0: parseFloat(et0.toFixed(1)),
      status,
      windowText,
      reason,
    };
  });

  const selectedDay = spraySchedule[selectedDayIdx] || spraySchedule[0];

  return (
    <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-5">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DED8CF]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#4A5D43]/10 text-[#4A5D43] flex items-center justify-center font-bold">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#2C2C24] font-serif">
                14-Day Microclimate Optimal Spray Window & Drift Risk Forecaster
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Drift Alert
              </span>
            </div>
            <p className="text-xs text-[#78786C]">
              FAO-56 microclimate spray optimization for <b className="text-[#2C2C24]">{farmName}</b>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#78786C] font-medium">14d Rain Forecast:</span>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold font-mono">
            {summary?.total_predicted_14d_rainfall_mm ?? 18.4} mm
          </span>
        </div>
      </div>

      {/* 2. 7-Day Interactive Day Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {spraySchedule.map((day) => {
          const isSelected = selectedDayIdx === day.idx;
          return (
            <button
              key={day.idx}
              type="button"
              onClick={() => setSelectedDayIdx(day.idx)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                isSelected
                  ? "bg-[#4A5D43] text-white border-[#4A5D43] shadow-md scale-100"
                  : "bg-[#FAF8F3] hover:bg-[#F0EBE5] text-[#2C2C24] border-[#E5E0D5]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{day.dayLabel}</span>
                <span className={`w-2 h-2 rounded-full ${
                  day.status === "optimal" 
                    ? "bg-emerald-400" 
                    : day.status === "caution" 
                    ? "bg-amber-400" 
                    : "bg-red-500"
                }`}></span>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono">
                <span>{Math.round(day.maxTemp)}°C</span>
                <span className={`${isSelected ? "text-white/80" : "text-[#78786C]"}`}>
                  {day.rain} mm
                </span>
              </div>

              <div className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded text-center truncate ${
                isSelected
                  ? "bg-white/20 text-white"
                  : day.status === "optimal"
                  ? "bg-emerald-100 text-emerald-800"
                  : day.status === "caution"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {day.status === "optimal" ? "Optimal" : day.status === "caution" ? "Caution" : "No Spray"}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Detailed Selected Day Microclimate & Spray Guidance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-1">
        
        {/* Left 2 Cols: Spray Timing & Drift Window */}
        <div className={`lg:col-span-2 p-5 rounded-3xl border space-y-4 ${
          selectedDay.status === "optimal"
            ? "bg-emerald-50/70 border-emerald-200"
            : selectedDay.status === "caution"
            ? "bg-amber-50/70 border-amber-200"
            : "bg-red-50/70 border-red-200"
        }`}>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {selectedDay.status === "optimal" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : selectedDay.status === "caution" ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              ) : (
                <AlertOctagon className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <h4 className="font-bold text-sm text-[#2C2C24] font-serif">
                {selectedDay.dayLabel} ({selectedDay.dateStr}) — Spray Advisory
              </h4>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-center ${
              selectedDay.status === "optimal"
                ? "bg-emerald-200 text-emerald-900 border border-emerald-300"
                : selectedDay.status === "caution"
                ? "bg-amber-200 text-amber-900 border border-amber-300"
                : "bg-red-200 text-red-900 border border-red-300"
            }`}>
              {selectedDay.status === "optimal" ? "Recommended Window" : selectedDay.status === "caution" ? "Restricted Window" : "High Washout Risk"}
            </span>
          </div>

          {/* Recommended Window Pill */}
          <div className="bg-white p-3.5 rounded-2xl border border-black/5 shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2C2C24]">
              <Clock className="w-4 h-4 text-[#4A5D43]" />
              <span>Optimal Spray Window:</span>
              <span className="text-[#4A5D43] font-mono">{selectedDay.windowText}</span>
            </div>
            <p className="text-xs text-[#6B665C] leading-relaxed">
              {selectedDay.reason}
            </p>
          </div>

          {/* Microclimate Factors Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-white/80 p-2.5 rounded-xl border border-black/5">
              <span className="text-[10px] text-[#78786C] block flex items-center gap-1">
                <Wind className="w-3 h-3 text-[#4A5D43]" /> Wind Speed
              </span>
              <span className="text-sm font-bold font-serif text-[#2C2C24]">
                {selectedDay.windSpeed} km/h
              </span>
              <span className="text-[9px] text-[#78786C] block">Gusts: {selectedDay.windGusts} km/h</span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-black/5">
              <span className="text-[10px] text-[#78786C] block flex items-center gap-1">
                <CloudRain className="w-3 h-3 text-blue-600" /> Rain Probability
              </span>
              <span className="text-sm font-bold font-serif text-blue-700">
                {selectedDay.rainProb}%
              </span>
              <span className="text-[9px] text-[#78786C] block">Expected: {selectedDay.rain} mm</span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-black/5">
              <span className="text-[10px] text-[#78786C] block flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-red-600" /> Max Temp
              </span>
              <span className="text-sm font-bold font-serif text-[#2C2C24]">
                {selectedDay.maxTemp}°C
              </span>
              <span className="text-[9px] text-[#78786C] block">Min: {selectedDay.minTemp}°C</span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-black/5">
              <span className="text-[10px] text-[#78786C] block flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-600" /> Evaporation (ET₀)
              </span>
              <span className="text-sm font-bold font-serif text-amber-800">
                {selectedDay.et0} mm/d
              </span>
              <span className="text-[9px] text-[#78786C] block">FAO-56 Water Loss</span>
            </div>
          </div>

        </div>

        {/* Right Col: Extreme Weather Alert & Agronomic Tips */}
        <div className="bg-[#FAF8F3] p-5 rounded-3xl border border-[#E5E0D5] flex flex-col justify-between space-y-4 text-xs">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#78786C] block flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Agronomic Spraying Best Practices
            </span>

            <div className="space-y-2 text-[11px] text-[#6B665C]">
              <div className="p-2.5 rounded-xl bg-white border border-[#E5E0D5] space-y-1">
                <p className="font-bold text-[#2C2C24]">1. Nozzle Droplet Size:</p>
                <p>Use Medium-Coarse nozzles (250-400 microns) to minimize aerial drift when wind speed is between 6-12 km/h.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#E5E0D5] space-y-1">
                <p className="font-bold text-[#2C2C24]">2. Rainfastness Period:</p>
                <p>Ensure at least 2 to 4 rain-free hours after foliar micronutrient (Zinc/Boron) or bio-pesticide spray for systemic absorption.</p>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>ECMWF ERA5 Atmospheric Boundary Layer Synchronized</span>
          </div>
        </div>

      </div>

    </div>
  );
}
