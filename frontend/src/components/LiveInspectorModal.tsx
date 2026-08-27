"use client";

import React, { useState } from "react";
import { X, Search, Satellite, Droplets, Layers, Loader2, Sparkles } from "lucide-react";

interface LiveInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveInspectorModal({ isOpen, onClose }: LiveInspectorModalProps) {
  const [lat, setLat] = useState("20.0050");
  const [lon, setLon] = useState("73.7850");
  const [inspectData, setInspectData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/live-inspect?latitude=${lat}&longitude=${lon}`);
      if (res.ok) {
        const data = await res.json();
        setInspectData(data);
      }
    } catch (err) {
      console.error("Inspect query failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#FEFEFA] border border-[#DED8CF] rounded-[2.25rem] max-w-2xl w-full p-7 shadow-soft-lg space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2C2C24] font-serif">
                Global GPS Coordinate Inspector
              </h3>
              <p className="text-xs text-[#78786C]">
                Query any coordinate on Earth for live Sentinel-2, ECMWF, and ISRIC SoilGrids data
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

        {/* Input Form */}
        <form onSubmit={handleInspect} className="flex gap-3 text-xs">
          <input
            type="number"
            step="0.0001"
            placeholder="Latitude (e.g. 20.0050)"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="flex-1 bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-full px-4 py-2.5 text-[#2C2C24] font-mono focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
            required
          />
          <input
            type="number"
            step="0.0001"
            placeholder="Longitude (e.g. 73.7850)"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            className="flex-1 bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-full px-4 py-2.5 text-[#2C2C24] font-mono focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-white font-bold transition flex items-center gap-1.5 shadow-soft"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Inspect</span>
          </button>
        </form>

        {/* Inspect Results */}
        {inspectData && (
          <div className="space-y-4 pt-2 border-t border-[#DED8CF]/60">
            <h4 className="text-xs font-bold text-[#5D7052] uppercase tracking-wider font-serif flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5D7052]" />
              Live Telemetry Results ({inspectData.coordinates.latitude}°N, {inspectData.coordinates.longitude}°E):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#F0EBE5]/50 p-3.5 rounded-2xl border border-[#DED8CF]">
                <div className="flex items-center gap-1.5 text-[#5D7052] font-bold mb-1.5">
                  <Satellite className="w-4 h-4" />
                  <span>Sentinel-2 SRM</span>
                </div>
                <p className="text-[#78786C]">
                  NDVI: <b className="text-[#2C2C24]">{inspectData.live_satellite_remote_sensing.vegetation_indices.mean_ndvi}</b>
                </p>
                <p className="text-[#78786C]">
                  Canopy: <b className="text-[#2C2C24]">{inspectData.live_satellite_remote_sensing.vegetation_indices.canopy_density_pct}%</b>
                </p>
              </div>

              <div className="bg-[#F0EBE5]/50 p-3.5 rounded-2xl border border-[#DED8CF]">
                <div className="flex items-center gap-1.5 text-[#C18C5D] font-bold mb-1.5">
                  <Droplets className="w-4 h-4" />
                  <span>ECMWF Physics</span>
                </div>
                <p className="text-[#78786C]">
                  Moisture: <b className="text-[#2C2C24]">{inspectData.live_weather_and_soil_physics.current.soil_physics.soil_moisture_0_7cm_m3_m3} m³/m³</b>
                </p>
                <p className="text-[#78786C]">
                  14d Rain: <b className="text-[#2C2C24]">{inspectData.live_weather_and_soil_physics.agronomic_summary.total_predicted_14d_rainfall_mm} mm</b>
                </p>
              </div>

              <div className="bg-[#F0EBE5]/50 p-3.5 rounded-2xl border border-[#DED8CF]">
                <div className="flex items-center gap-1.5 text-[#5D7052] font-bold mb-1.5">
                  <Layers className="w-4 h-4" />
                  <span>ISRIC Chemistry</span>
                </div>
                <p className="text-[#78786C]">
                  pH: <b className="text-[#2C2C24]">{inspectData.live_soil_properties.ph_level}</b>
                </p>
                <p className="text-[#78786C]">
                  OC: <b className="text-[#2C2C24]">{inspectData.live_soil_properties.organic_carbon_pct}%</b>
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
