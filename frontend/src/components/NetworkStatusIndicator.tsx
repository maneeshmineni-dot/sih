"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showReconnectedBanner, setShowReconnectedBanner] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    // Initial check
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnectedBanner(true);
      const timer = setTimeout(() => {
        setShowReconnectedBanner(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnectedBanner(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      // Try to ping a tiny endpoint or check navigator
      const res = await fetch("/favicon.ico", { method: "HEAD", cache: "no-store" }).catch(() => null);
      if (res && (res.ok || res.type === "opaque")) {
        setIsOnline(true);
        setShowReconnectedBanner(true);
        setTimeout(() => setShowReconnectedBanner(false), 4000);
      } else if (navigator.onLine) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch {
      setIsOnline(navigator.onLine);
    } finally {
      setIsChecking(false);
    }
  };

  // Reconnected Toast
  if (showReconnectedBanner && isOnline) {
    return (
      <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Connection Restored • Live Telemetry Active</span>
        </div>
      </div>
    );
  }

  // Offline Sticky Bar
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-950/95 border-b border-amber-500/30 text-amber-200 px-4 py-2 text-xs backdrop-blur-md shadow-2xl animate-in slide-in-from-top duration-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/20 text-amber-300">
              <WifiOff className="w-3.5 h-3.5 animate-pulse" />
            </span>
            <span className="font-semibold text-amber-100">No Internet Connection:</span>
            <span className="text-amber-300/90 hidden sm:inline">
              Working in offline mode. Cached farm telemetry and past recommendations remain available.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualCheck}
              disabled={isChecking}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-900/60 hover:bg-amber-800/80 border border-amber-700/60 text-amber-200 font-medium text-[11px] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isChecking ? "animate-spin" : ""}`} />
              {isChecking ? "Checking..." : "Retry Connection"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
