import React from "react";
import { Satellite, CloudRain, Sprout, Database, Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glowing gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-md w-full text-center relative z-10 space-y-6">
        {/* Radar Scanner Animation */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center relative shadow-xl shadow-emerald-500/10 backdrop-blur-md">
            <Satellite className="w-9 h-9 text-emerald-400 animate-pulse" />
          </div>
          {/* Animated concentric rings */}
          <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping" style={{ animationDuration: "2.5s" }} />
          <div className="absolute -inset-3 rounded-full border border-emerald-500/20 animate-pulse" style={{ animationDuration: "2s" }} />
        </div>

        {/* Heading & Status */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
            <span>Synchronizing Real Telemetry</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Ingesting live Sentinel-2 satellite passes, ECMWF soil moisture, and ISRIC soil profiles...
          </p>
        </div>

        {/* Progress Pipeline Indicators */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl text-left space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-300">
              <Satellite className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: "6s" }} />
              Sentinel-2 High-Res Tile
            </span>
            <span className="text-emerald-400 font-mono text-[11px] font-semibold">Streaming...</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-lime-400 h-full rounded-full animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: "70%" }} />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-center">
              <CloudRain className="w-4 h-4 text-sky-400 mx-auto mb-1 animate-bounce" style={{ animationDuration: "2s" }} />
              <div className="text-[10px] text-slate-400 font-medium">ECMWF Weather</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-center">
              <Sprout className="w-4 h-4 text-emerald-400 mx-auto mb-1 animate-pulse" />
              <div className="text-[10px] text-slate-400 font-medium">ISRIC Soil 250m</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-center">
              <Database className="w-4 h-4 text-amber-400 mx-auto mb-1 animate-pulse" />
              <div className="text-[10px] text-slate-400 font-medium">Gemini 3.6 Flash</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
