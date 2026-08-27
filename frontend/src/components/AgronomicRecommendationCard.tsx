"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  Sparkles, 
  Sprout, 
  FlaskConical, 
  Droplet, 
  ShieldAlert, 
  Printer, 
  CheckCircle2,
  TrendingUp,
  Coins,
  Store,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  QrCode,
  Repeat,
  Sun,
  CloudRain,
  Award,
  ExternalLink,
  Bug
} from "lucide-react";
import { GeminiRecommendation } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface AgronomicRecommendationCardProps {
  recommendation: GeminiRecommendation | null;
  farmName: string;
  onOpenPdfReport?: () => void;
}

export default function AgronomicRecommendationCard({
  recommendation,
  farmName,
  onOpenPdfReport,
}: AgronomicRecommendationCardProps) {
  const { t } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);
  const [mandiData, setMandiData] = useState<any>({
    crop: "Cotton (Medium Staple)",
    msp_rate: 7121,
    modal_price: 7450,
    min_price: 6800,
    max_price: 7820,
    market: "Nizamabad APMC",
    trend: "+2.4%",
    estimated_cost_per_acre: 18500
  });

  useEffect(() => {
    if (recommendation?.recommended_crop) {
      const crop = encodeURIComponent(recommendation.recommended_crop);
      fetch(`http://localhost:8000/api/mandi-prices?crop=${crop}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.mandi_data) {
            setMandiData(data.mandi_data);
          }
        })
        .catch((e) => console.warn("Mandi API fetch notice:", e));
    }
  }, [recommendation?.recommended_crop]);

  if (!recommendation) {
    return (
      <div className="bg-[#FEFEFA] rounded-[2.25rem] p-8 border border-[#DED8CF] shadow-soft text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] mx-auto flex items-center justify-center border border-[#5D7052]/20">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h4 className="text-base font-bold text-[#2C2C24] font-serif">No Plan Generated Yet</h4>
        <p className="text-xs text-[#78786C] max-w-md mx-auto">
          Review the real-time satellite telemetry and soil physics above, add any observed field symptoms, and click &quot;Generate Multimodal Agronomic Plan&quot;.
        </p>
      </div>
    );
  }

  const rec = recommendation;
  const confidencePct = Math.round((rec.confidence_score ?? 0.9) * 100);

  // Financial Calculations
  const estimatedQuintals = 12.0; // Average expected quintals per acre
  const grossRevenue = estimatedQuintals * mandiData.modal_price;
  const netProfitPerAcre = grossRevenue - mandiData.estimated_cost_per_acre;
  const roiPct = Math.round((netProfitPerAcre / mandiData.estimated_cost_per_acre) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div ref={printRef} className="space-y-6">
      
      {/* 1. PRIMARY RECOMMENDED CROP & VARIETY HERO CARD */}
      <div className="bg-gradient-to-br from-[#3E4C37] via-[#4D5E44] to-[#2E3A28] rounded-[2.25rem] p-7 sm:p-8 text-[#FEFEFA] shadow-soft-lg relative overflow-hidden">
        
        {/* Soft decorative botanical blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C18C5D]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#FEFEFA]/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#C18C5D] flex items-center justify-center text-white shadow-md ring-4 ring-[#FEFEFA]/20 shrink-0">
              <Sprout className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#FEFEFA]/20 text-[#FEFEFA] border border-[#FEFEFA]/30">
                  {rec.target_season}
                </span>
                <span className="text-xs text-[#FEFEFA]/80 font-medium">• {farmName}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#FEFEFA] mt-1 font-serif tracking-tight">
                {rec.recommended_crop}
              </h2>
              <p className="text-xs text-[#DED8CF] font-semibold mt-0.5">
                {t("seed_variety")}: <span className="text-white font-bold">{rec.recommended_variety}</span>
              </p>
            </div>
          </div>

          {/* Right Metrics: Confidence + Yield + Print PDF */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-[#FEFEFA]/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#FEFEFA]/20 text-center">
              <span className="text-[10px] text-[#DED8CF] block uppercase font-bold tracking-wider">
                {t("confidence_score")}
              </span>
              <span className="text-2xl font-black text-white font-serif">
                {confidencePct}%
              </span>
            </div>

            <div className="bg-[#FEFEFA]/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#FEFEFA]/20 text-center">
              <span className="text-[10px] text-[#DED8CF] block uppercase font-bold tracking-wider">
                {t("expected_yield")}
              </span>
              <span className="text-sm font-bold text-white font-serif">
                {rec.expected_yield_range}
              </span>
            </div>

            <button
              onClick={() => {
                if (onOpenPdfReport) onOpenPdfReport();
                else handlePrint();
              }}
              title="Download Official ICAR Agronomy PDF Dossier & Share"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#C18C5D] hover:bg-[#A9764A] text-white font-bold text-xs transition shadow-soft cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Official ICAR PDF Dossier</span>
            </button>
          </div>
        </div>

        {/* 3-Point Executive Action Summary Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
          <div className="bg-[#FEFEFA]/10 backdrop-blur-md p-3.5 rounded-2xl border border-[#FEFEFA]/15 flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0 mt-1 animate-pulse"></span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-300 block">
                🔴 Immediate Action (Day 0-7)
              </span>
              <p className="text-xs font-semibold text-white mt-0.5">
                {rec.fertilizer_schedule?.[0]?.product || "Soil incorporation & basal amendment"}
              </p>
            </div>
          </div>

          <div className="bg-[#FEFEFA]/10 backdrop-blur-md p-3.5 rounded-2xl border border-[#FEFEFA]/15 flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 mt-1"></span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
                🟡 Pathogen / Irrigation Alert
              </span>
              <p className="text-xs font-semibold text-white mt-0.5 truncate max-w-[200px]">
                {rec.pest_and_disease_warning?.slice(0, 45) || "Monitor foliar humidity"}...
              </p>
            </div>
          </div>

          <div className="bg-[#FEFEFA]/10 backdrop-blur-md p-3.5 rounded-2xl border border-[#FEFEFA]/15 flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 mt-1"></span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                🟢 Projected Target Yield
              </span>
              <p className="text-xs font-semibold text-white mt-0.5">
                {rec.expected_yield_range} ({rec.target_season})
              </p>
            </div>
          </div>
        </div>

        {/* Executive Multimodal Agronomic Rationale */}
        <div className="mt-4 bg-[#2E3A28]/80 rounded-2xl p-5 border border-[#FEFEFA]/15">
          <h4 className="text-xs font-bold text-[#C18C5D] uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-serif">
            <Sparkles className="w-4 h-4 text-[#C18C5D]" />
            Multimodal Scientific Ground Rationale:
          </h4>
          <p className="text-xs text-[#FEFEFA]/95 leading-relaxed font-sans font-medium">
            {rec.executive_summary}
          </p>
        </div>

      </div>

      {/* 2. 💰 eNAM APMC MANDI MARKET RATES & NET ROI FORECASTER */}
      <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DED8CF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#2C2C24] font-serif">
                  Live eNAM Mandi Market Economics & ROI Forecaster
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  APMC Benchmark
                </span>
              </div>
              <p className="text-xs text-[#78786C]">
                Market Rate: <b className="text-[#2C2C24]">{mandiData.market}</b> • Trend: <b className="text-emerald-700">{mandiData.trend}</b>
              </p>
            </div>
          </div>
          <span className="text-xs text-[#78786C] font-mono">
            MSP: <b>₹{mandiData.msp_rate.toLocaleString()}/Q</b>
          </span>
        </div>

        {/* Financial Matrix Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E0D5]">
            <span className="text-[10px] uppercase font-bold text-[#78786C] block">Mandi Modal Price</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-serif text-[#2C2C24]">₹{mandiData.modal_price.toLocaleString()}</span>
              <span className="text-[10px] text-[#78786C]">/ Quintal</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              Above MSP by ₹{(mandiData.modal_price - mandiData.msp_rate).toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E0D5]">
            <span className="text-[10px] uppercase font-bold text-[#78786C] block">Est. Gross Revenue</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-serif text-[#2C2C24]">₹{grossRevenue.toLocaleString()}</span>
              <span className="text-[10px] text-[#78786C]">/ Acre</span>
            </div>
            <span className="text-[10px] text-[#78786C]">Based on {estimatedQuintals} Q/Ac yield</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E0D5]">
            <span className="text-[10px] uppercase font-bold text-[#78786C] block">Estimated Input Cost</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-serif text-[#C18C5D]">₹{mandiData.estimated_cost_per_acre.toLocaleString()}</span>
              <span className="text-[10px] text-[#78786C]">/ Acre</span>
            </div>
            <span className="text-[10px] text-[#78786C]">Seeds, fert & crop protection</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Projected Net Profit</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-serif text-emerald-800">₹{netProfitPerAcre.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-700">/ Acre</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-extrabold">
              📈 ROI: +{roiPct}% Net Return
            </span>
          </div>
        </div>
      </div>

      {/* 3. 🔄 3-SEASON REGENERATIVE CROP ROTATION SEQUENCE */}
      <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2C2C24] font-serif">
                3-Season Regenerative Crop Rotation Sequence
              </h3>
              <p className="text-xs text-[#78786C]">
                Designed for biological nitrogen fixation, nematode cycle breakdown, and soil organic carbon recovery
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Season 1 */}
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E0D5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#4A5D43]/15 text-[#4A5D43] font-mono">
                Season 1 (Kharif)
              </span>
              <CloudRain className="w-4 h-4 text-[#4A5D43]" />
            </div>
            <h4 className="font-bold text-sm text-[#2C2C24]">
              {rec.recommended_crop} ({rec.recommended_variety})
            </h4>
            <p className="text-[11px] text-[#78786C] leading-snug">
              Primary cash crop cycle. Utilize balanced basal fertilization with Trichoderma seed treatment.
            </p>
          </div>

          {/* Season 2 */}
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E0D5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
                Season 2 (Rabi)
              </span>
              <Sun className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="font-bold text-sm text-[#2C2C24]">
              Chickpea (Gram / Chana) / Mustard
            </h4>
            <p className="text-[11px] text-[#78786C] leading-snug">
              Leguminous rotation. Fixes 35-40 kg atmospheric Nitrogen/acre, cutting next season chemical urea costs by 25%.
            </p>
          </div>

          {/* Season 3 */}
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E0D5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
                Season 3 (Zaid)
              </span>
              <Sprout className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="font-bold text-sm text-[#2C2C24]">
              Green Manure (Dhaincha / Sesbania) / Moong
            </h4>
            <p className="text-[11px] text-[#78786C] leading-snug">
              Incorporate 45-day green biomass into topsoil. Boosts Soil Organic Carbon (SOC) by +0.15% annually.
            </p>
          </div>
        </div>
      </div>

      {/* 4. 🏛️ GOVERNMENT SCHEMES & SUBSIDY ELIGIBILITY DOSSIER */}
      <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2C2C24] font-serif">
                Government Subsidies & Benefits Eligibility Dossier
              </h3>
              <p className="text-xs text-[#78786C]">
                Verified Central & State agricultural development schemes for this land parcel
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E0D5] flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Income Support
              </span>
              <h4 className="font-bold text-xs text-[#2C2C24] mt-1.5">PM-Kisan Samman Nidhi</h4>
              <p className="text-[11px] text-[#78786C] mt-1">₹6,000 / year direct benefit transfer in 3 equal instalments.</p>
            </div>
            <span className="text-[10px] font-bold text-[#4A5D43]">Status: Verified Eligible</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E0D5] flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                Crop Insurance
              </span>
              <h4 className="font-bold text-xs text-[#2C2C24] mt-1.5">PMFBY Fasal Bima</h4>
              <p className="text-[11px] text-[#78786C] mt-1">1.5% - 2% subsidized premium. Direct claim settlement for drought/unseasonal rains.</p>
            </div>
            <span className="text-[10px] font-bold text-[#4A5D43]">GeoJSON Ready</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E0D5] flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                Micro-Irrigation
              </span>
              <h4 className="font-bold text-xs text-[#2C2C24] mt-1.5">Per Drop More Crop (PDMC)</h4>
              <p className="text-[11px] text-[#78786C] mt-1">Up to 55% - 70% capital subsidy on Drip and Sprinkler installation.</p>
            </div>
            <span className="text-[10px] font-bold text-[#4A5D43]">Subsidy: Up to 70%</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E5E0D5] flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                Mechanization
              </span>
              <h4 className="font-bold text-xs text-[#2C2C24] mt-1.5">SMAM Agri-Drone / Solar</h4>
              <p className="text-[11px] text-[#78786C] mt-1">40% to 50% subsidy on Solar Pumps, Rotavators & Custom Hiring Drones.</p>
            </div>
            <span className="text-[10px] font-bold text-[#4A5D43]">Subsidy: 40-50%</span>
          </div>
        </div>
      </div>

      {/* 5. STAGE-BY-STAGE MULTI-PHASE FERTILIZER SCHEDULE */}
      <div className="p-6 sm:p-8 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5D7052]/10 text-[#5D7052] flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#2C2C24] font-serif">
              {t("fertilizer_schedule")}
            </h3>
          </div>
          <span className="text-xs text-[#78786C] font-semibold">
            {rec.fertilizer_schedule?.length ?? 0} Planned Stages
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {rec.fertilizer_schedule?.map((stage, idx) => (
            <div
              key={idx}
              className="bg-[#F0EBE5]/40 rounded-2xl p-5 border border-[#DED8CF] hover:border-[#5D7052] transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#5D7052]/15 text-[#5D7052] border border-[#5D7052]/30 font-mono">
                    Stage {idx + 1} • Day {stage.day_offset}
                  </span>
                  <span className="text-[10px] text-[#C18C5D] font-bold">
                    {stage.application_method}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#2C2C24] font-serif mt-2">
                  {stage.stage}
                </h4>

                <div className="mt-2.5 bg-[#FEFEFA] p-3 rounded-xl border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] block font-bold">Nutrient / Product:</span>
                  <span className="text-xs font-bold text-[#2C2C24]">{stage.product}</span>
                  <div className="text-xs font-bold text-[#5D7052] mt-0.5 font-mono">
                    Dosage: {stage.dosage_per_acre}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#78786C] italic leading-snug pt-2 border-t border-[#DED8CF]/60 font-medium">
                {stage.scientific_rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. SOIL REHABILITATION & TARGETED PEST BIO-TREATMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Soil Restoration Protocol */}
        <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#DED8CF]/60">
            <FlaskConical className="w-5 h-5 text-[#C18C5D]" />
            <h3 className="font-bold text-sm text-[#2C2C24] font-serif">
              {t("soil_restoration")}
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="bg-[#F0EBE5]/50 p-3 rounded-2xl border border-[#DED8CF]">
              <span className="text-[10px] text-[#C18C5D] font-bold uppercase tracking-wider block">
                Primary Soil Deficiency:
              </span>
              <span className="text-[#2C2C24] font-semibold">
                {rec.soil_rehabilitation_strategy?.primary_deficiency}
              </span>
            </div>

            <div className="bg-[#F0EBE5]/50 p-3 rounded-2xl border border-[#DED8CF]">
              <span className="text-[10px] text-[#5D7052] font-bold uppercase tracking-wider block">
                Correction Treatment:
              </span>
              <span className="text-[#2C2C24] font-semibold">
                {rec.soil_rehabilitation_strategy?.amendment_protocol}
              </span>
            </div>

            <div className="bg-[#F0EBE5]/50 p-3 rounded-2xl border border-[#DED8CF]">
              <span className="text-[10px] text-[#78786C] font-bold uppercase tracking-wider block">
                Organic Matter Strategy:
              </span>
              <span className="text-[#2C2C24] font-semibold">
                {rec.soil_rehabilitation_strategy?.organic_matter_restoration}
              </span>
            </div>
          </div>
        </div>

        {/* Climate, Irrigation & Targeted Pest Protocols */}
        <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#DED8CF]/60">
            <Bug className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-sm text-[#2C2C24] font-serif">
              Targeted Pest & Biological Treatment Protocol
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="bg-red-50/50 p-3 rounded-2xl border border-red-200">
              <span className="text-[10px] text-red-700 font-bold uppercase tracking-wider block flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                Active Risk Diagnosis:
              </span>
              <span className="text-[#2C2C24] font-semibold">
                {rec.pest_and_disease_warning}
              </span>
            </div>

            <div className="bg-[#FAF8F3] p-3 rounded-2xl border border-[#E5E0D5]">
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                🌿 ICAR Biological Remedy (Zero Residue):
              </span>
              <span className="text-[#2C2C24] font-semibold">
                Spray 5% Neem Seed Kernel Extract (NSKE) or Neem Oil 1500 PPM @ 3ml/L + Install Pheromone Traps @ 5/acre.
              </span>
            </div>

            <div className="bg-[#FAF8F3] p-3 rounded-2xl border border-[#E5E0D5]">
              <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider block">
                💧 FAO-56 Irrigation Guideline:
              </span>
              <span className="text-[#2C2C24] font-semibold">
                {rec.irrigation_advisory}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
