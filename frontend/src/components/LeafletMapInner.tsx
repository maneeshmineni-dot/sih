"use client";

import React, { useEffect, useState } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Polygon, 
  Popup, 
  useMap, 
  useMapEvents 
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker icons
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// Normalize longitude into [-180, 180] range
const normalizeLng = (lng: number): number => {
  return ((((lng + 180) % 360) + 360) % 360) - 180;
};

// Custom Vertex Marker Icon (Small circular amber/green draggable handle)
const createVertexIcon = (index: number) => {
  return L.divIcon({
    className: "custom-vertex-icon",
    html: `<div style="
      width: 22px;
      height: 22px;
      background: #4A5D43;
      color: white;
      border: 2px solid #FEFEFA;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      cursor: grab;
    ">${index + 1}</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

// Animated Pinpoint Pointer Target Icon
const createPinpointIcon = () => {
  return L.divIcon({
    className: "custom-pinpoint-icon",
    html: `<div style="
      position: relative;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        position: absolute;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(220, 38, 38, 0.4);
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        width: 26px;
        height: 26px;
        background: #DC2626;
        border: 2.5px solid #FFFFFF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 13px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.45);
        cursor: grab;
      ">📍</div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap();
  const lastCenter = React.useRef<[number, number]>([0, 0]);

  useEffect(() => {
    if (!map) return;
    const dist = Math.hypot(center[0] - lastCenter.current[0], center[1] - lastCenter.current[1]);
    if (dist > 0.0008) {
      lastCenter.current = [center[0], center[1]];
      map.setView(center, map.getZoom() || 16, { animate: true });
    }
  }, [center, map]);

  return null;
}

function MapInteractionHandler({
  isDrawing,
  isPinpointMode,
  onMapClick,
  onHoverCoords,
}: {
  isDrawing: boolean;
  isPinpointMode: boolean;
  onMapClick: (lat: number, lon: number) => void;
  onHoverCoords: (lat: number, lon: number) => void;
}) {
  const map = useMapEvents({
    click: (e) => {
      const normalizedLon = normalizeLng(e.latlng.lng);
      onMapClick(e.latlng.lat, normalizedLon);
    },
    mousemove: (e) => {
      const normalizedLon = normalizeLng(e.latlng.lng);
      onHoverCoords(e.latlng.lat, normalizedLon);
    },
  });

  useEffect(() => {
    if (map) {
      const container = map.getContainer();
      if (isPinpointMode || isDrawing) {
        container.style.cursor = "crosshair";
      } else {
        container.style.cursor = "grab";
      }
    }
  }, [isPinpointMode, isDrawing, map]);

  return null;
}

interface LeafletMapInnerProps {
  centerLat: number;
  centerLon: number;
  farmName: string;
  points: [number, number][];
  mapType: "satellite" | "street";
  areaAcres: number;
  isDrawing?: boolean;
  isPinpointMode?: boolean;
  pinpointLocation?: [number, number] | null;
  onVertexDrag: (index: number, newPos: [number, number]) => void;
  onPinpointDrag?: (newPos: [number, number]) => void;
  onMapClick: (lat: number, lon: number) => void;
  onMoveFarmHere?: (lat: number, lon: number) => void;
}

export default function LeafletMapInner({
  centerLat,
  centerLon,
  farmName,
  points,
  mapType,
  areaAcres,
  isDrawing = false,
  isPinpointMode = false,
  pinpointLocation = null,
  onVertexDrag,
  onPinpointDrag,
  onMapClick,
  onMoveFarmHere,
}: LeafletMapInnerProps) {
  const [hoverCoords, setHoverCoords] = useState<{ lat: number; lon: number } | null>(null);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[centerLat, normalizeLng(centerLon)]}
        zoom={16}
        minZoom={3}
        maxZoom={20}
        worldCopyJump={true}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        className="w-full h-full"
      >
        <MapCenterController center={[centerLat, normalizeLng(centerLon)]} />
        <MapInteractionHandler
          isDrawing={isDrawing}
          isPinpointMode={isPinpointMode}
          onMapClick={onMapClick}
          onHoverCoords={(lat, lon) => setHoverCoords({ lat, lon })}
        />

        {mapType === "satellite" ? (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri World Imagery</a> & Sentinel-2'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={21}
            maxNativeZoom={18}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={21}
            maxNativeZoom={19}
          />
        )}

        {/* Polygon Boundary */}
        {points.length > 2 && (
          <Polygon
            positions={points}
            pathOptions={{
              color: "#16A34A",
              weight: 3,
              fillColor: "#4ADE80",
              fillOpacity: 0.3,
              dashArray: "6, 6",
            }}
          />
        )}

        {/* Draggable Polygon Vertex Pin Markers */}
        {points.map((pt, idx) => (
          <Marker
            key={`vertex-${idx}-${pt[0].toFixed(5)}-${pt[1].toFixed(5)}`}
            position={pt}
            draggable={true}
            icon={createVertexIcon(idx)}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                onVertexDrag(idx, [position.lat, normalizeLng(position.lng)]);
              },
            }}
          >
            <Popup className="custom-popup" closeButton={false}>
              <div className="p-1 text-center font-sans">
                <span className="font-bold text-xs text-[#2C2C24] block">Corner #{idx + 1}</span>
                <span className="font-mono text-[10px] text-[#78786C] block">
                  {pt[0].toFixed(5)}°N, {normalizeLng(pt[1]).toFixed(5)}°E
                </span>
                <span className="text-[9px] text-[#4A5D43] font-semibold mt-0.5 block">
                  Drag to reshape boundary
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Pinpoint Target Marker */}
        {pinpointLocation && (
          <Marker
            position={pinpointLocation}
            draggable={true}
            icon={createPinpointIcon()}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                if (onPinpointDrag) {
                  onPinpointDrag([pos.lat, normalizeLng(pos.lng)]);
                }
              },
            }}
          >
            <Popup className="custom-popup" closeButton={false} autoPan={true}>
              <div className="p-2 text-center font-sans space-y-1.5 min-w-[160px]">
                <div className="flex items-center justify-center gap-1 text-red-600 font-bold text-xs">
                  <span>📍 Pinpoint Location</span>
                </div>
                <div className="bg-[#F0EBE5] p-1.5 rounded-lg font-mono text-[11px] text-[#2C2C24]">
                  <div>Lat: {pinpointLocation[0].toFixed(5)}°</div>
                  <div>Lon: {normalizeLng(pinpointLocation[1]).toFixed(5)}°</div>
                </div>
                {onMoveFarmHere && (
                  <button
                    type="button"
                    onClick={() => onMoveFarmHere(pinpointLocation[0], normalizeLng(pinpointLocation[1]))}
                    className="w-full mt-1 px-2.5 py-1 bg-[#4A5D43] hover:bg-[#3A4B34] text-white rounded-md text-[10px] font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>🎯 Move Farm Here</span>
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Floating Pointer Realtime Coordinate HUD in Bottom-Left */}
      {hoverCoords && (
        <div className="absolute bottom-3 left-3 z-20 bg-[#FEFEFA]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#DED8CF] shadow-sm text-[11px] font-mono text-[#2C2C24] pointer-events-none flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4A5D43] animate-pulse"></span>
          <span>
            {hoverCoords.lat.toFixed(5)}°N, {normalizeLng(hoverCoords.lon).toFixed(5)}°E
          </span>
        </div>
      )}
    </div>
  );
}
