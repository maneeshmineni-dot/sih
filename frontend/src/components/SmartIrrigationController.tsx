"use client";

import React, { useState, useEffect } from "react";
import { 
  Droplets, 
  Zap, 
  Power, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingDown, 
  Activity,
  Sliders,
  Sun,
  Timer
} from "lucide-react";

interface SmartIrrigationControllerProps {
  farmName: string;
  areaAcres: number;
  rootMoisture: number; // e.g. 0.24 m3/m3
  et0DailyMm: number; // e.g. 3.8 mm/day
}

export default function SmartIrrigationController({
  farmName,
  areaAcres = 5.0,
  rootMoisture = 0.24,
  et0DailyMm = 3.8
}: SmartIrrigationControllerProps) {
  const [autoPilotMode, setAutoPilotMode] = useState<boolean>(true);
  const [valve1Active, setValve1Active] = useState<boolean>(rootMoisture < 0.26);
  const [valve2Active, setValve2Active] = useState<boolean>(false);
  const [selectedDurationMins, setSelectedDurationMins] = useState<number>(35);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [totalWaterDeliveredLiters, setTotalWaterDeliveredLiters] = useState<number>(1450);

  // Irrigation Math calculations
  const pumpFlowRateLpm = 95; // 95 Liters per minute per valve
  const dailyCropWaterDemandLiters = Math.round(areaAcres * et0DailyMm * 4046.86 * 0.1); // Liters/day
  const optimalRunTimeMinutes = Math.round((dailyCropWaterDemandLiters * 0.45) / (pumpFlowRateLpm * 2));
  
  // Water & Electricity Conservation metrics vs flood irrigation
  const floodIrrigationRequirementLiters = Math.round(dailyCropWaterDemandLiters * 2.6);
  const waterSavedLiters = Math.max(0, floodIrrigationRequirementLiters - dailyCropWaterDemandLiters);
  const electricitySavedKwh = Math.round((waterSavedLiters / 1000) * 0.32 * 10) / 10;

  // Timer loop when either valve is active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (valve1Active || valve2Active) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        const activeCount = (valve1Active ? 1 : 0) + (valve2Active ? 1 : 0);
        setTotalWaterDeliveredLiters((prev) => prev + Math.round((pumpFlowRateLpm * activeCount) / 60));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [valve1Active, valve2Active]);

  const handleToggleValve1 = () => {
    if (autoPilotMode) setAutoPilotMode(false);
    setValve1Active(!valve1Active);
  };

  const handleToggleValve2 = () => {
    if (autoPilotMode) setAutoPilotMode(false);
    setValve2Active(!valve2Active);
  };

  const handleEnableAutoPilot = () => {
    setAutoPilotMode(true);
    // AI decision: if root moisture is below 0.26, turn on Valve 1, otherwise turn off
    if (rootMoisture < 0.26) {
      setValve1Active(true);
      setValve2Active(false);
    } else {
      setValve1Active(false);
      setValve2Active(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DED8CF]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#C18C5D]/10 text-[#C18C5D] border border-[#C18C5D]/20 flex items-center justify-center font-bold">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#2C2C24] font-serif">
                Smart IoT Drip Irrigation & Solenoid Valve Controller
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                FAO-56 Water Budget
              </span>
            </div>
            <p className="text-xs text-[#78786C]">
              ECMWF Root-Zone Physics ({rootMoisture.toFixed(2)} m³/m³) • Daily ET₀ ({et0DailyMm} mm/d)
            </p>
          </div>
        </div>

        {/* AI Auto-Pilot Switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleEnableAutoPilot}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              autoPilotMode
                ? "bg-[#4A5D43] text-white border-[#4A5D43] shadow-xs"
                : "bg-white text-[#78786C] border-[#DED8CF] hover:bg-[#F0EBE5]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{autoPilotMode ? "🤖 AI Auto-Pilot: ON" : "Enable AI Auto-Pilot"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Solenoid Valves & Water Conservation Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: Interactive Solenoid Valves Control Board */}
        <div className="lg:col-span-2 space-y-4 bg-[#FAF8F3] p-5 rounded-3xl border border-[#E5E0D5]">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#78786C] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#4A5D43]" />
              IoT Solenoid Drip Zones (2-Channel Controller)
            </span>
            <span className="text-xs font-mono text-[#4A5D43] font-bold">
              Pressure: 1.8 Bar (Nominal)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Valve 1: North Parcel (Root Zone Drip) */}
            <div className={`p-4 rounded-2xl border transition-all ${
              valve1Active 
                ? "bg-white border-blue-400 shadow-md ring-2 ring-blue-400/20" 
                : "bg-white/60 border-[#E5E0D5]"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${valve1Active ? "bg-blue-500 animate-ping" : "bg-stone-300"}`}></span>
                  <span className="text-xs font-bold text-[#2C2C24]">Zone 1: North Plot</span>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                  valve1Active ? "bg-blue-100 text-blue-800" : "bg-stone-100 text-stone-600"
                }`}>
                  {valve1Active ? "Open (Dripping)" : "Closed (Idle)"}
                </span>
              </div>

              <p className="text-[11px] text-[#78786C] mb-3">
                Root Zone Emitter • 2.4 L/hr Micro-Drippers
              </p>

              <button
                onClick={handleToggleValve1}
                className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  valve1Active
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-xs"
                    : "bg-[#4A5D43] hover:bg-[#3A4B34] text-white shadow-xs"
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{valve1Active ? "Close Valve 1" : "Open Valve 1"}</span>
              </button>
            </div>

            {/* Valve 2: South Parcel (Sub-Surface Drip) */}
            <div className={`p-4 rounded-2xl border transition-all ${
              valve2Active 
                ? "bg-white border-blue-400 shadow-md ring-2 ring-blue-400/20" 
                : "bg-white/60 border-[#E5E0D5]"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${valve2Active ? "bg-blue-500 animate-ping" : "bg-stone-300"}`}></span>
                  <span className="text-xs font-bold text-[#2C2C24]">Zone 2: South Plot</span>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                  valve2Active ? "bg-blue-100 text-blue-800" : "bg-stone-100 text-stone-600"
                }`}>
                  {valve2Active ? "Open (Dripping)" : "Closed (Idle)"}
                </span>
              </div>

              <p className="text-[11px] text-[#78786C] mb-3">
                Sub-Surface Emitter • 1.6 L/hr Deep-Root Tape
              </p>

              <button
                onClick={handleToggleValve2}
                className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  valve2Active
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-xs"
                    : "bg-[#4A5D43] hover:bg-[#3A4B34] text-white shadow-xs"
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{valve2Active ? "Close Valve 2" : "Open Valve 2"}</span>
              </button>
            </div>

          </div>

          {/* Real-time Session Telemetry Bar */}
          <div className="p-3 bg-white rounded-2xl border border-[#E5E0D5] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-[#4A5D43]" />
              <span className="text-[#78786C]">Active Session Time:</span>
              <span className="font-mono font-bold text-[#2C2C24]">{formatTime(elapsedSeconds)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span className="text-[#78786C]">Volume Dispatched:</span>
              <span className="font-mono font-bold text-blue-700">{totalWaterDeliveredLiters.toLocaleString()} Liters</span>
            </div>

            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-600" />
              <span className="text-[#78786C]">Solar Pump Source:</span>
              <span className="font-bold text-emerald-700">3.5 HP BLDC</span>
            </div>
          </div>

        </div>

        {/* Right Col: Water & Groundwater Conservation Matrix */}
        <div className="bg-[#FAF8F3] p-5 rounded-3xl border border-[#E5E0D5] flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#78786C] block">
              Conservation & Groundwater Ledger
            </span>

            {/* Metric 1: Water Conserved */}
            <div className="bg-white p-3 rounded-2xl border border-[#E5E0D5] space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#78786C]">
                <span>Water Conserved vs Flood</span>
                <span className="text-emerald-700 font-bold">62% Saved</span>
              </div>
              <div className="text-xl font-bold font-serif text-emerald-800">
                +{waterSavedLiters.toLocaleString()} <span className="text-xs text-emerald-700 font-normal">L / cycle</span>
              </div>
              <p className="text-[10px] text-[#78786C]">Prevents aquifer depletion & root rot</p>
            </div>

            {/* Metric 2: Electricity & Carbon Saved */}
            <div className="bg-white p-3 rounded-2xl border border-[#E5E0D5] space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#78786C]">
                <span>Energy Saved (PM-KUSUM)</span>
                <span className="text-amber-700 font-bold">Grid Neutral</span>
              </div>
              <div className="text-xl font-bold font-serif text-amber-800">
                {electricitySavedKwh} <span className="text-xs text-amber-700 font-normal">kWh Saved</span>
              </div>
              <p className="text-[10px] text-[#78786C]">Solar synchronous drip pumping</p>
            </div>

            {/* AI Recommendation Alert */}
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <b>AI Guidance:</b> Next optimal irrigation window is tomorrow morning <b>06:00 AM</b> before peak solar ET₀.
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E5E0D5] text-[11px] text-center font-bold text-[#4A5D43]">
            🛡️ Central Ground Water Board (CGWB) Compliant
          </div>

        </div>

      </div>

    </div>
  );
}
