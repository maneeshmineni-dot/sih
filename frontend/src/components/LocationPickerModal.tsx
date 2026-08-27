"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  MapPin, 
  Navigation, 
  Search, 
  Loader2, 
  Check, 
  Crosshair, 
  Compass, 
  Sparkles,
  AlertCircle
} from "lucide-react";

interface LocationResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    village?: string;
    town?: string;
    city?: string;
    county?: string;
    state_district?: string;
    state?: string;
    country?: string;
  };
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (lat: number, lon: number, locationName: string) => void;
  currentLat: number;
  currentLon: number;
  currentLocationName: string;
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  currentLat,
  currentLon,
  currentLocationName,
}: LocationPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Manual Coordinates
  const [customLat, setCustomLat] = useState(currentLat.toString());
  const [customLon, setCustomLon] = useState(currentLon.toString());
  const [customName, setCustomName] = useState(currentLocationName);

  // Debounced Search using OpenStreetMap Nominatim
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setGpsError(null);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(
            searchQuery
          )}`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Geocoding search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  // 1. Browser Geolocation Auto-Detection
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Reverse geocode to get city / village name
        let detectedName = `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;
        try {
          const revRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          if (revRes.ok) {
            const revData = await revRes.json();
            const addr = revData.address || {};
            const localName =
              addr.village ||
              addr.suburb ||
              addr.town ||
              addr.city ||
              addr.county ||
              addr.state_district ||
              "Current Location";
            const stateName = addr.state ? `, ${addr.state}` : "";
            detectedName = `${localName}${stateName}`;
          }
        } catch (e) {
          console.warn("Reverse geocode warning:", e);
        }

        setIsDetectingGps(false);
        onSelectLocation(lat, lon, detectedName);
        onClose();
      },
      (error) => {
        setIsDetectingGps(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError("Location permission denied. Please search your village/city below or enter coordinates.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsError("GPS position unavailable. Please search your location below.");
        } else {
          setGpsError("Location request timed out. Please try searching manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // 2. Select Location from search results
  const handleSelectResult = (result: LocationResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    const parts = result.display_name.split(",");
    const shortName = parts.slice(0, 2).join(",").trim();
    onSelectLocation(lat, lon, shortName || result.display_name);
    onClose();
  };

  // 3. Submit Manual Coordinates
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (!isNaN(lat) && !isNaN(lon)) {
      onSelectLocation(lat, lon, customName.trim() || `Field (${lat.toFixed(3)}, ${lon.toFixed(3)})`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FEFEFA] border border-[#DED8CF] rounded-[2.25rem] max-w-lg w-full p-6 sm:p-7 shadow-soft-lg space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] flex items-center justify-center border border-[#5D7052]/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2C2C24] font-serif">
                Select Your Farm Location
              </h3>
              <p className="text-xs text-[#78786C]">
                Syncs real-time Sentinel-2, ECMWF weather, and ISRIC soil data for your exact field
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

        {/* GPS Auto-Detect Button */}
        <div className="space-y-2">
          <button
            onClick={handleDetectGps}
            disabled={isDetectingGps}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#5D7052] to-[#4D5E44] hover:from-[#4D5E44] hover:to-[#3E4C37] text-white font-bold text-xs flex items-center justify-center gap-2.5 shadow-soft transition-all cursor-pointer group"
          >
            {isDetectingGps ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Acquiring High-Accuracy GPS Coordinates...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Use My Exact GPS Location (Auto-Detect)</span>
              </>
            )}
          </button>

          {gpsError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{gpsError}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-xs text-[#78786C] font-semibold">
          <div className="h-px flex-1 bg-[#DED8CF]"></div>
          <span>OR SEARCH ANY REGION</span>
          <div className="h-px flex-1 bg-[#DED8CF]"></div>
        </div>

        {/* Search Input */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#78786C] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Village, Tehsil, District, PIN Code (e.g. Niphad, Nashik)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-2xl pl-11 pr-4 py-3 text-xs text-[#2C2C24] placeholder-[#78786C] focus:outline-none focus:ring-2 focus:ring-[#5D7052]/30 transition"
              autoFocus
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 text-[#5D7052] animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {/* Autocomplete Results */}
          {searchResults.length > 0 && (
            <div className="bg-[#FEFEFA] border border-[#DED8CF] rounded-2xl overflow-hidden shadow-soft divide-y divide-[#DED8CF]/60 max-h-56 overflow-y-auto">
              {searchResults.map((res) => (
                <button
                  key={res.place_id}
                  onClick={() => handleSelectResult(res)}
                  className="w-full text-left p-3 hover:bg-[#F0EBE5]/60 transition flex items-start gap-2.5 text-xs text-[#2C2C24] cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#5D7052] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-[#2C2C24]">{res.display_name.split(",")[0]}</p>
                    <p className="text-[11px] text-[#78786C] line-clamp-1">{res.display_name}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#5D7052] bg-[#5D7052]/10 px-2 py-0.5 rounded-full shrink-0 font-bold">
                    {parseFloat(res.lat).toFixed(2)}°N
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Manual Coordinates Option */}
        <details className="text-xs group border border-[#DED8CF] rounded-2xl p-3.5 bg-[#F0EBE5]/30">
          <summary className="font-bold text-[#2C2C24] cursor-pointer flex items-center justify-between list-none">
            <span className="flex items-center gap-1.5 font-serif">
              <Crosshair className="w-3.5 h-3.5 text-[#C18C5D]" />
              Enter Custom GPS Coordinates
            </span>
            <span className="text-[10px] text-[#5D7052] group-open:rotate-180 transition-transform font-mono">▼</span>
          </summary>

          <form onSubmit={handleManualSubmit} className="mt-3 space-y-3 pt-2 border-t border-[#DED8CF]/60">
            <div>
              <label className="block text-[#78786C] text-[11px] font-bold mb-1">
                Farm / Location Label:
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. North Plot #3"
                className="w-full bg-[#FEFEFA] border border-[#DED8CF] rounded-xl px-3 py-2 text-xs text-[#2C2C24] focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#78786C] text-[11px] font-bold mb-1">
                  Latitude (°N):
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  className="w-full bg-[#FEFEFA] border border-[#DED8CF] rounded-xl px-3 py-2 text-xs text-[#2C2C24] font-mono focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#78786C] text-[11px] font-bold mb-1">
                  Longitude (°E):
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={customLon}
                  onChange={(e) => setCustomLon(e.target.value)}
                  className="w-full bg-[#FEFEFA] border border-[#DED8CF] rounded-xl px-3 py-2 text-xs text-[#2C2C24] font-mono focus:outline-none focus:ring-1 focus:ring-[#5D7052]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#5D7052] hover:bg-[#4D5E44] text-white font-bold text-xs shadow-soft transition"
            >
              Apply Coordinates
            </button>
          </form>
        </details>

      </div>
    </div>
  );
}
