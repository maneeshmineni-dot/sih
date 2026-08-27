"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCw, Home, Bot } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Agronomic App Boundary Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full space-y-6 bg-slate-900/80 border border-red-500/20 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-950/50">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Telemetry Processing Error
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            An unexpected error interrupted live telemetry synthesis. You can retry processing or return to the farm dashboard.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-slate-500 bg-slate-950/60 py-1 px-2 rounded-md border border-slate-800">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Action
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
          >
            <Home className="w-3.5 h-3.5" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
