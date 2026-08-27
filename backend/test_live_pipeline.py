import asyncio
import json
from app.services.weather_engine import WeatherEngine
from app.services.soil_engine import SoilEngine
from app.services.satellite_engine import SatelliteEngine
from app.services.gemini_engine import GeminiEngine

async def run_live_test():
    # Test coordinates: Nashik, Maharashtra (Famous Agricultural Region)
    lat, lon = 20.0050, 73.7850
    print(f"=== TESTING 100% REAL DATA PIPELINE AT LAT: {lat}, LON: {lon} ===")
    
    # 1. Test Live Weather & Soil Physics (Open-Meteo ECMWF)
    print("\n[1/4] Fetching Live Open-Meteo ECMWF Agrometeorology & Soil Physics...")
    weather = await WeatherEngine.fetch_agri_weather(lat, lon)
    print(f"  -> Ambient Temp: {weather['current']['temperature_celsius']} °C")
    print(f"  -> Topsoil Moisture (0-7cm): {weather['current']['soil_physics']['soil_moisture_0_7cm_m3_m3']} m3/m3")
    print(f"  -> Deep Soil Moisture (28-100cm): {weather['current']['soil_physics']['soil_moisture_28_100cm_m3_m3']} m3/m3")
    print(f"  -> 14-Day Predicted Rainfall: {weather['agronomic_summary']['total_predicted_14d_rainfall_mm']} mm")
    print(f"  -> Soil Status: {weather['agronomic_summary']['soil_moisture_status']}")

    # 2. Test Live ISRIC SoilGrids 250m Global Soil Data
    print("\n[2/4] Fetching Live ISRIC SoilGrids 250m Real Soil Profile...")
    soil = await SoilEngine.fetch_real_soil_profile(lat, lon)
    print(f"  -> Real Soil pH: {soil['ph_level']}")
    print(f"  -> Real Organic Carbon: {soil['organic_carbon_pct']}%")
    print(f"  -> Real Soil Texture: {soil['soil_texture_fraction']}")

    # 3. Test Live Satellite Imagery & Spectral Reflectance (Sentinel-2 / Earth Observation)
    print("\n[3/4] Fetching Live Satellite Image Tile & Computing Spectral NDVI...")
    satellite = await SatelliteEngine.fetch_farm_satellite_data(lat, lon)
    print(f"  -> Saved Tile: {satellite['satellite_image_filename']}")
    print(f"  -> Mean NDVI: {satellite['vegetation_indices']['mean_ndvi']}")
    print(f"  -> Vegetation Classification: {satellite['vegetation_indices']['vegetation_classification']}")
    print(f"  -> Image buffer size: {len(satellite['satellite_image_bytes'])} bytes")

    # 4. Test Google Gemini Multimodal Reasoning with the User's Key
    print("\n[4/4] Ingesting Satellite Image + Real Telemetry into Google Gemini...")
    rec = await GeminiEngine.generate_agronomic_recommendation(
        farm_name="Nashik Precision Agro Field #1",
        coordinates={"latitude": lat, "longitude": lon},
        satellite_data=satellite,
        weather_data=weather,
        soil_data=soil,
        crop_history=["2024 Kharif: Soybean", "2024-25 Rabi: Wheat", "2025 Kharif: Maize"],
        fertilizer_history=["Urea 50kg/acre", "DAP 35kg/acre"],
        farmer_feedback="Observed slow water infiltration after monsoon showers and slight chlorosis on lower leaves."
    )

    print("\n=== SUCCESS: GEMINI MULTIMODAL RESPONSE RECEIVED ===")
    print(f"Recommended Crop: {rec.get('recommended_crop')} ({rec.get('recommended_variety')})")
    print(f"Target Season: {rec.get('target_season')}")
    print(f"Confidence Score: {rec.get('confidence_score')}")
    print(f"Executive Summary: {rec.get('executive_summary')}")
    print(f"Fertilizer Plan Stages: {len(rec.get('fertilizer_schedule', []))} stages specified.")

if __name__ == "__main__":
    asyncio.run(run_live_test())
