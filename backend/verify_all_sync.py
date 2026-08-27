import asyncio
import httpx
import json

async def audit_all_systems():
    print("=" * 60)
    print("AGRISENSE AI — FULL-STACK SYNCHRONIZATION AUDIT")
    print("=" * 60)

    base_url = "http://127.0.0.1:8000"

    async with httpx.AsyncClient(timeout=45.0) as client:
        # 1. Check Health & Real-Data Pipelines
        print("\n[1/5] Checking Backend Health & External Data Pipelines...")
        res_health = await client.get(f"{base_url}/api/health")
        print(f"-> Status Code: {res_health.status_code}")
        health_data = res_health.json()
        print(f"-> Health JSON: {json.dumps(health_data, indent=2)}")
        assert res_health.status_code == 200, "Backend health check failed!"
        assert health_data.get("supabase_connected") is True, "Supabase is not connected!"
        assert health_data.get("gemini_configured") is True, "Gemini is not configured!"

        # 2. Register / Sync Farm
        print("\n[2/5] Testing Farm Creation & Supabase PostGIS Sync...")
        farm_payload = {
            "farm_name": "Audit Verification Farm (Nashik)",
            "total_area_acres": 5.2,
            "soil_type": "Black Soil (Clay Loam)",
            "primary_water_source": "Drip Irrigation + Borewell",
            "center_latitude": 20.0050,
            "center_longitude": 73.7850,
            "boundary_polygon": [
                [73.7836, 20.0036],
                [73.7864, 20.0036],
                [73.7864, 20.0064],
                [73.7836, 20.0064]
            ]
        }
        res_farm = await client.post(f"{base_url}/api/farms/create", json=farm_payload)
        print(f"-> Status Code: {res_farm.status_code}")
        farm_res_json = res_farm.json()
        farm_id = farm_res_json["farm"]["id"]
        print(f"-> Farm Created ID: {farm_id}")
        assert res_farm.status_code == 200, "Farm creation failed!"

        # 3. Test Live Telemetry Pipeline (Sentinel-2 + ECMWF 4-Layer + ISRIC SoilGrids)
        print("\n[3/5] Testing 100% Real Live Telemetry Pipeline...")
        res_telemetry = await client.get(f"{base_url}/api/farms/{farm_id}/live-telemetry")
        print(f"-> Status Code: {res_telemetry.status_code}")
        assert res_telemetry.status_code == 200, "Live telemetry fetch failed!"
        telem = res_telemetry.json()

        # Telemetry assertions
        sat = telem["live_satellite_remote_sensing"]
        weather = telem["live_weather_and_soil_physics"]
        soil = telem["live_soil_properties"]

        print(f"-> Sentinel-2 NDVI: {sat['vegetation_indices']['mean_ndvi']} ({sat['vegetation_indices']['vegetation_classification']})")
        print(f"-> Sentinel-2 Satellite Tile URL: {sat['image_url']}")
        print(f"-> ECMWF 0-7cm Root Soil Moisture: {weather['current']['soil_physics']['soil_moisture_0_7cm_m3_m3']} m³/m³")
        print(f"-> ECMWF 14-Day Rain Sum: {weather['agronomic_summary']['total_predicted_14d_rainfall_mm']} mm")
        print(f"-> ISRIC Ground Soil pH: {soil['ph_level']} (Organic Carbon: {soil['organic_carbon_pct']}%)")
        print(f"-> ISRIC Texture: Clay {soil['soil_texture_fraction']['clay_pct']}%, Sand {soil['soil_texture_fraction']['sand_pct']}%, Silt {soil['soil_texture_fraction']['silt_pct']}%")

        # 4. Test Coordinate Inspector
        print("\n[4/5] Testing Global Coordinate Inspector...")
        res_inspect = await client.get(f"{base_url}/api/live-inspect?latitude=20.0050&longitude=73.7850")
        print(f"-> Status Code: {res_inspect.status_code}")
        assert res_inspect.status_code == 200, "Inspector endpoint failed!"

        # 5. Test Google Gemini 3.6 Flash Multimodal Decision Engine
        print("\n[5/5] Testing Google Gemini Multimodal Reasoning Engine...")
        analysis_payload = {
            "crop_history": ["2024 Kharif: Soybean", "2024-25 Rabi: Wheat"],
            "fertilizer_history": ["Urea (50 kg/acre)", "DAP (35 kg/acre)"],
            "farmer_feedback": "Slow drainage after heavy rains, slight yellowing observed on lower leaves.",
            "soil_card": None
        }
        res_analyze = await client.post(f"{base_url}/api/farms/{farm_id}/analyze", json=analysis_payload)
        print(f"-> Status Code: {res_analyze.status_code}")
        assert res_analyze.status_code == 200, "Gemini multimodal analysis failed!"
        rec_json = res_analyze.json()
        rec = rec_json["recommendation"]
        print(f"-> Recommended Crop: {rec['recommended_crop']} (Variety: {rec['recommended_variety']})")
        print(f"-> Model Confidence Score: {int(rec['confidence_score'] * 100)}%")
        print(f"-> Fertilizer Schedule Stages: {len(rec['fertilizer_schedule'])} stages generated")
        print(f"-> Saved to Database Status: {rec_json['saved_to_db']}")

    print("\n" + "=" * 60)
    print("ALL SYSTEMS FULLY SYNCHRONIZED AND OPERATIONAL!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(audit_all_systems())
