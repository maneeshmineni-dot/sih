"use client";

import React, { useEffect, useState } from "react";
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
  Maximize2
} from "lucide-react";

interface FarmMapDrawerProps {
  centerLat: number;
  centerLon: number;
  farmName: string;
  onPolygonChange: (coords: number[][], areaAcres: number) => void;
  onLocationChange?: (lat: number, lon: number, name?: string) => void;
}

// Geodesic shoelace area calculation for polygon points in [lat, lon]
function calculatePolygonAreaAcres(points: [number, number][]): number {
  if (points.length < 3) return 0;
  const avgLat = points.reduce((sum, p) => sum + p[0], 0) / points.length;
  const latFactor = 111320; // meters per degree latitude
  const lonFactor = 111320 * Math.cos((avgLat * Math.PI) / 180);

  let areaSqMeters = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const xi = points[i][1] * lonFactor;
    const yi = points[i][0] * latFactor;
    const xj = points[j][1] * lonFactor;
    const yj = points[j][0] * latFactor;
    areaSqMeters += xi * yj - xj * yi;
  }
  areaSqMeters = Math.abs(areaSqMeters) / 2;
  const acres = areaSqMeters / 4046.86;
  return Math.max(0.1, Math.round(acres * 100) / 100);
}

// Geodesic boundary perimeter calculation (Haversine in meters)
function calculatePerimeterMeters(points: [number, number][]): number {
  if (points.length < 2) return 0;
  let totalDist = 0;
  for (let i = 0; i < points.length; i++) {
    const next = points[(i + 1) % points.length];
    const lat1 = (points[i][0] * Math.PI) / 180;
    const lon1 = (points[i][1] * Math.PI) / 180;
    const lat2 = (next[0] * Math.PI) / 180;
    const lon2 = (next[1] * Math.PI) / 180;
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    totalDist += 6371000 * c;
  }
  return Math.round(totalDist);
}

// Dynamically import the Leaflet map component with ssr: false
const LeafletMapInner = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[480px] flex items-center justify-center bg-[#F0EBE5] text-[#78786C] text-sm">
      <div className="flex items-center gap-2">
        <Crosshair className="w-5 h-5 animate-spin text-[#4A5D43]" />
        <span>Loading High-Res Earth Observation Map...</span>
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
  const [mapType, setMapType] = useState<"satellite" | "street">("satellite");
  const [areaAcres, setAreaAcres] = useState<number>(5.0);
  const [perimeterMeters, setPerimeterMeters] = useState<number>(570);
  const [khasraNumber, setKhasraNumber] = useState<string>("Survey #142/A");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isPinpointMode, setIsPinpointMode] = useState<boolean>(false);
  const [pinpointLocation, setPinpointLocation] = useState<[number, number] | null>(null);
  const initializedCenter = React.useRef<{ lat: number; lon: number }>({ lat: 0, lon: 0 });

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
      setAreaAcres(5.0);
      setPerimeterMeters(calculatePerimeterMeters(initialPolygon));
    }
  }, [centerLat, centerLon]);

  const handleResetPlot = () => {
    const d = 0.00064 * Math.sqrt(5.0);
    const initialPolygon: [number, number][] = [
      [centerLat - d, centerLon - d],
      [centerLat - d, centerLon + d],
      [centerLat + d, centerLon + d],
      [centerLat + d, centerLon - d],
    ];
    setPoints(initialPolygon);
    setAreaAcres(5.0);
    setPerimeterMeters(calculatePerimeterMeters(initialPolygon));
    setIsDrawing(false);
    setPinpointLocation(null);
    const converted = initialPolygon.map(([lat, lon]) => [lon, lat]);
    onPolygonChange(converted, 5.0);
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
    setAreaAcres(acres);
    setPerimeterMeters(calculatePerimeterMeters(newPolygon));
    setIsDrawing(false);
    const converted = newPolygon.map(([lat, lon]) => [lon, lat]);
    onPolygonChange(converted, acres);
  };

  const handleVertexDrag = (index: number, newPos: [number, number]) => {
    const updated: [number, number][] = [...points];
    updated[index] = newPos;
    const newAcres = calculatePolygonAreaAcres(updated);
    const newPerim = calculatePerimeterMeters(updated);
    setPoints(updated);
    setAreaAcres(newAcres);
    setPerimeterMeters(newPerim);
    const converted = updated.map(([lat, lon]) => [lon, lat]);
    onPolygonChange(converted, newAcres);
  };

  const handleMapClick = (lat: number, lon: number) => {
    if (isDrawing) {
      const updated: [number, number][] = [...points, [lat, lon]];
      const newAcres = calculatePolygonAreaAcres(updated);
      const newPerim = calculatePerimeterMeters(updated);
      setPoints(updated);
      setAreaAcres(newAcres);
      setPerimeterMeters(newPerim);
      const converted = updated.map(([pLat, pLon]) => [pLon, pLat]);
      onPolygonChange(converted, newAcres);
    } else {
      setPinpointLocation([lat, lon]);
    }
  };

  const handleMoveFarmHere = (lat: number, lon: number) => {
    if (onLocationChange) {
      onLocationChange(lat, lon, `Farm Plot (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`);
    }
    const d = 0.00064 * Math.sqrt(areaAcres || 5.0);
    const newPolygon: [number, number][] = [
      [lat - d, lon - d],
      [lat - d, lon + d],
      [lat + d, lon + d],
      [lat + d, lon - d],
    ];
    setPoints(newPolygon);
    const converted = newPolygon.map(([pLat, pLon]) => [pLon, pLat]);
    onPolygonChange(converted, areaAcres);
  };

  // Export Official PMFBY / Land Record GeoJSON
  const handleExportGeoJSON = () => {
    if (points.length < 3) return;
    const geoCoordinates = points.map(([lat, lon]) => [lon, lat]);
    geoCoordinates.push([points[0][1], points[0][0]]);

    const geojson = {
      type: "FeatureCollection",
      name: `${farmName}_LandParcel`,
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
            area_acres: areaAcres,
            area_hectares: Math.round(areaAcres * 0.404686 * 100) / 100,
            perimeter_meters: perimeterMeters,
            center_latitude: centerLat,
            center_longitude: centerLon,
            compliance: "PMFBY Compliant",
            generated_by: "AgriSphere AI",
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
    <description>Khasra/Survey: ${khasraNumber} | Area: ${areaAcres} Acres</description>
    <Placemark>
      <name>${farmName} Parcel</name>
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
    <div className="space-y-3">
      
      {/* 1. CLEAN EXTERNAL TOOLBAR & LAND METRICS PANEL (Above the Map Canvas) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FEFEFA] border border-[#E5E0D5] shadow-soft flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Left: Farm Info, Area, Perimeter & Presets */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A5D43] animate-pulse"></span>
            <span className="font-bold text-xs sm:text-sm text-[#2C2C24] font-serif">{farmName}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FAF8F3] px-2.5 py-1 rounded-lg border border-[#E5E0D5]">
            <Tag className="w-3 h-3 text-[#4A5D43] shrink-0" />
            <input
              type="text"
              value={khasraNumber}
              onChange={(e) => setKhasraNumber(e.target.value)}
              placeholder="Survey / Khasra #"
              className="w-28 bg-transparent text-[11px] font-mono text-[#2C2C24] focus:outline-none placeholder:text-stone-400 font-semibold"
            />
          </div>

          {/* Area & Perimeter Pills */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F3] border border-[#E5E0D5] text-[#4A5D43] font-bold">
              🌾 {areaAcres} Acres <span className="text-[10px] text-[#78786C] font-normal">({(areaAcres * 0.4047).toFixed(1)} Ha)</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F3] border border-[#E5E0D5] text-[#78786C] font-mono text-[11px]">
              Perimeter: <b className="text-[#2C2C24]">{perimeterMeters}m</b>
            </span>
          </div>

          {/* Presets Pills */}
          <div className="flex items-center gap-1">
            {[1.0, 2.5, 5.0, 10.0, 20.0].map((acres) => (
              <button
                key={acres}
                type="button"
                onClick={() => handleApplyPresetSize(acres)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                  Math.abs(areaAcres - acres) < 0.2
                    ? "bg-[#4A5D43] text-white shadow-xs"
                    : "bg-[#F0EBE5] text-[#2C2C24] hover:bg-[#E5DFD7] border border-[#DED8CF]"
                }`}
              >
                {acres} Ac
              </button>
            ))}
          </div>
        </div>

        {/* Right: Map Controls & Export Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="bg-[#EAE6DE] p-0.5 rounded-xl flex items-center border border-[#DAD5C9]">
            <button
              type="button"
              onClick={() => setMapType("satellite")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                mapType === "satellite" ? "bg-[#4A5D43] text-white shadow-xs" : "text-[#4A5D43]"
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapType("street")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                mapType === "street" ? "bg-[#4A5D43] text-white shadow-xs" : "text-[#4A5D43]"
              }`}
            >
              Street
            </button>
          </div>

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
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{isPinpointMode ? "Targeting..." : "Pinpoint"}</span>
          </button>

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
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{isDrawing ? "Adding..." : "Add Corners"}</span>
          </button>

          <button
            type="button"
            onClick={handleResetPlot}
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] transition cursor-pointer border border-[#E5E0D5]"
            title="Reset to standard square polygon"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleExportGeoJSON}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#FAF8F3] hover:bg-[#F0EBE5] text-[#4A5D43] border border-[#E5E0D5] transition cursor-pointer shadow-2xs"
          >
            <Download className="w-3 h-3" />
            <span>GeoJSON</span>
          </button>

          <button
            type="button"
            onClick={handleExportKML}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#FAF8F3] hover:bg-[#F0EBE5] text-[#4A5D43] border border-[#E5E0D5] transition cursor-pointer shadow-2xs"
          >
            <FileCode className="w-3 h-3" />
            <span>KML</span>
          </button>
        </div>

      </div>

      {/* 2. 100% CLEAN, UNOBSTRUCTED MAP CANVAS */}
      <div className="relative w-full h-[520px] rounded-[2rem] overflow-hidden border border-[#DED8CF] shadow-soft-lg bg-[#F0EBE5]">
        
        {/* Render Dynamic Client Leaflet Map */}
        <LeafletMapInner
          centerLat={centerLat}
          centerLon={centerLon}
          farmName={farmName}
          points={points}
          mapType={mapType}
          areaAcres={areaAcres}
          isDrawing={isDrawing}
          isPinpointMode={isPinpointMode}
          pinpointLocation={pinpointLocation}
          onVertexDrag={handleVertexDrag}
          onPinpointDrag={(newPos) => setPinpointLocation(newPos)}
          onMapClick={handleMapClick}
          onMoveFarmHere={handleMoveFarmHere}
        />

        {/* Floating Active Pinpoint Action Bar at Bottom (Only when a point is pinned) */}
        {pinpointLocation && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-[#FEFEFA]/95 backdrop-blur-md px-4 py-2 rounded-full border border-red-200 shadow-xl text-xs text-[#2C2C24] font-bold flex items-center gap-3 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-1.5 text-red-600">
              <MapPin className="w-4 h-4 animate-bounce" />
              <span className="font-mono text-[11px]">{pinpointLocation[0].toFixed(4)}°N, {pinpointLocation[1].toFixed(4)}°E</span>
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
