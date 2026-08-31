// Geodesic Polygon Area, Perimeter & Land Measurement Utility for Indian Agriculture

const EARTH_RADIUS = 6378137; // Earth's radius in meters (WGS84)

/**
 * Converts degrees to radians
 */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Calculates distance between two [lat, lng] coordinates in meters (Haversine formula)
 */
export function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const dLat = toRad(coord2[0] - coord1[0]);
  const dLon = toRad(coord2[1] - coord1[1]);
  const lat1 = toRad(coord1[0]);
  const lat2 = toRad(coord2[0]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
}

/**
 * Calculates geodesic area of a spherical polygon in square meters
 * Uses the spherical excess formula for high precision on Earth's ellipsoid
 */
export function calculatePolygonArea(coordinates: [number, number][]): number {
  if (!coordinates || coordinates.length < 3) return 0;

  let area = 0;
  const len = coordinates.length;

  for (let i = 0; i < len; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[(i + 1) % len];

    const lat1 = toRad(p1[0]);
    const lat2 = toRad(p2[0]);
    const dLon = toRad(p2[1] - p1[1]);

    area += dLon * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = (Math.abs(area) * EARTH_RADIUS * EARTH_RADIUS) / 2.0;
  return area;
}

/**
 * Calculates perimeter of polygon or polyline in meters
 */
export function calculatePerimeter(coordinates: [number, number][]): number {
  if (!coordinates || coordinates.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    total += calculateDistance(coordinates[i], coordinates[i + 1]);
  }
  // If polygon (3+ points), add distance from last to first
  if (coordinates.length >= 3) {
    total += calculateDistance(coordinates[coordinates.length - 1], coordinates[0]);
  }
  return Math.round(total);
}

export interface LandUnits {
  sqMeters: number;
  sqFt: number;
  acres: number;
  hectares: number;
  gunthas: number; // 1 Acre = 40 Gunthas (MH, KA, AP, TS)
  bighas: number;  // Standard Pucca Bigha (~1.6 Bigha/acre in North India)
  cents: number;   // 1 Acre = 100 Cents (TN, Kerala, AP)
  biswa: number;   // 1 Bigha = 20 Biswa
}

/**
 * Converts area in square meters to various agricultural units across India
 */
export function convertAreaUnits(sqMeters: number): LandUnits {
  const sqFt = sqMeters * 10.7639;
  const acres = sqMeters / 4046.8564224;
  const hectares = sqMeters / 10000;
  const gunthas = acres * 40;
  const bighas = acres / 0.625;
  const cents = acres * 100;
  const biswa = bighas * 20;

  return {
    sqMeters: Math.round(sqMeters * 100) / 100,
    sqFt: Math.round(sqFt * 10) / 10,
    acres: Math.round(acres * 100) / 100,
    hectares: Math.round(hectares * 100) / 100,
    gunthas: Math.round(gunthas * 10) / 10,
    bighas: Math.round(bighas * 100) / 100,
    cents: Math.round(cents * 10) / 10,
    biswa: Math.round(biswa * 10) / 10,
  };
}

/**
 * Computes polygon centroid [lat, lon]
 */
export function getPolygonCenter(coordinates: [number, number][]): [number, number] {
  if (!coordinates || coordinates.length === 0) return [20.5937, 78.9629];
  const latSum = coordinates.reduce((sum, p) => sum + p[0], 0);
  const lonSum = coordinates.reduce((sum, p) => sum + p[1], 0);
  return [latSum / coordinates.length, lonSum / coordinates.length];
}

/**
 * Formats unit value based on active unit key
 */
export function formatUnitDisplay(units: LandUnits, activeUnit: string): string {
  switch (activeUnit) {
    case 'hectares':
      return `${units.hectares} Ha`;
    case 'gunthas':
      return `${units.gunthas} Gunthas`;
    case 'bighas':
      return `${units.bighas} Bighas`;
    case 'cents':
      return `${units.cents} Cents`;
    case 'biswa':
      return `${units.biswa} Biswa`;
    case 'sqm':
      return `${units.sqMeters.toLocaleString()} m²`;
    case 'sqft':
      return `${units.sqFt.toLocaleString()} sq ft`;
    case 'acres':
    default:
      return `${units.acres} Acres`;
  }
}
