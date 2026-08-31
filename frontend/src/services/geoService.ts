// Live Geolocation Service & Indian Agro-Climatic Zone Mapper for AgriSense AI

// 15 ICAR Agro-Climatic Zones of India
export interface AgroZone {
  id: number;
  name: string;
  states: string[];
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
  majorCrops: string;
}

export const AGRO_CLIMATIC_ZONES: AgroZone[] = [
  { id: 1, name: "Western Himalayan Region", states: ["Jammu & Kashmir", "Himachal Pradesh", "Uttarakhand"], latMin: 29.5, latMax: 37.0, lonMin: 73.0, lonMax: 81.0, majorCrops: "Apple, Walnut, Maize, Saffron, Wheat" },
  { id: 2, name: "Eastern Himalayan Region", states: ["Assam", "Sikkim", "Arunachal Pradesh", "Nagaland", "Meghalaya"], latMin: 22.0, latMax: 29.5, lonMin: 88.0, lonMax: 97.5, majorCrops: "Tea, Rice, Jute, Ginger, Citrus" },
  { id: 3, name: "Lower Gangetic Plains Region", states: ["West Bengal"], latMin: 21.5, latMax: 27.5, lonMin: 85.5, lonMax: 89.8, majorCrops: "Rice, Jute, Mustard, Potato" },
  { id: 4, name: "Middle Gangetic Plains Region", states: ["Bihar", "Eastern Uttar Pradesh"], latMin: 24.0, latMax: 27.5, lonMin: 81.5, lonMax: 88.0, majorCrops: "Rice, Wheat, Sugarcane, Maize, Lentils" },
  { id: 5, name: "Upper Gangetic Plains Region", states: ["Central & Western Uttar Pradesh"], latMin: 25.5, latMax: 30.5, lonMin: 77.0, lonMax: 82.0, majorCrops: "Wheat, Sugarcane, Rice, Mustard, Potato" },
  { id: 6, name: "Trans-Gangetic Plains Region", states: ["Punjab", "Haryana", "Delhi", "Chandigarh"], latMin: 27.5, latMax: 32.5, lonMin: 73.8, lonMax: 77.8, majorCrops: "Wheat, Paddy, Cotton, Sugarcane, Mustard" },
  { id: 7, name: "Eastern Plateau & Hills Region", states: ["Jharkhand", "Odisha", "Chhattisgarh"], latMin: 18.0, latMax: 25.0, lonMin: 81.0, lonMax: 87.5, majorCrops: "Rice, Groundnut, Pulses, Millets, Niger" },
  { id: 8, name: "Central Plateau & Hills Region", states: ["Madhya Pradesh", "Southern UP", "Rajasthan border"], latMin: 21.0, latMax: 26.5, lonMin: 74.0, lonMax: 82.5, majorCrops: "Soybean, Wheat, Chickpea, Cotton, Mustard" },
  { id: 9, name: "Western Plateau & Hills Region", states: ["Maharashtra", "Western MP"], latMin: 15.5, latMax: 22.0, lonMin: 73.0, lonMax: 80.5, majorCrops: "Sugarcane, Cotton, Jowar, Soybean, Grapes, Pomegranate" },
  { id: 10, name: "Southern Plateau & Hills Region", states: ["Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu inland"], latMin: 11.5, latMax: 19.5, lonMin: 74.5, lonMax: 80.0, majorCrops: "Cotton, Maize, Rice, Sunflower, Groundnut, Chillies" },
  { id: 11, name: "East Coast Plains & Hills Region", states: ["Coastal Odisha", "Coastal Andhra", "Coastal TN"], latMin: 8.0, latMax: 21.0, lonMin: 79.5, lonMax: 87.0, majorCrops: "Paddy, Groundnut, Coconut, Tobacco, Black Gram" },
  { id: 12, name: "West Coast Plains & Ghats Region", states: ["Kerala", "Goa", "Coastal Karnataka", "Konkan"], latMin: 8.0, latMax: 19.0, lonMin: 73.5, lonMax: 77.5, majorCrops: "Rice, Spices, Coconut, Cashew, Rubber, Arecanut" },
  { id: 13, name: "Gujarat Plains & Hills Region", states: ["Gujarat", "Dadra & Nagar Haveli"], latMin: 20.0, latMax: 24.8, lonMin: 68.5, lonMax: 74.5, majorCrops: "Cotton, Groundnut, Castor, Cumin, Wheat, Pearl Millet" },
  { id: 14, name: "Western Dry Region", states: ["Rajasthan (Thar Desert)"], latMin: 24.5, latMax: 30.5, lonMin: 69.5, lonMax: 76.0, majorCrops: "Bajra, Guar, Moth Bean, Mustard, Gram" },
  { id: 15, name: "The Islands Region", states: ["Andaman & Nicobar", "Lakshadweep"], latMin: 6.5, latMax: 14.0, lonMin: 71.0, lonMax: 94.0, majorCrops: "Coconut, Arecanut, Cassava, Spices" }
];

export interface IndianPlace {
  name: string;
  displayName: string;
  town: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  tag: string;
}

// Rich Offline Indian Agrarian Database for instant search & preset teleporting
export const INDIAN_AGRICULTURAL_PLACES: IndianPlace[] = [
  { name: "PAU Research Belt, Ludhiana", displayName: "Ludhiana (PAU Research Belt), Punjab", town: "Ludhiana", district: "Ludhiana", state: "Punjab", lat: 30.9010, lon: 75.8573, tag: "Wheat & Paddy Hub" },
  { name: "Bhatinda Cotton & Wheat Mandi", displayName: "Bhatinda Cotton & Wheat Mandi, Punjab", town: "Bhatinda", district: "Bathinda", state: "Punjab", lat: 30.2110, lon: 74.9455, tag: "Malwa Cotton Belt" },
  { name: "CSSRI Soil Research, Karnal", displayName: "Karnal (CSSRI Soil Research), Haryana", town: "Karnal", district: "Karnal", state: "Haryana", lat: 29.6857, lon: 76.9905, tag: "Basmati Rice & Wheat" },
  { name: "Hisar Agricultural University", displayName: "Hisar Agricultural University, Haryana", town: "Hisar", district: "Hisar", state: "Haryana", lat: 29.1492, lon: 75.7217, tag: "Cotton & Oilseeds" },
  { name: "Meerut Sugarcane Belt", displayName: "Meerut Sugarcane Belt, Uttar Pradesh", town: "Meerut", district: "Meerut", state: "Uttar Pradesh", lat: 28.9845, lon: 77.7064, tag: "Sugarcane & Potato" },
  { name: "Varanasi Gangetic Plains", displayName: "Varanasi Gangetic Plains, Uttar Pradesh", town: "Varanasi", district: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lon: 82.9739, tag: "Paddy & Vegetables" },
  { name: "Gorakhpur Agricultural Belt", displayName: "Gorakhpur Agricultural Belt, Uttar Pradesh", town: "Gorakhpur", district: "Gorakhpur", state: "Uttar Pradesh", lat: 26.7606, lon: 83.3732, tag: "Sugarcane & Rice" },
  { name: "Patna / Nalanda Farmlands", displayName: "Patna / Nalanda Farmlands, Bihar", town: "Patna", district: "Patna", state: "Bihar", lat: 25.5941, lon: 85.1376, tag: "Rice, Maize & Pulses" },
  { name: "Indore Malwa Soybean Region", displayName: "Indore Malwa Soybean Region, Madhya Pradesh", town: "Indore", district: "Indore", state: "Madhya Pradesh", lat: 22.7196, lon: 75.8577, tag: "Soybean & Wheat" },
  { name: "Ujjain Agro Belt", displayName: "Ujjain Agro Belt, Madhya Pradesh", town: "Ujjain", district: "Ujjain", state: "Madhya Pradesh", lat: 23.1765, lon: 75.7885, tag: "Soybean & Gram" },
  { name: "Nashik Precision Vineyard Parcel", displayName: "Nashik Precision Vineyard Parcel, Maharashtra", town: "Nashik", district: "Nashik", state: "Maharashtra", lat: 20.0050, lon: 73.7820, tag: "Grapes, Onion & Tomato" },
  { name: "Kolhapur Sugar & Jaggery Region", displayName: "Kolhapur Sugar & Jaggery Region, Maharashtra", town: "Kolhapur", district: "Kolhapur", state: "Maharashtra", lat: 16.7050, lon: 74.2433, tag: "Sugarcane & Black Soil" },
  { name: "Pune / Baramati Sugarcane", displayName: "Pune / Baramati Sugarcane, Maharashtra", town: "Baramati", district: "Pune", state: "Maharashtra", lat: 18.1517, lon: 74.5771, tag: "Sugarcane & Dairy" },
  { name: "Nagpur Orange & Cotton Belt", displayName: "Nagpur Orange & Cotton Belt, Maharashtra", town: "Nagpur", district: "Nagpur", state: "Maharashtra", lat: 21.1458, lon: 79.0882, tag: "Citrus & Cotton" },
  { name: "Warangal Cotton Zone", displayName: "Warangal Cotton Zone, Telangana", town: "Warangal", district: "Warangal", state: "Telangana", lat: 17.9780, lon: 79.5940, tag: "Cotton & Chilli" },
  { name: "Nizamabad Turmeric & Maize Belt", displayName: "Nizamabad Turmeric & Maize Belt, Telangana", town: "Nizamabad", district: "Nizamabad", state: "Telangana", lat: 18.6725, lon: 78.0941, tag: "Turmeric & Maize" },
  { name: "Guntur Chilli Farmlands", displayName: "Guntur Chilli Farmlands, Andhra Pradesh", town: "Guntur", district: "Guntur", state: "Andhra Pradesh", lat: 16.3067, lon: 80.4365, tag: "Mirchi & Tobacco Yard" },
  { name: "East Godavari Delta Paddy", displayName: "East Godavari Delta Paddy Terraces, Andhra Pradesh", town: "Kakinada", district: "East Godavari", state: "Andhra Pradesh", lat: 16.9891, lon: 82.2475, tag: "Paddy & Aquaponics" },
  { name: "Mandya / Mysore Sugarcane Basin", displayName: "Mandya / Mysore Sugarcane Basin, Karnataka", town: "Mandya", district: "Mandya", state: "Karnataka", lat: 12.5230, lon: 76.8970, tag: "Sugar & Mulberry" },
  { name: "Belagavi Sugar & Maize Belt", displayName: "Belagavi Sugar & Maize Belt, Karnataka", town: "Belagavi", district: "Belagavi", state: "Karnataka", lat: 15.8497, lon: 74.4977, tag: "Sugarcane & Vegetables" },
  { name: "Thanjavur Delta Rice Bowl", displayName: "Thanjavur Delta Rice Bowl, Tamil Nadu", town: "Thanjavur", district: "Thanjavur", state: "Tamil Nadu", lat: 10.7870, lon: 79.1378, tag: "Cauvery Paddy Delta" },
  { name: "Coimbatore Precision Agro Hub", displayName: "Coimbatore Precision Agro Hub, Tamil Nadu", town: "Coimbatore", district: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lon: 76.9558, tag: "Cotton, Coconut & Tea" },
  { name: "Rajkot Groundnut & Cotton Belt", displayName: "Rajkot Groundnut & Cotton Belt, Gujarat", town: "Rajkot", district: "Rajkot", state: "Gujarat", lat: 22.3039, lon: 70.8022, tag: "Groundnut & Cotton" },
  { name: "Anand Dairy & Vegetable Hub", displayName: "Anand Dairy & Vegetable Hub, Gujarat", town: "Anand", district: "Anand", state: "Gujarat", lat: 22.5645, lon: 72.9289, tag: "Tobacco & Dairy" },
  { name: "Bardhaman Rice Granary", displayName: "Bardhaman Rice Granary, West Bengal", town: "Bardhaman", district: "Purba Bardhaman", state: "West Bengal", lat: 23.2324, lon: 87.8615, tag: "Paddy Granary of Bengal" },
  { name: "Sri Ganganagar Canal Colony", displayName: "Sri Ganganagar Canal Colony, Rajasthan", town: "Sri Ganganagar", district: "Sri Ganganagar", state: "Rajasthan", lat: 29.9038, lon: 73.8772, tag: "Canal Wheat & Kinnow" },
];

/**
 * Identifies the ICAR Agro-Climatic Zone for any GPS coordinates in India
 */
export function getAgroClimaticZone(lat: number, lon: number): AgroZone {
  for (const zone of AGRO_CLIMATIC_ZONES) {
    if (lat >= zone.latMin && lat <= zone.latMax && lon >= zone.lonMin && lon <= zone.lonMax) {
      return zone;
    }
  }
  // Default to Central Plateau if outside exact bbox
  return AGRO_CLIMATIC_ZONES[7];
}

/**
 * Searches places locally from offline database and queries Nominatim OpenStreetMap
 */
export async function searchAgriculturalLocations(query: string, signal?: AbortSignal): Promise<IndianPlace[]> {
  if (!query || query.trim().length < 2) return [];

  const q = query.toLowerCase().trim();
  const localMatches = INDIAN_AGRICULTURAL_PLACES.filter(
    p =>
      p.name.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q)
  );

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`,
      { signal: signal || AbortSignal.timeout(3000) }
    );
    if (res.ok) {
      const data = await res.json();
      const osmMatches: IndianPlace[] = data.map((item: any) => ({
        name: item.name || item.display_name.split(',')[0],
        displayName: item.display_name,
        town: item.address?.town || item.address?.village || item.address?.city || item.name || '',
        district: item.address?.state_district || item.address?.county || '',
        state: item.address?.state || 'India',
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        tag: 'Geocoded Location'
      }));

      // Merge and deduplicate by proximity
      const combined = [...localMatches];
      for (const osm of osmMatches) {
        if (!combined.some(c => Math.hypot(c.lat - osm.lat, c.lon - osm.lon) < 0.05)) {
          combined.push(osm);
        }
      }
      return combined.slice(0, 7);
    }
  } catch (_) {}

  return localMatches.slice(0, 7);
}
