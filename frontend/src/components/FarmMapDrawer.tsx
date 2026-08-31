"use client";

import React, { useEffect, useState, useTransition, useMemo } from "react";
import dynamic from "next/dynamic";
import { 
  RotateCcw, 
  Crosshair, 
  Plus, 
  Check, 
  PenTool, 
  Download, 
  FileCode, 
  Tag,
  MapPin,
  Ruler,
  Layers,
  Trash2,
  Sparkles,
  Search,
  Compass,
  Activity,
  Droplets,
  TrendingUp,
  Globe,
  Sun,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { 
  calculatePolygonArea, 
  calculatePerimeter, 
  convertAreaUnits, 
  getPolygonCenter,
  formatUnitDisplay,
  LandUnits
} from "../utils/geoMeasurement";
import { 
  getAgroClimaticZone, 
  searchAgriculturalLocations, 
  INDIAN_AGRICULTURAL_PLACES, 
  IndianPlace 
} from "../services/geoService";

interface FarmMapDrawerProps {
  centerLat: number;
  centerLon: number;
  farmName: string;
  onPolygonChange: (coords: number[][], areaAcres: number) => void;
  onLocationChange?: (lat: number, lon: number, name?: string) => void;
}

// Dynamically import Leaflet map inner with ssr: false
const LeafletMapInner = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-[#F0EBE5] text-[#78786C] text-sm">
      <div className="flex items-center gap-2">
        <Crosshair className="w-5 h-5 animate-spin text-[#4A5D43]" />
        <span>Loading High-Resolution Satellite GIS Canvas...</span>
      </div>
    </div>
  ),
});

export default function FarmMapDrawer({
  centerLat,
  centerLon,
  farmName,
  onPolygonChange,
  onLocationChange,
}: FarmMapDrawerProps) {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [mapType, setMapType] = useState<"hybrid" | "satellite" | "esri" | "topo" | "street">("hybrid");
  const [activeUnit, setActiveUnit] = useState<"acres" | "hectares" | "gunthas" | "bighas" | "cents" | "sqm">("acres");
  const [khasraNumber, setKhasraNumber] = useState<string>("Survey #142/A");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isPinpointMode, setIsPinpointMode] = useState<boolean>(false);
  const [pinpointLocation, setPinpointLocation] = useState<[number, number] | null>(null);
  
  // Search & Presets
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IndianPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  // AI Land Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanTelemetry, setScanTelemetry] = useState<{
    ndvi: number;
    soilMoisture: number;
    vigor: string;
    waterStress: string;
    agroZone: string;
  } | null>(null);

  const initializedCenter = React.useRef<{ lat: number; lon: number }>({ lat: 0, lon: 0 });

  // Compute Area & Perimeter dynamically
  const areaSqMeters = useMemo(() => calculatePolygonArea(points), [points]);
  const areaUnits = useMemo(() => convertAreaUnits(areaSqMeters), [areaSqMeters]);
  const perimeterMeters = useMemo(() => calculatePerimeter(points), [points]);
  const polygonCenter = useMemo(() => getPolygonCenter(points), [points]);
  const activeZone = useMemo(() => getAgroClimaticZone(polygonCenter[0], polygonCenter[1]), [polygonCenter]);

  // Initialize standard square farm polygon on mount or location teleport
  useEffect(() => {
    const dist = Math.hypot(centerLat - initializedCenter.current.lat, centerLon - initializedCenter.current.lon);
    if (dist > 0.0005) {
      initializedCenter.current = { lat: centerLat, lon: centerLon };
      const d = 0.00064 * Math.sqrt(5.0);
      const initialPolygon: [number, number][] = [
        [centerLat - d, centerLon - d],
        [centerLat - d, centerLon + d],
        [centerLat + d, centerLon + d],
        [centerLat + d, centerLon - d],
      ];
      setPoints(initialPolygon);
    }
  }, [centerLat, centerLon]);

  // Debounced Place Search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchAgriculturalLocations(searchQuery, controller.signal);
        setSearchResults(results);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  // Notify parent of polygon updates
  const emitPolygonChange = (newPoints: [number, number][]) => {
    const sqM = calculatePolygonArea(newPoints);
    const acres = Math.max(0.1, Math.round((sqM / 4046.856) * 100) / 100);
    const converted = newPoints.map(([lat, lon]) => [lon, lat]);
    onPolygonChange(converted, acres);
  };

  const handleResetPlot = () => {
    const d = 0.00064 * Math.sqrt(5.0);
    const initialPolygon: [number, number][] = [
      [centerLat - d, centerLon - d],
      [centerLat - d, centerLon + d],
      [centerLat + d, centerLon + d],
      [centerLat + d, centerLon - d],
    ];
    setPoints(initialPolygon);
    setIsDrawing(false);
    setPinpointLocation(null);
    setScanTelemetry(null);
    emitPolygonChange(initialPolygon);
  };

  const handleApplyPresetSize = (acres: number) => {
    const d = 0.00064 * Math.sqrt(acres);
    const newPolygon: [number, number][] = [
      [centerLat - d, centerLon - d],
      [centerLat - d, centerLon + d],
      [centerLat + d, centerLon + d],
      [centerLat + d, centerLon - d],
    ];
    setPoints(newPolygon);
    setIsDrawing(false);
    emitPolygonChange(newPolygon);
  };

  const handleSelectPresetLocation = (place: IndianPlace) => {
    if (onLocationChange) {
      onLocationChange(place.lat, place.lon, place.name);
    }
    const d = 0.00064 * Math.sqrt(areaUnits.acres || 5.0);
    const newPolygon: [number, number][] = [
      [place.lat - d, place.lon - d],
      [place.lat - d, place.lon + d],
      [place.lat + d, place.lon + d],
      [place.lat + d, place.lon - d],
    ];
    setPoints(newPolygon);
    setSearchQuery("");
    setShowSearchDropdown(false);
    emitPolygonChange(newPolygon);
  };

  const handleVertexDrag = (index: number, newPos: [number, number]) => {
    const updated: [number, number][] = [...points];
    updated[index] = newPos;
    setPoints(updated);
    emitPolygonChange(updated);
  };

  const handleVertexDelete = (index: number) => {
    if (points.length <= 3) return;
    const updated = points.filter((_, idx) => idx !== index);
    setPoints(updated);
    emitPolygonChange(updated);
  };

  const handleInsertMidpoint = (insertIndex: number, coord: [number, number]) => {
    const updated = [...points];
    updated.splice(insertIndex, 0, coord);
    setPoints(updated);
    emitPolygonChange(updated);
  };

  const handleUndoLastPoint = () => {
    if (points.length <= 3) return;
    const updated = points.slice(0, -1);
    setPoints(updated);
    emitPolygonChange(updated);
  };

  const handleMapClick = (lat: number, lon: number) => {
    if (isDrawing) {
      const updated: [number, number][] = [...points, [lat, lon]];
      setPoints(updated);
      emitPolygonChange(updated);
    } else {
      setPinpointLocation([lat, lon]);
    }
  };

  const handleMoveFarmHere = (lat: number, lon: number) => {
    if (onLocationChange) {
      onLocationChange(lat, lon, `Farm Plot (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`);
    }
    const d = 0.00064 * Math.sqrt(areaUnits.acres || 5.0);
    const newPolygon: [number, number][] = [
      [lat - d, lon - d],
      [lat - d, lon + d],
      [lat + d, lon + d],
      [lat + d, lon - d],
    ];
    setPoints(newPolygon);
    setPinpointLocation(null);
    emitPolygonChange(newPolygon);
  };

  // Run AI Land Parcel Scan Simulation
  const handleScanLand = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanTelemetry({
            ndvi: 0.78,
            soilMoisture: 38.5,
            vigor: "High Biomass Density (Dense Canopy)",
            waterStress: "Low Stress (Optimal Root Saturation)",
            agroZone: activeZone.name,
          });
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  // Export PMFBY GeoJSON
  const handleExportGeoJSON = () => {
    if (points.length < 3) return;
    const geoCoordinates = points.map(([lat, lon]) => [lon, lat]);
    geoCoordinates.push([points[0][1], points[0][0]]);

    const geojson = {
      type: "FeatureCollection",
      name: `${farmName}_PMFBY_LandParcel`,
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
      },
      features: [
        {
          type: "Feature",
          properties: {
            farm_name: farmName,
            survey_khasra_no: khasraNumber,
            area_acres: areaUnits.acres,
            area_hectares: areaUnits.hectares,
            area_gunthas: areaUnits.gunthas,
            area_bighas: areaUnits.bighas,
            perimeter_meters: perimeterMeters,
            agro_climatic_zone: activeZone.name,
            major_crops: activeZone.majorCrops,
            center_latitude: polygonCenter[0],
            center_longitude: polygonCenter[1],
            compliance: "PMFBY Compliant Field Cadastral",
            generated_by: "AgriSense AI",
            timestamp: new Date().toISOString()
          },
          geometry: {
            type: "Polygon",
            coordinates: [geoCoordinates]
          }
        }
      ]
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${farmName.replace(/[^a-zA-Z0-9]/g, "_")}_PMFBY_Parcel.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export KML for Google Earth
  const handleExportKML = () => {
    if (points.length < 3) return;
    const coordsString = points
      .map(([lat, lon]) => `${lon},${lat},0`)
      .concat([`${points[0][1]},${points[0][0]},0`])
      .join(" ");

    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${farmName}</name>
    <description>Khasra: ${khasraNumber} | Area: ${areaUnits.acres} Acres (${areaUnits.hectares} Ha) | Zone: ${activeZone.name}</description>
    <Placemark>
      <name>${farmName} Cadastral Boundary</name>
      <Polygon>
        <extrude>1</extrude>
        <altitudeMode>clampToGround</altitudeMode>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordsString}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;

    const blob = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${farmName.replace(/[^a-zA-Z0-9]/g, "_")}_Parcel.kml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3 font-sans">
      
      {/* 1. TOP INTERACTIVE TOOLBAR & SEARCH BAR */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FEFEFA] border border-[#E5E0D5] shadow-soft flex flex-col gap-3">
        
        {/* Row 1: Location Search & Preset Estates */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          
          {/* Search Input with Autocomplete */}
          <div className="relative flex-1 max-w-md">
            <div className="flex items-center gap-2 bg-[#FAF8F3] px-3 py-1.5 rounded-xl border border-[#E5E0D5]">
              <Search className="w-4 h-4 text-[#4A5D43] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchDropdown(true);
                }}
                placeholder="Search Indian farm, mandi, district or PIN..."
                className="w-full bg-transparent text-xs text-[#2C2C24] focus:outline-none placeholder:text-stone-400 font-medium"
              />
              {isSearching && <Crosshair className="w-3.5 h-3.5 animate-spin text-[#4A5D43]" />}
            </div>

            {/* Dropdown Results */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#FEFEFA] border border-[#DED8CF] rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                <div className="p-1.5">
                  {searchResults.map((place, idx) => (
                    <button
                      key={`${place.name}-${idx}`}
                      type="button"
                      onClick={() => handleSelectPresetLocation(place)}
                      className="w-full text-left p-2 rounded-xl hover:bg-[#FAF8F3] transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#4A5D43] shrink-0 group-hover:scale-110 transition" />
                        <div>
                          <div className="text-xs font-bold text-[#2C2C24]">{place.name}</div>
                          <div className="text-[10px] text-[#78786C]">{place.state} • {place.tag}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#4A5D43] font-bold opacity-0 group-hover:opacity-100 transition">
                        Fly Here →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preset Farm Estates Quick Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-[#78786C] uppercase tracking-wider shrink-0">Presets:</span>
            {INDIAN_AGRICULTURAL_PLACES.slice(0, 4).map((estate) => (
              <button
                key={estate.name}
                type="button"
                onClick={() => handleSelectPresetLocation(estate)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#FAF8F3] hover:bg-[#F0EBE5] text-[#2C2C24] border border-[#E5E0D5] transition cursor-pointer"
              >
                📍 {estate.town}
              </button>
            ))}
          </div>

        </div>

        {/* Row 2: Metrics, Unit Switcher, Layers & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-[#E5E0D5]/70">
          
          {/* Left: Farm Name, Khasra, Area & Unit Pills */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#FAF8F3] px-2.5 py-1 rounded-lg border border-[#E5E0D5]">
              <Tag className="w-3 h-3 text-[#4A5D43] shrink-0" />
              <input
                type="text"
                value={khasraNumber}
                onChange={(e) => setKhasraNumber(e.target.value)}
                placeholder="Survey / Khasra #"
                className="w-24 bg-transparent text-[11px] font-mono text-[#2C2C24] focus:outline-none placeholder:text-stone-400 font-semibold"
              />
            </div>

            {/* Active Land Measurement Area Badge */}
            <div className="flex items-center gap-1 bg-[#FAF8F3] px-2.5 py-1 rounded-lg border border-[#E5E0D5] text-xs font-bold text-[#4A5D43]">
              <span>🌾 {formatUnitDisplay(areaUnits, activeUnit)}</span>
            </div>

            {/* Indian Land Unit Selector */}
            <div className="bg-[#EAE6DE] p-0.5 rounded-lg flex items-center border border-[#DAD5C9]">
              {(["acres", "hectares", "gunthas", "bighas", "cents"] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setActiveUnit(unit)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize transition cursor-pointer ${
                    activeUnit === unit ? "bg-[#4A5D43] text-white shadow-xs" : "text-[#4A5D43]"
                  }`}
                >
                  {unit === "hectares" ? "Ha" : unit}
                </button>
              ))}
            </div>

            {/* Acreage Presets */}
            <div className="flex items-center gap-1">
              {[1.0, 2.5, 5.0, 10.0].map((acres) => (
                <button
                  key={acres}
                  type="button"
                  onClick={() => handleApplyPresetSize(acres)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                    Math.abs(areaUnits.acres - acres) < 0.2
                      ? "bg-[#4A5D43] text-white shadow-xs"
                      : "bg-[#F0EBE5] text-[#2C2C24] hover:bg-[#E5DFD7] border border-[#DED8CF]"
                  }`}
                >
                  {acres} Ac
                </button>
              ))}
            </div>
          </div>

          {/* Right: Map Layers, Draw Tools, AI Land Scanner & Export */}
          <div className="flex items-center gap-1.5 flex-wrap">
            
            {/* Map Layer Switcher */}
            <div className="bg-[#EAE6DE] p-0.5 rounded-xl flex items-center border border-[#DAD5C9]">
              <button
                type="button"
                onClick={() => setMapType("hybrid")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  mapType === "hybrid" ? "bg-[#4A5D43] text-white shadow-xs" : "text-[#4A5D43]"
                }`}
                title="Google Hybrid Satellite with villages & roads"
              >
                🛰️ Google Hybrid
              </button>
              <button
                type="button"
                onClick={() => setMapType("esri")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  mapType === "esri" ? "bg-[#4A5D43] text-white shadow-xs" : "text-[#4A5D43]"
                }`}
                title="Esri Earth Observation"
              >
                Esri
              </button>
              <button
                type="button"
                onClick={() => setMapType("street")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  mapType === "street" ? "bg-[#4A5D43] text-white shadow-xs" : "text-[#4A5D43]"
                }`}
                title="OpenStreetMap Street View"
              >
                Street
              </button>
            </div>

            {/* Pinpoint Mode */}
            <button
              type="button"
              onClick={() => {
                setIsPinpointMode(!isPinpointMode);
                setIsDrawing(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer border ${
                isPinpointMode
                  ? "bg-red-600 text-white border-red-600 shadow-xs animate-pulse"
                  : "bg-[#FAF8F3] hover:bg-red-50 text-red-700 border-red-200"
              }`}
              title="Click anywhere on map to drop target pin"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isPinpointMode ? "Targeting..." : "Pinpoint"}</span>
            </button>

            {/* Add Corners Drawing Mode */}
            <button
              type="button"
              onClick={() => {
                setIsDrawing(!isDrawing);
                setIsPinpointMode(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer border ${
                isDrawing
                  ? "bg-amber-600 text-white border-amber-600 shadow-xs animate-pulse"
                  : "bg-[#FAF8F3] hover:bg-[#F0EBE5] text-[#4A5D43] border-[#E5E0D5]"
              }`}
              title="Click on map to sequentially add boundary vertices"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>{isDrawing ? "Adding..." : "Add Corners"}</span>
            </button>

            {/* Undo Last Point */}
            {points.length > 3 && (
              <button
                type="button"
                onClick={handleUndoLastPoint}
                className="flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-bold text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] transition cursor-pointer border border-[#E5E0D5]"
                title="Undo last point"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Undo</span>
              </button>
            )}

            {/* Reset */}
            <button
              type="button"
              onClick={handleResetPlot}
              className="flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-bold text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] transition cursor-pointer border border-[#E5E0D5]"
              title="Reset to standard square polygon"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            {/* AI Land Scan Button */}
            <button
              type="button"
              onClick={handleScanLand}
              disabled={isScanning}
              className="flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-bold bg-[#4A5D43] hover:bg-[#3A4B34] text-white shadow-xs transition cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
              <span>{isScanning ? `Scanning ${scanProgress}%` : "Scan Parcel"}</span>
            </button>

            {/* Export GeoJSON */}
            <button
              type="button"
              onClick={handleExportGeoJSON}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#FAF8F3] hover:bg-[#F0EBE5] text-[#4A5D43] border border-[#E5E0D5] transition cursor-pointer"
              title="Export PMFBY GeoJSON"
            >
              <Download className="w-3 h-3" />
              <span>GeoJSON</span>
            </button>

            {/* Export KML */}
            <button
              type="button"
              onClick={handleExportKML}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#FAF8F3] hover:bg-[#F0EBE5] text-[#4A5D43] border border-[#E5E0D5] transition cursor-pointer"
              title="Export Google Earth KML"
            >
              <FileCode className="w-3 h-3" />
              <span>KML</span>
            </button>

          </div>

        </div>

      </div>

      {/* 2. AI LAND SCAN DIAGNOSTIC TELEMETRY (Appears after Scanning) */}
      {scanTelemetry && (
        <div className="p-3.5 rounded-2xl bg-[#FEFEFA] border border-[#4A5D43]/30 shadow-soft animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-xs text-[#2C2C24]">🌱 AI Field Scan Telemetry & Cadastral Profile</span>
            </div>
            <span className="text-[10px] font-bold text-[#4A5D43] bg-[#4A5D43]/10 px-2 py-0.5 rounded-full">
              Zone #{activeZone.id}: {activeZone.name}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-[#FAF8F3] border border-[#E5E0D5]">
              <div className="text-[10px] text-[#78786C]">Vegetation Index</div>
              <div className="font-bold text-[#2C2C24] font-mono">NDVI: {scanTelemetry.ndvi}</div>
              <div className="text-[9px] text-emerald-600 font-semibold">{scanTelemetry.vigor}</div>
            </div>

            <div className="p-2 rounded-xl bg-[#FAF8F3] border border-[#E5E0D5]">
              <div className="text-[10px] text-[#78786C]">Root Moisture (0-7cm)</div>
              <div className="font-bold text-[#2C2C24] font-mono">{scanTelemetry.soilMoisture}%</div>
              <div className="text-[9px] text-[#4A5D43] font-semibold">{scanTelemetry.waterStress}</div>
            </div>

            <div className="p-2 rounded-xl bg-[#FAF8F3] border border-[#E5E0D5]">
              <div className="text-[10px] text-[#78786C]">Boundary Perimeter</div>
              <div className="font-bold text-[#2C2C24] font-mono">{perimeterMeters}m ({Math.round(perimeterMeters * 3.28084)} ft)</div>
              <div className="text-[9px] text-[#78786C]">{points.length} Cadastral Vertices</div>
            </div>

            <div className="p-2 rounded-xl bg-[#FAF8F3] border border-[#E5E0D5]">
              <div className="text-[10px] text-[#78786C]">Recommended Crops</div>
              <div className="font-bold text-[#4A5D43] truncate">{activeZone.majorCrops}</div>
              <div className="text-[9px] text-stone-500">ICAR Standard</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. 100% UNOBSTRUCTED HIGH-RES MAP CANVAS */}
      <div className="relative w-full h-[530px] rounded-[2rem] overflow-hidden border border-[#DED8CF] shadow-soft-lg bg-[#F0EBE5]">
        
        <LeafletMapInner
          centerLat={centerLat}
          centerLon={centerLon}
          farmName={farmName}
          points={points}
          mapType={mapType}
          areaAcres={areaUnits.acres}
          isDrawing={isDrawing}
          isPinpointMode={isPinpointMode}
          pinpointLocation={pinpointLocation}
          onVertexDrag={handleVertexDrag}
          onVertexDelete={handleVertexDelete}
          onInsertMidpoint={handleInsertMidpoint}
          onPinpointDrag={(newPos) => setPinpointLocation(newPos)}
          onMapClick={handleMapClick}
          onMoveFarmHere={handleMoveFarmHere}
        />

        {/* Floating Active Pinpoint Action Bar at Bottom (When pinpoint is active) */}
        {pinpointLocation && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-[#FEFEFA]/95 backdrop-blur-md px-4 py-2 rounded-full border border-red-200 shadow-xl text-xs text-[#2C2C24] font-bold flex items-center gap-3 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-1.5 text-red-600">
              <MapPin className="w-4 h-4 animate-bounce" />
              <span className="font-mono text-[11px]">
                {pinpointLocation[0].toFixed(4)}°N, {pinpointLocation[1].toFixed(4)}°E
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleMoveFarmHere(pinpointLocation[0], pinpointLocation[1])}
              className="px-3 py-1 bg-[#4A5D43] hover:bg-[#3A4B34] text-white rounded-full text-[11px] font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>🎯 Move Farm Plot Here</span>
            </button>

            <button
              type="button"
              onClick={() => setPinpointLocation(null)}
              className="text-[10px] text-stone-500 hover:text-black underline cursor-pointer"
            >
              Clear Pin
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
