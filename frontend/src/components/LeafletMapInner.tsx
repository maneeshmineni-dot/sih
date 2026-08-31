"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Polygon, 
  Polyline, 
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

// Custom Numbered Corner Pin (Leaflet divIcon)
const createVertexIcon = (index: number, total: number) => {
  const isFirst = index === 0;
  return L.divIcon({
    className: "custom-vertex-icon",
    html: `<div style="
      position: relative;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      touch-action: none;
    ">
      ${total === 1 || (total === 2 && isFirst) ? `
      <div style="
        position: absolute;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(74, 93, 67, 0.35);
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        pointer-events: none;
      "></div>` : ''}
      <div style="
        width: 26px;
        height: 26px;
        background: ${isFirst ? '#385723' : '#4A5D43'};
        color: #FEFEFA;
        border: 2.5px solid #FFFFFF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 800;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        cursor: grab;
        user-select: none;
      ">${index + 1}</div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// Subtle Midpoint '+' Handle Icon for inserting boundary points
const createMidpointIcon = () => {
  return L.divIcon({
    className: "custom-midpoint-icon",
    html: `<div style="
      width: 20px;
      height: 20px;
      background: #C18C5D;
      color: #FFFFFF;
      border: 1.5px solid #FFFFFF;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: bold;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
      opacity: 0.9;
    ">+</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Pinpoint Target Icon with Animated Radar Ping
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
        container.style.cursor = "crosshair";
      }
    }
  }, [isPinpointMode, isDrawing, map]);

  return null;
}

export type MapTileType = "hybrid" | "satellite" | "esri" | "topo" | "street";

interface LeafletMapInnerProps {
  centerLat: number;
  centerLon: number;
  farmName: string;
  points: [number, number][];
  mapType: MapTileType | string;
  areaAcres: number;
  isDrawing?: boolean;
  isPinpointMode?: boolean;
  pinpointLocation?: [number, number] | null;
  onVertexDrag: (index: number, newPos: [number, number]) => void;
  onVertexDelete?: (index: number) => void;
  onInsertMidpoint?: (insertIndex: number, coord: [number, number]) => void;
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
  onVertexDelete,
  onInsertMidpoint,
  onPinpointDrag,
  onMapClick,
  onMoveFarmHere,
}: LeafletMapInnerProps) {
  const [hoverCoords, setHoverCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Compute Midpoints between adjacent vertices for 1-click vertex insertion
  const midpoints = useMemo(() => {
    if (points.length < 3) return [];
    const mids: { index: number; coord: [number, number] }[] = [];
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const midLat = (p1[0] + p2[0]) / 2;
      const midLon = (p1[1] + p2[1]) / 2;
      mids.push({ index: i + 1, coord: [midLat, midLon] });
    }
    return mids;
  }, [points]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[centerLat, normalizeLng(centerLon)]}
        zoom={16}
        minZoom={3}
        maxZoom={21}
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

        {/* 1. Google Hybrid Satellite Tile Layer with Built-in Village & Road Labels */}
        {mapType === "hybrid" || mapType === "satellite" ? (
          <TileLayer
            attribution='Imagery &copy; Google'
            url="https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            maxZoom={22}
            maxNativeZoom={20}
            subdomains={["0", "1", "2", "3"]}
          />
        ) : mapType === "esri" ? (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri World Imagery</a> & Sentinel-2'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={21}
            maxNativeZoom={18}
          />
        ) : mapType === "topo" ? (
          <TileLayer
            attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            maxZoom={18}
            maxNativeZoom={17}
            subdomains={["a", "b", "c"]}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={21}
            maxNativeZoom={19}
            subdomains={["a", "b", "c"]}
          />
        )}

        {/* 2. Boundary Polyline when only 2 points exist */}
        {points.length === 2 && (
          <Polyline
            positions={points}
            pathOptions={{
              color: "#4A5D43",
              weight: 3.5,
              dashArray: "6, 6",
            }}
            eventHandlers={{
              click: (e) => {
                const lat = e.latlng.lat;
                const lon = normalizeLng(e.latlng.lng);
                onMapClick(lat, lon);
              }
            }}
          />
        )}

        {/* 3. Filled Polygon Boundary Overlay when 3+ points exist */}
        {points.length > 2 && (
          <Polygon
            positions={points}
            pathOptions={{
              color: "#4A5D43",
              weight: 3.5,
              fillColor: "#5D7052",
              fillOpacity: 0.35,
              dashArray: "6, 6",
            }}
            eventHandlers={{
              click: (e) => {
                const lat = e.latlng.lat;
                const lon = normalizeLng(e.latlng.lng);
                onMapClick(lat, lon);
              }
            }}
          />
        )}

        {/* 4. Numbered Draggable Corner Markers with Stable Keys */}
        {points.map((pt, idx) => (
          <Marker
            key={`vertex-handle-${idx}`}
            position={pt}
            draggable={true}
            autoPan={false}
            icon={createVertexIcon(idx, points.length)}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
              },
              dragstart: (e) => {
                L.DomEvent.stopPropagation(e);
              },
              drag: (e) => {
                L.DomEvent.stopPropagation(e);
                const marker = e.target;
                const position = marker.getLatLng();
                onVertexDrag(idx, [position.lat, normalizeLng(position.lng)]);
              },
              dragend: (e) => {
                L.DomEvent.stopPropagation(e);
                const marker = e.target;
                const position = marker.getLatLng();
                onVertexDrag(idx, [position.lat, normalizeLng(position.lng)]);
              },
            }}
          >
            <Popup className="custom-popup" closeButton={false}>
              <div className="p-1.5 text-center font-sans space-y-1 min-w-[140px]">
                <span className="font-bold text-xs text-[#2C2C24] block">Corner #{idx + 1}</span>
                <span className="font-mono text-[10px] text-[#78786C] block bg-[#F0EBE5] py-0.5 rounded-sm">
                  {pt[0].toFixed(5)}°N, {normalizeLng(pt[1]).toFixed(5)}°E
                </span>
                <span className="text-[9px] text-[#4A5D43] font-semibold block">
                  ✋ Drag to move this corner
                </span>
                {onVertexDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVertexDelete(idx);
                    }}
                    className="w-full mt-1 px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-[9px] font-bold transition cursor-pointer"
                  >
                    🗑️ Remove Point
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 5. Midpoint '+' Handles to Insert Points Along Edges */}
        {onInsertMidpoint &&
          midpoints.map((mid, mIdx) => (
            <Marker
              key={`midpoint-${mIdx}`}
              position={mid.coord}
              icon={createMidpointIcon()}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  onInsertMidpoint(mid.index, mid.coord);
                },
              }}
            >
              <Popup className="custom-popup" closeButton={false}>
                <div className="p-1 text-center font-sans">
                  <span className="font-bold text-[10px] text-[#2C2C24] block">Click to Add Corner</span>
                  <span className="text-[9px] text-[#C18C5D] font-semibold block">
                    Insert vertex here
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 6. Target Pinpoint Dropper Marker */}
        {pinpointLocation && (
          <Marker
            key="target-pinpoint"
            position={pinpointLocation}
            draggable={true}
            autoPan={false}
            icon={createPinpointIcon()}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
              },
              dragstart: (e) => {
                L.DomEvent.stopPropagation(e);
              },
              drag: (e) => {
                L.DomEvent.stopPropagation(e);
                const marker = e.target;
                const pos = marker.getLatLng();
                if (onPinpointDrag) {
                  onPinpointDrag([pos.lat, normalizeLng(pos.lng)]);
                }
              },
              dragend: (e) => {
                L.DomEvent.stopPropagation(e);
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
                  <span>📍 Target Pinpoint</span>
                </div>
                <div className="bg-[#F0EBE5] p-1.5 rounded-lg font-mono text-[11px] text-[#2C2C24]">
                  <div>Lat: {pinpointLocation[0].toFixed(5)}°</div>
                  <div>Lon: {normalizeLng(pinpointLocation[1]).toFixed(5)}°</div>
                </div>
                {onMoveFarmHere && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveFarmHere(pinpointLocation[0], normalizeLng(pinpointLocation[1]));
                    }}
                    className="w-full mt-1 px-2.5 py-1 bg-[#4A5D43] hover:bg-[#3A4B34] text-white rounded-md text-[10px] font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>🎯 Teleport Map Here</span>
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Floating Pointer Realtime Coordinates HUD in Bottom-Left */}
      {hoverCoords && (
        <div className="absolute bottom-3 left-3 z-20 bg-[#FEFEFA]/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#DED8CF] shadow-sm text-[11px] font-mono text-[#2C2C24] pointer-events-none flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4A5D43] animate-pulse"></span>
          <span>
            {hoverCoords.lat.toFixed(5)}°N, {normalizeLng(hoverCoords.lon).toFixed(5)}°E
          </span>
        </div>
      )}
    </div>
  );
}
