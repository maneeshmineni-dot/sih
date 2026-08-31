"""
AgriSense AI - Scientific Pipeline Engines Stress Test Suite
Directly saturates WeatherEngine, SoilEngine, and SatelliteEngine with concurrent geospatial workloads across varied agro-ecological zones.
"""

import sys
import asyncio
import time
import statistics
from typing import Dict, Any, List

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from app.services.weather_engine import WeatherEngine
from app.services.soil_engine import SoilEngine
from app.services.satellite_engine import SatelliteEngine

COORDINATE_SAMPLES = [
    {"name": "Nashik (Maharashtra - Grapes/Onions)", "lat": 20.0050, "lon": 73.7850},
    {"name": "Ludhiana (Punjab - Wheat/Paddy)", "lat": 30.9010, "lon": 75.8573},
    {"name": "Nizamabad (Telangana - Turmeric/Cotton)", "lat": 18.6725, "lon": 78.0941},
    {"name": "Jorhat (Assam - Tea/Rice)", "lat": 26.7509, "lon": 94.2037},
    {"name": "Jodhpur (Rajasthan - Arid Pulses/Millet)", "lat": 26.2389, "lon": 73.0243},
    {"name": "Wayanad (Kerala - Coffee/Spices)", "lat": 11.6854, "lon": 76.1320},
    {"name": "Leh (Ladakh - Cold Arid)", "lat": 34.1526, "lon": 77.5771},
    {"name": "Guntur (Andhra Pradesh - Chilli/Tobacco)", "lat": 16.3067, "lon": 80.4365}
]

def compute_stats(latencies: List[float]) -> Dict[str, float]:
    if not latencies:
        return {"min": 0, "mean": 0, "p50": 0, "p95": 0, "max": 0}
    sorted_l = sorted(latencies)
    n = len(sorted_l)
    return {
        "min": round(min(latencies) * 1000, 2),
        "mean": round(statistics.mean(latencies) * 1000, 2),
        "p50": round(sorted_l[int(0.50 * (n - 1))] * 1000, 2),
        "p95": round(sorted_l[int(0.95 * (n - 1))] * 1000, 2),
        "max": round(max(latencies) * 1000, 2)
    }

async def stress_weather_engine(concurrency: int = 16) -> Dict[str, Any]:
    print(f"\n* Stressing WeatherEngine (ECMWF 4-Layer Soil Physics) with {concurrency} concurrent calls...")
    start = time.perf_counter()
    latencies = []
    successes = 0
    errors = []

    sem = asyncio.Semaphore(concurrency)

    async def fetch(sample):
        nonlocal successes
        async with sem:
            t0 = time.perf_counter()
            try:
                data = await WeatherEngine.fetch_agri_weather(sample["lat"], sample["lon"])
                dur = time.perf_counter() - t0
                latencies.append(dur)
                assert "soil_physics" in data["current"], "Missing soil physics"
                assert "soil_moisture_0_7cm_m3_m3" in data["current"]["soil_physics"]
                successes += 1
            except Exception as e:
                dur = time.perf_counter() - t0
                errors.append(f"{sample['name']}: {str(e)}")

    tasks = [fetch(COORDINATE_SAMPLES[i % len(COORDINATE_SAMPLES)]) for i in range(concurrency * 2)]
    await asyncio.gather(*tasks)
    wall_time = time.perf_counter() - start

    stats = compute_stats(latencies)
    print(f"  [OK] WeatherEngine: {successes}/{len(tasks)} success | Wall: {wall_time:.2f}s | Mean Latency: {stats['mean']}ms")
    return {
        "engine": "WeatherEngine",
        "total_calls": len(tasks),
        "successes": successes,
        "errors": errors,
        "wall_time_sec": round(wall_time, 2),
        "latency_stats": stats
    }

async def stress_soil_engine(concurrency: int = 16) -> Dict[str, Any]:
    print(f"\n* Stressing SoilEngine (ISRIC SoilGrids 250m) with {concurrency} concurrent queries...")
    start = time.perf_counter()
    latencies = []
    successes = 0
    errors = []

    sem = asyncio.Semaphore(concurrency)

    async def fetch(sample):
        nonlocal successes
        async with sem:
            t0 = time.perf_counter()
            try:
                data = await SoilEngine.fetch_real_soil_profile(sample["lat"], sample["lon"])
                dur = time.perf_counter() - t0
                latencies.append(dur)
                assert "ph_level" in data, "Missing ph_level"
                assert "organic_carbon_pct" in data, "Missing organic_carbon_pct"
                assert "soil_texture_fraction" in data, "Missing texture"
                successes += 1
            except Exception as e:
                dur = time.perf_counter() - t0
                errors.append(f"{sample['name']}: {str(e)}")

    tasks = [fetch(COORDINATE_SAMPLES[i % len(COORDINATE_SAMPLES)]) for i in range(concurrency * 2)]
    await asyncio.gather(*tasks)
    wall_time = time.perf_counter() - start

    stats = compute_stats(latencies)
    print(f"  [OK] SoilEngine: {successes}/{len(tasks)} success | Wall: {wall_time:.2f}s | Mean Latency: {stats['mean']}ms")
    return {
        "engine": "SoilEngine",
        "total_calls": len(tasks),
        "successes": successes,
        "errors": errors,
        "wall_time_sec": round(wall_time, 2),
        "latency_stats": stats
    }

async def stress_satellite_engine(concurrency: int = 10) -> Dict[str, Any]:
    print(f"\n* Stressing SatelliteEngine (Sentinel-2 NDVI & Tile Processing) with {concurrency} concurrent tiles...")
    start = time.perf_counter()
    latencies = []
    successes = 0
    errors = []

    sem = asyncio.Semaphore(concurrency)

    async def fetch(sample):
        nonlocal successes
        async with sem:
            t0 = time.perf_counter()
            try:
                poly = [
                    [sample["lon"] - 0.002, sample["lat"] - 0.002],
                    [sample["lon"] + 0.002, sample["lat"] - 0.002],
                    [sample["lon"] + 0.002, sample["lat"] + 0.002],
                    [sample["lon"] - 0.002, sample["lat"] + 0.002]
                ]
                data = await SatelliteEngine.fetch_farm_satellite_data(sample["lat"], sample["lon"], poly)
                dur = time.perf_counter() - t0
                latencies.append(dur)
                assert "vegetation_indices" in data
                assert "mean_ndvi" in data["vegetation_indices"]
                assert len(data.get("satellite_image_bytes", b"")) > 100
                successes += 1
            except Exception as e:
                dur = time.perf_counter() - t0
                errors.append(f"{sample['name']}: {str(e)}")

    tasks = [fetch(COORDINATE_SAMPLES[i % len(COORDINATE_SAMPLES)]) for i in range(concurrency * 2)]
    await asyncio.gather(*tasks)
    wall_time = time.perf_counter() - start

    stats = compute_stats(latencies)
    print(f"  [OK] SatelliteEngine: {successes}/{len(tasks)} success | Wall: {wall_time:.2f}s | Mean Latency: {stats['mean']}ms")
    return {
        "engine": "SatelliteEngine",
        "total_calls": len(tasks),
        "successes": successes,
        "errors": errors,
        "wall_time_sec": round(wall_time, 2),
        "latency_stats": stats
    }

async def run_engines_stress_suite() -> Dict[str, Any]:
    print("\n" + "=" * 70)
    print(">> [SUITE 2/5] CORE PIPELINE ENGINES STRESS TEST")
    print("=" * 70)

    weather_res = await stress_weather_engine(concurrency=8)
    soil_res = await stress_soil_engine(concurrency=8)
    sat_res = await stress_satellite_engine(concurrency=6)

    return {
        "suite_name": "Pipeline Engines Stress",
        "weather_engine": weather_res,
        "soil_engine": soil_res,
        "satellite_engine": sat_res
    }

if __name__ == "__main__":
    asyncio.run(run_engines_stress_suite())
