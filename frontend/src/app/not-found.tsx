"use client";

import React from "react";
import Link from "next/link";
import { 
  MapPinOff, 
  Satellite, 
  Home, 
  Activity, 
  Compass, 
  ArrowLeft, 
  Sparkles,
  Bot
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/40 to-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Orbit Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-8">
        {/* Animated Satellite / Radar Icon Badge */}
        <div className="inline-flex items-center justify-center relative">
          <div className="w-24 h-24 rounded-3xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shadow-2xl shadow-emerald-500/20 backdrop-blur-md relative">
            <MapPinOff className="w-12 h-12 text-emerald-400 animate-pulse" />
            <div className="absolute -top-2 -right-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
              <Satellite className="w-3 h-3 animate-spin" style={{ animationDuration: "8s" }} /> 404
            </div>
          </div>
          {/* Orbital Radar Ping Ring */}
          <div className="absolute inset-0 rounded-3xl border border-emerald-400/40 animate-ping pointer-events-none" style={{ animationDuration: "3s" }} />
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 text-xs font-semibold tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5" /> Coordinates Out of Range
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Field Plot <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">Not Found</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The farm boundary or page you are looking for does not exist in our Sentinel-2 satellite index or may have been moved.
          </p>
        </div>

        {/* Quick Diagnostic Card */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 text-left backdrop-blur-md shadow-xl text-xs space-y-2 text-slate-400">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-400" /> Agronomic Telemetry Status</span>
            <span className="text-emerald-400 flex items-center gap-1">● Satellite Grid Active</span>
          </div>
          <p className="text-slate-500 font-mono text-[11px]">
            Error Ref: GPS_PARCEL_NOT_RESOLVED • Route: Unmatched
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-sm shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-4 h-4" /> Return to Farm Dashboard
          </Link>
          <Link
            href="/#chat"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-medium text-sm transition-all hover:border-slate-600"
          >
            <Bot className="w-4 h-4 text-emerald-400" /> Ask Krishi Mitra
          </Link>
        </div>
      </div>
    </div>
  );
}
