"use client";

import React, { useState } from "react";
import { X, FlaskConical, Save, Check } from "lucide-react";
import { SoilProfile } from "@/types";

interface SoilHealthCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSoil: SoilProfile | null;
  onSaveSoilCard: (card: any) => void;
}

export default function SoilHealthCardModal({
  isOpen,
  onClose,
  currentSoil,
  onSaveSoilCard,
}: SoilHealthCardModalProps) {
  const [ph, setPh] = useState(currentSoil?.ph_level?.toString() || "6.8");
  const [oc, setOc] = useState(currentSoil?.organic_carbon_pct?.toString() || "0.65");
  const [nitrogen, setNitrogen] = useState("240");
  const [phosphorus, setPhosphorus] = useState("14.5");
  const [potassium, setPotassium] = useState("280");
  const [ec, setEc] = useState(currentSoil?.electrical_conductivity_ds_m?.toString() || "0.42");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSoilCard({
      ph_level: parseFloat(ph),
      organic_carbon_pct: parseFloat(oc),
      nitrogen_kg_ha: parseFloat(nitrogen),
      phosphorus_kg_ha: parseFloat(phosphorus),
      potassium_kg_ha: parseFloat(potassium),
      electrical_conductivity: parseFloat(ec),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#FEFEFA] border border-[#DED8CF] rounded-[2.25rem] max-w-lg w-full p-7 shadow-soft-lg space-y-5 animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2C2C24] font-serif">
                Official Soil Health Card (SHC) Lab Data
              </h3>
              <p className="text-xs text-[#78786C]">
                Override ISRIC spatial data with your physical wet-chemistry lab test
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#78786C] hover:text-[#2C2C24] p-1.5 rounded-full hover:bg-[#F0EBE5] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#2C2C24] font-bold mb-1">
                Soil pH in H2O (0-14):
              </label>
              <input
                type="number"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                className="w-full bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-xl px-3.5 py-2.5 text-[#2C2C24] font-mono focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
                required
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1">
                Organic Carbon (%):
              </label>
              <input
                type="number"
                step="0.01"
                value={oc}
                onChange={(e) => setOc(e.target.value)}
                className="w-full bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-xl px-3.5 py-2.5 text-[#2C2C24] font-mono focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
                required
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1">
                Available Nitrogen (N kg/ha):
              </label>
              <input
                type="number"
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                className="w-full bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-xl px-3.5 py-2.5 text-[#2C2C24] font-mono focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
                required
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1">
                Available Phosphorus (P kg/ha):
              </label>
              <input
                type="number"
                step="0.1"
                value={phosphorus}
                onChange={(e) => setPhosphorus(e.target.value)}
                className="w-full bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-xl px-3.5 py-2.5 text-[#2C2C24] font-mono focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
                required
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1">
                Available Potassium (K kg/ha):
              </label>
              <input
                type="number"
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                className="w-full bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-xl px-3.5 py-2.5 text-[#2C2C24] font-mono focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
                required
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1">
                EC Salinity (dS/m):
              </label>
              <input
                type="number"
                step="0.01"
                value={ec}
                onChange={(e) => setEc(e.target.value)}
                className="w-full bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-xl px-3.5 py-2.5 text-[#2C2C24] font-mono focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
                required
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2.5 border-t border-[#DED8CF]/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#DED8CF] text-[#78786C] hover:bg-[#F0EBE5] font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-white font-bold flex items-center gap-1.5 shadow-soft"
            >
              {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
              <span>{saved ? "Saved & Synced!" : "Save to Farm Profile"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
