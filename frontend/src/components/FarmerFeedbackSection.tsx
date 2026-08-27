"use client";

import React, { useState } from "react";
import { 
  MessageSquareText, 
  Mic, 
  MicOff, 
  Sparkles, 
  History, 
  Tag, 
  Check, 
  Loader2,
  Camera,
  Upload,
  Trash2
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FarmerFeedbackSectionProps {
  onAnalyze: (feedback: string, cropHistory: string[], fertilizerHistory: string[], leafImageBase64?: string | null) => void;
  isAnalyzing: boolean;
}

const COMMON_SYMPTOMS = [
  "Leaf Chlorosis (Yellowing of Lower Leaves)",
  "Slow Infiltration / Drainage Post-Rain",
  "Subsoil Hardpan / Compaction",
  "Stunted Early Emergence",
  "White Grub / Root Borer",
  "Soil Crust Formation",
];

export default function FarmerFeedbackSection({
  onAnalyze,
  isAnalyzing,
}: FarmerFeedbackSectionProps) {
  const { t } = useLanguage();
  const [feedbackText, setFeedbackText] = useState(
    "Observed slow water infiltration after monsoon showers and slight chlorosis on lower leaves during the last maize cycle."
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Leaf Chlorosis (Yellowing of Lower Leaves)",
    "Slow Infiltration / Drainage Post-Rain"
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [leafImage, setLeafImage] = useState<string | null>(null);
  const [cropHistory, setCropHistory] = useState<string[]>([
    "2024 Kharif: Soybean",
    "2024-25 Rabi: Wheat",
    "2025 Kharif: Maize"
  ]);
  const [newCropInput, setNewCropInput] = useState("");
  const [fertilizerHistory, setFertilizerHistory] = useState<string[]>([
    "Urea (50 kg/acre)",
    "DAP (35 kg/acre)"
  ]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLeafImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateVoiceNote = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setFeedbackText(
          (prev) =>
            prev +
            " [Transcribed Voice Note]: Farmer noticed soil drying too quickly on ridge edges, leaf tips curling slightly in afternoon sun."
        );
      }, 2500);
    }
  };

  const handleAddCrop = () => {
    if (newCropInput.trim()) {
      setCropHistory([...cropHistory, newCropInput.trim()]);
      setNewCropInput("");
    }
  };

  const handleRunAnalysis = () => {
    const fullFeedback = `${feedbackText} Selected Symptoms: ${selectedTags.join(", ")}`;
    onAnalyze(fullFeedback, cropHistory, fertilizerHistory, leafImage);
  };

  return (
    <div className="p-6 sm:p-8 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DED8CF]/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5D7052]/10 text-[#5D7052] flex items-center justify-center">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#2C2C24] font-serif">
              Farmer Observations & Crop Rotation History
            </h3>
          </div>
          <p className="text-xs text-[#78786C] mt-0.5 font-medium">
            Qualitative human field observations enhance Gemini&apos;s multimodal decision accuracy.
          </p>
        </div>

        {/* Voice Note Button */}
        <button
          onClick={handleSimulateVoiceNote}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
            isRecording
              ? "bg-red-500/15 text-red-600 border-red-400 animate-pulse"
              : "bg-[#F0EBE5] hover:bg-[#E5DFD7] text-[#2C2C24] border-[#DED8CF]"
          }`}
        >
          {isRecording ? <MicOff className="w-4 h-4 text-red-500" /> : <Mic className="w-4 h-4 text-[#5D7052]" />}
          <span>{isRecording ? "Listening (Vernacular Voice)..." : t("voice_note")}</span>
        </button>
      </div>

      {/* Symptoms Tag Selector */}
      <div>
        <label className="text-xs font-bold text-[#2C2C24] mb-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-[#5D7052]" />
          Field Anomaly & Symptom Tags:
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SYMPTOMS.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3.5 py-1.5 rounded-full border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? "bg-[#5D7052] text-[#FEFEFA] border-[#5D7052] shadow-sm"
                    : "bg-[#F0EBE5]/60 text-[#78786C] border-[#DED8CF] hover:border-[#5D7052] hover:text-[#2C2C24]"
                }`}
              >
                {active && <Check className="w-3 h-3 text-[#FEFEFA]" />}
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Observation Text Area */}
      <div>
        <label className="text-xs font-bold text-[#2C2C24] mb-1.5 block">
          Farmer Qualitative Notes / Field Diary:
        </label>
        <textarea
          rows={3}
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          className="w-full bg-[#FEFEFA] border border-[#DED8CF] rounded-2xl p-3.5 text-xs text-[#2C2C24] placeholder-[#78786C] focus:outline-none focus:ring-2 focus:ring-[#5D7052]/30 transition-all font-sans leading-relaxed"
          placeholder="Describe any pest sightings, yellowing, water ponding, or previous yield drop..."
        />
      </div>

      {/* Crop History & Fertilizer Logs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Past Crop Rotations */}
        <div className="bg-[#F0EBE5]/50 p-4 rounded-2xl border border-[#DED8CF]">
          <label className="text-xs font-bold text-[#2C2C24] flex items-center gap-1.5 mb-2 font-serif">
            <History className="w-3.5 h-3.5 text-[#5D7052]" />
            Past 3 Crop Cycles:
          </label>
          <div className="space-y-1.5">
            {cropHistory.map((crop, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-[#FEFEFA] px-3 py-2 rounded-xl text-[#2C2C24] border border-[#DED8CF] font-medium">
                <span>{crop}</span>
                <span className="text-[10px] text-[#5D7052] font-bold">Harvested</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2.5">
            <input
              type="text"
              placeholder="e.g. 2025 Rabi: Mustard"
              value={newCropInput}
              onChange={(e) => setNewCropInput(e.target.value)}
              className="bg-[#FEFEFA] border border-[#DED8CF] rounded-xl px-3 py-1.5 text-xs text-[#2C2C24] flex-1 focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
            />
            <button
              onClick={handleAddCrop}
              className="px-3.5 py-1.5 rounded-xl bg-[#5D7052] hover:bg-[#4D5E44] text-[#FEFEFA] text-xs font-bold shadow-sm"
            >
              Add
            </button>
          </div>
        </div>

        {/* Past Fertilizer Logs */}
        <div className="bg-[#F0EBE5]/50 p-4 rounded-2xl border border-[#DED8CF]">
          <label className="text-xs font-bold text-[#2C2C24] flex items-center gap-1.5 mb-2 font-serif">
            <Tag className="w-3.5 h-3.5 text-[#C18C5D]" />
            Previous Fertilizer Application:
          </label>
          <div className="space-y-1.5">
            {fertilizerHistory.map((fert, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-[#FEFEFA] px-3 py-2 rounded-xl text-[#2C2C24] border border-[#DED8CF] font-medium">
                <span>{fert}</span>
                <span className="text-[10px] text-[#C18C5D] font-bold">Applied</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#78786C] mt-2.5 italic">
            Gemini analyzes N-P-K depletion from consecutive exhaustive cycles to design balanced soil remediation.
          </p>
        </div>
      </div>

      {/* Multimodal Crop / Leaf Photo Upload Dropzone */}
      <div className="bg-[#FAF8F3] p-4 sm:p-5 rounded-2xl border border-[#E5E0D5] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#2C2C24] flex items-center gap-2 font-serif">
            <Camera className="w-4 h-4 text-[#4A5D43]" />
            <span>Multimodal Vision: Crop / Leaf Pathogen Photo (Optional)</span>
          </label>
          {leafImage && (
            <span className="text-[10px] font-bold bg-[#4A5D43]/10 text-[#4A5D43] px-2.5 py-0.5 rounded-full border border-[#4A5D43]/20 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Vision Part Attached
            </span>
          )}
        </div>

        {leafImage ? (
          <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-[#E5E0D5]">
            <img
              src={leafImage}
              alt="Crop Leaf"
              className="w-16 h-16 object-cover rounded-lg border border-[#DED8CF]"
            />
            <div className="flex-1">
              <p className="text-xs font-bold text-[#2C2C24]">Crop / Foliar Photo Ready</p>
              <p className="text-[11px] text-[#78786C]">Gemini will visually analyze necrotic lesions, chlorosis & pests.</p>
            </div>
            <button
              type="button"
              onClick={() => setLeafImage(null)}
              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#DAD5C9] hover:border-[#4A5D43] rounded-xl bg-white cursor-pointer transition group">
            <div className="flex items-center gap-2 text-[#6B665C] group-hover:text-[#4A5D43] transition">
              <Upload className="w-4 h-4" />
              <span className="text-xs font-bold">Snap or Upload Crop Leaf Photo</span>
            </div>
            <p className="text-[10px] text-[#8A857A] mt-1">
              PNG, JPG, or WEBP up to 10MB • AI visual inspection of foliar disease & blight
            </p>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Main Big CTA Button: GENERATE NEXT CYCLE PLAN */}
      <div className="pt-2">
        <button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className={`w-full py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-soft flex items-center justify-center gap-2.5 cursor-pointer ${
            isAnalyzing
              ? "bg-[#DED8CF] text-[#78786C] cursor-wait"
              : "bg-[#5D7052] hover:bg-[#4D5E44] text-[#FEFEFA] hover:scale-[1.01] hover:shadow-soft-lg"
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#FEFEFA]" />
              <span>{t("generating_plan")}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-[#FEFEFA]" />
              <span>{t("generate_plan")}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
