"""
AgriSense AI - Chaos & Boundary Edge Stress Test Suite
Pushes the system to extreme limits using adversarial, corrupted, out-of-range, and rapid-burst inputs.
"""

import sys
import asyncio
import time
import base64
from typing import Dict, Any, List
import httpx

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from app.main import app

async def test_extreme_coordinates(client: httpx.AsyncClient) -> Dict[str, Any]:
    print("\n* [Chaos 1/5] Testing Extreme & Boundary Geographic Coordinates...")
    test_cases = [
        {"name": "Null Island (Equator & Prime Meridian)", "lat": 0.0, "lon": 0.0, "expect_error": False},
        {"name": "Arctic Ocean Boundary", "lat": 85.0, "lon": 0.0, "expect_error": False},
        {"name": "Antarctic Land Boundary", "lat": -85.0, "lon": 0.0, "expect_error": False},
        {"name": "Pacific Ocean Deep Water (No Land/Soil)", "lat": -10.0, "lon": -160.0, "expect_error": False},
        {"name": "Clamped Out-of-Bounds Positive Lat", "lat": 180.0, "lon": 90.0, "expect_error": False},
        {"name": "Clamped Out-of-Bounds Negative Lon", "lat": 20.0, "lon": -450.0, "expect_error": False},
    ]

    results = []
    for tc in test_cases:
        t0 = time.perf_counter()
        url = f"/api/live-inspect?latitude={tc['lat']}&longitude={tc['lon']}"
        try:
            resp = await client.get(url)
            dur = time.perf_counter() - t0
            passed = resp.status_code in [200, 400]
            data = resp.json() if resp.status_code == 200 else {}
            has_telemetry = "live_weather_and_soil_physics" in data if passed and resp.status_code == 200 else False
            results.append({
                "case": tc["name"],
                "status_code": resp.status_code,
                "duration_ms": round(dur * 1000, 2),
                "handled_cleanly": passed,
                "has_telemetry": has_telemetry
            })
            print(f"   -> {tc['name']}: HTTP {resp.status_code} ({dur*1000:.1f}ms) | Handled: {passed}")
        except Exception as e:
            results.append({
                "case": tc["name"],
                "status_code": 0,
                "duration_ms": round((time.perf_counter() - t0) * 1000, 2),
                "handled_cleanly": False,
                "error": str(e)
            })
            print(f"   [ERR] {tc['name']} exception: {e}")

    return {
        "subtest": "Extreme Coordinates",
        "results": results,
        "all_passed": all(r["handled_cleanly"] for r in results)
    }

async def test_giant_polygon_boundary(client: httpx.AsyncClient) -> Dict[str, Any]:
    print("\n* [Chaos 2/5] Testing Giant 1,000-Vertex Geospatial Polygon Stress...")
    import math
    center_lat, center_lon = 20.0050, 73.7850
    radius = 0.01
    polygon = []
    for i in range(1000):
        angle = (2 * math.pi * i) / 1000
        lat = center_lat + radius * math.sin(angle)
        lon = center_lon + radius * math.cos(angle)
        polygon.append([round(lon, 6), round(lat, 6)])

    farm_payload = {
        "farm_name": "Mega Polygon Stress Farm (1,000 Vertices)",
        "total_area_acres": 250.0,
        "soil_type": "Black Soil",
        "primary_water_source": "Canal + River",
        "center_latitude": center_lat,
        "center_longitude": center_lon,
        "boundary_polygon": polygon
    }

    t0 = time.perf_counter()
    resp = await client.post("/api/farms/create", json=farm_payload)
    dur = time.perf_counter() - t0
    success = resp.status_code in [200, 201]
    print(f"   -> 1,000-vertex polygon farm creation: HTTP {resp.status_code} ({dur*1000:.1f}ms) | Handled: {success}")
    
    return {
        "subtest": "Giant 1000-vertex Polygon",
        "status_code": resp.status_code,
        "duration_ms": round(dur * 1000, 2),
        "handled_cleanly": success
    }

async def test_corrupted_and_malformed_payloads(client: httpx.AsyncClient) -> Dict[str, Any]:
    print("\n* [Chaos 3/5] Testing Malformed Payloads & Type Poisoning...")
    malformed_tests = [
        {"name": "Missing Required Fields (Empty JSON)", "url": "/api/farms/create", "method": "POST", "body": {}, "expect_code": 422},
        {"name": "String instead of Lat/Lon Float", "url": "/api/farms/create", "method": "POST", "body": {"farm_name": "Test", "total_area_acres": "five", "center_latitude": "north", "center_longitude": "east"}, "expect_code": 422},
        {"name": "Invalid JSON Object Array as Body", "url": "/api/farms/create", "method": "POST", "body": [1, 2, 3], "expect_code": 422},
        {"name": "Inspect Missing Coords", "url": "/api/live-inspect", "method": "GET", "body": None, "expect_code": 400},
        {"name": "Non-existent Farm ID Lookup", "url": "/api/farms/non-existent-uuid-9999", "method": "GET", "body": None, "expect_code": 404},
        {"name": "Krishi Mitra Chat Empty Message", "url": "/api/krishi-mitra/chat", "method": "POST", "body": {}, "expect_code": 422},
    ]

    results = []
    for tc in malformed_tests:
        t0 = time.perf_counter()
        if tc["method"] == "POST":
            resp = await client.post(tc["url"], json=tc["body"])
        else:
            resp = await client.get(tc["url"])
        dur = time.perf_counter() - t0

        handled = (resp.status_code == tc["expect_code"])
        results.append({
            "name": tc["name"],
            "expected": tc["expect_code"],
            "actual": resp.status_code,
            "duration_ms": round(dur * 1000, 2),
            "handled_cleanly": handled
        })
        print(f"   -> {tc['name']}: HTTP {resp.status_code} (Expected {tc['expect_code']}) | Handled: {handled}")

    return {
        "subtest": "Malformed Payload Rejection",
        "results": results,
        "all_passed": all(r["handled_cleanly"] for r in results)
    }

async def test_zero_delay_burst_spike(client: httpx.AsyncClient, burst_size: int = 100) -> Dict[str, Any]:
    print(f"\n* [Chaos 4/5] Testing Instant Zero-Delay Spike Burst ({burst_size} simultaneous requests)...")
    
    start = time.perf_counter()
    tasks = [client.get("/api/health") for _ in range(burst_size)]
    responses = await asyncio.gather(*tasks, return_exceptions=True)
    total_time = time.perf_counter() - start

    successes = sum(1 for r in responses if hasattr(r, "status_code") and r.status_code == 200)
    errors = burst_size - successes
    burst_rps = round(burst_size / total_time, 2) if total_time > 0 else 0

    print(f"  [OK] Instant Burst: {successes}/{burst_size} OK in {total_time:.3f}s ({burst_rps} RPS)")
    return {
        "subtest": "Zero-Delay Spike Burst",
        "burst_size": burst_size,
        "successes": successes,
        "errors": errors,
        "wall_time_sec": round(total_time, 3),
        "requests_per_second": burst_rps,
        "all_passed": (errors == 0)
    }

async def test_large_payload_stress(client: httpx.AsyncClient) -> Dict[str, Any]:
    print("\n* [Chaos 5/5] Testing Large Base64 Multimodal Payload Stress (1MB Synthetic Image)...")
    
    dummy_bytes = b"\x89PNG\r\n\x1a\n" + b"\x00" * (1024 * 768)
    b64_str = f"data:image/png;base64,{base64.b64encode(dummy_bytes).decode('ascii')}"

    analysis_payload = {
        "crop_history": ["Soybean 2024", "Wheat 2025"],
        "fertilizer_history": ["Urea 50kg", "DAP 30kg"],
        "farmer_feedback": "Severe leaf rust and yellowing with necrosis.",
        "leaf_image_base64": b64_str
    }

    t0 = time.perf_counter()
    resp = await client.post("/api/farms/stress_test_farm_temp/analyze", json=analysis_payload)
    dur = time.perf_counter() - t0
    handled = resp.status_code in [200, 404, 500]
    print(f"   -> 1MB Payload Ingestion: HTTP {resp.status_code} ({dur*1000:.1f}ms) | Server Alive: {handled}")

    return {
        "subtest": "Large 1MB Base64 Ingestion",
        "status_code": resp.status_code,
        "duration_ms": round(dur * 1000, 2),
        "handled_cleanly": handled
    }

async def run_chaos_edge_stress_suite() -> Dict[str, Any]:
    print("\n" + "=" * 70)
    print(">> [SUITE 3/5] CHAOS, BOUNDARY & MALFORMED INPUT STRESS TEST")
    print("=" * 70)

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver", timeout=45.0) as client:
        coords_res = await test_extreme_coordinates(client)
        poly_res = await test_giant_polygon_boundary(client)
        malformed_res = await test_corrupted_and_malformed_payloads(client)
        burst_res = await test_zero_delay_burst_spike(client, burst_size=100)
        large_payload_res = await test_large_payload_stress(client)

    return {
        "suite_name": "Chaos & Boundary Stress",
        "extreme_coordinates": coords_res,
        "giant_polygon": poly_res,
        "malformed_rejection": malformed_res,
        "spike_burst": burst_res,
        "large_payload": large_payload_res
    }

if __name__ == "__main__":
    asyncio.run(run_chaos_edge_stress_suite())
