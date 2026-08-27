"use client";

import React, { useState } from "react";
import { useLanguage, Language } from "@/context/LanguageContext";
import { Globe, Volume2, VolumeX, Check } from "lucide-react";

const LANGUAGES: { code: Language; name: string; native: string }[] = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

export default function LiveTranslationHUD() {
  const { language, setLanguage, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleReadAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${t("app_name")}. ${t("tagline")}. ${t("mean_ndvi")}, ${t("soil_moisture_root")}.`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    const langMap: Record<Language, string> = {
      en: "en-IN",
      hi: "hi-IN",
      mr: "mr-IN",
      te: "te-IN",
      ta: "ta-IN",
      pa: "pa-IN",
    };
    utterance.lang = langMap[language] || "en-IN";
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-[#FEFEFA] p-3 rounded-full border border-[#DED8CF] shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
      
      {/* Left indicator */}
      <div className="flex items-center gap-2 px-3 text-[#2C2C24]">
        <Globe className="w-4 h-4 text-[#5D7052]" />
        <span className="font-bold hidden sm:inline font-serif">Live Vernacular HUD:</span>
      </div>

      {/* Language Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                isActive
                  ? "bg-[#5D7052] text-[#FEFEFA] shadow-soft"
                  : "bg-[#F0EBE5]/60 text-[#78786C] hover:bg-[#F0EBE5] hover:text-[#2C2C24]"
              }`}
            >
              <span>{lang.native}</span>
              {isActive && <Check className="w-3 h-3 text-[#FEFEFA]" />}
            </button>
          );
        })}
      </div>

      {/* Text-To-Speech Vernacular Audio Assist */}
      <div className="flex items-center gap-2 pr-2">
        <button
          onClick={handleReadAloud}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer border ${
            isSpeaking
              ? "bg-[#C18C5D]/20 text-[#C18C5D] border-[#C18C5D] animate-pulse"
              : "bg-[#F0EBE5] hover:bg-[#E5DFD7] text-[#2C2C24] border-[#DED8CF]"
          }`}
          title="Listen in Selected Indian Language"
        >
          {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-[#C18C5D]" /> : <Volume2 className="w-3.5 h-3.5 text-[#5D7052]" />}
          <span>{isSpeaking ? "Speaking..." : "Voice Readout"}</span>
        </button>
      </div>

    </div>
  );
}
