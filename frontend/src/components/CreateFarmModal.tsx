"use client";

import React, { useState } from "react";
import { X, Sprout, MapPin, Check } from "lucide-react";
import { Farm } from "@/types";

interface CreateFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFarmCreated: (farm: Farm) => void;
  currentLat: number;
  currentLon: number;
}

export default function CreateFarmModal({
  isOpen,
  onClose,
  onFarmCreated,
  currentLat,
  currentLon,
}: CreateFarmModalProps) {
  const [farmName, setFarmName] = useState("My Smart Farm Plot");
  const [acres, setAcres] = useState("5.0");
  const [soilType, setSoilType] = useState("Black Soil (Clay Loam)");
  const [waterSource, setWaterSource] = useState("Drip Irrigation + Borewell");
  const [lat, setLat] = useState(currentLat.toString());
  const [lon, setLon] = useState(currentLon.toString());
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const d = 0.0014;

    const payload = {
      farm_name: farmName,
      total_area_acres: parseFloat(acres),
      soil_type: soilType,
      primary_water_source: waterSource,
      center_latitude: latNum,
      center_longitude: lonNum,
      boundary_polygon: [
        [lonNum - d, latNum - d],
        [lonNum + d, latNum - d],
        [lonNum + d, latNum + d],
        [lonNum - d, latNum + d],
      ],
    };

    try {
      const res = await fetch("http://localhost:8000/api/farms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        onFarmCreated(data.farm);
        onClose();
      }
    } catch (err) {
      console.error("Failed to register farm:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#FEFEFA] border border-[#DED8CF] rounded-[2.25rem] max-w-lg w-full p-7 shadow-soft-lg space-y-5 animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2C2C24] font-serif">
                Register New Agricultural Plot
              </h3>
              <p className="text-xs text-[#78786C]">
                Saves farm boundary polygon to Supabase PostGIS spatial database
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#2C2C24] font-bold mb-1">
              Farm / Plot Name:
            </label>
            <input
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="w-full bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-full px-4 py-2.5 text-[#2C2C24] focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#2C2C24] font-bold mb-1">
                Area in Acres:
              </label>
              <input
                type="number"
                step="0.1"
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                className="w-full bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-full px-4 py-2.5 text-[#2C2C24] font-mono focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
                required
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1">
                Dominant Soil Type:
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-full px-4 py-2.5 text-[#2C2C24] focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
              >
                <option value="Black Soil (Clay Loam)">Black Soil (Clay Loam)</option>
                <option value="Alluvial Soil (Sandy Loam)">Alluvial Soil (Sandy Loam)</option>
                <option value="Red Laterite Soil">Red Laterite Soil</option>
                <option value="Saline / Sodic Soil">Saline / Sodic Soil</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#2C2C24] font-bold mb-1">
                Center Latitude (°N):
              </label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-full px-4 py-2.5 text-[#2C2C24] font-mono focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
                required
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1">
                Center Longitude (°E):
              </label>
              <input
                type="number"
                step="0.0001"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                className="w-full bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-full px-4 py-2.5 text-[#2C2C24] font-mono focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#2C2C24] font-bold mb-1">
              Primary Water Source:
            </label>
            <input
              type="text"
              value={waterSource}
              onChange={(e) => setWaterSource(e.target.value)}
              className="w-full bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-full px-4 py-2.5 text-[#2C2C24] focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
              required
            />
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
              disabled={loading}
              className="px-6 py-2 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-white font-bold transition shadow-soft flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4" />
              <span>{loading ? "Registering..." : "Save to Supabase"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
