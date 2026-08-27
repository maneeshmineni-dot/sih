"use client";

import React, { useState, useEffect } from "react";
import { Cookie, Settings, Check, X } from "lucide-react";

export default function KrishiConsentCard() {
  const [isVisible, setIsVisible] = useState(true);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("agrisphere_cookie_consent");
    if (consent) {
      setIsVisible(false);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("agrisphere_cookie_consent", "all");
    setAccepted(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem("agrisphere_cookie_consent", "essential");
    setAccepted(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#FEFEFA] border border-[#E5E0D5] rounded-3xl p-5 shadow-2xl shadow-black/10 space-y-3.5 animate-in fade-in slide-in-from-bottom-5 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#4A5D43]/10 text-[#4A5D43] flex items-center justify-center">
            <Cookie className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-xs text-[#2C2C24] font-serif">
              Krishi Cookie & Storage Consent
            </h4>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A5D43] animate-pulse"></span>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-[#8A857A] hover:text-[#2C2C24] p-1 rounded-full hover:bg-[#F0EBE5] transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-[11px] text-[#6B665C] leading-relaxed">
        AgriSphere AI uses local storage & cookies for live field GPS caching, neural satellite rendering, and ICAR advisory personalization.
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold">
        <span className="px-2.5 py-1 rounded-full bg-[#FAF8F3] border border-[#E5E0D5] text-[#4A5D43] flex items-center gap-1">
          🌾 Live GPS Coordinates
        </span>
        <span className="px-2.5 py-1 rounded-full bg-[#FAF8F3] border border-[#E5E0D5] text-[#C18C5D] flex items-center gap-1">
          🛰️ Satellite Tile Cache
        </span>
        <span className="px-2.5 py-1 rounded-full bg-[#FAF8F3] border border-[#E5E0D5] text-[#2C2C24] flex items-center gap-1">
          🇮🇳 Krishi Mitra Memory
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleAcceptAll}
          className="flex-1 py-2 rounded-full bg-[#4A5D43] hover:bg-[#3A4B34] text-white font-bold text-xs shadow-soft transition cursor-pointer text-center"
        >
          {accepted ? "Saved!" : "Accept All"}
        </button>

        <button
          onClick={handleEssentialOnly}
          className="py-2 px-3.5 rounded-full bg-[#F0EBE5] hover:bg-[#E5DFD7] text-[#2C2C24] font-bold text-xs border border-[#DED8CF] transition cursor-pointer"
        >
          Essential Only
        </button>

        <button
          onClick={() => setIsVisible(false)}
          className="p-2 rounded-full border border-[#DED8CF] text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] transition cursor-pointer"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
