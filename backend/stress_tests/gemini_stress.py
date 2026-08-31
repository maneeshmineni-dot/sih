"""
AgriSense AI - Google Gemini Multimodal & Krishi Mitra AI Stress Test Suite
Evaluates conversational throughput, multi-language prompt reasoning, and structured JSON parsing stability under concurrency.
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

from app.services.gemini_engine import GeminiEngine

CHAT_PROMPTS = [
    {"lang": "en", "msg": "How should I manage zinc deficiency in black clay soil during wheat tillering stage?"},
    {"lang": "hi", "msg": "कपास की फसल में गुलाबी सुंडी (Pink Bollworm) के नियंत्रण के जैविक उपाय क्या हैं?"},
    {"lang": "mr", "msg": "सोयाबीन पिकावर पिवळा मोझॅक रोगाची लक्षणे दिसल्यास कोणती उपाययोजना करावी?"},
    {"lang": "te", "msg": "వరి పైరులో అగ్గి తెగులు నివారణకు ఏ రసాయనాలు వాడాలి?"},
    {"lang": "en", "msg": "Recommend a split-dose NPK fertilizer schedule for 5 acres of drip-irrigated maize."}
]

async def stress_krishi_mitra_chat(concurrency: int = 5) -> Dict[str, Any]:
    print(f"\n* [AI 1/2] Stressing Krishi Mitra Conversational Engine ({concurrency} concurrent multilingual queries)...")
    
    latencies = []
    successes = 0
    errors = []
    replies_summary = []

    sem = asyncio.Semaphore(concurrency)

    async def chat_worker(item):
        nonlocal successes
        async with sem:
            t0 = time.perf_counter()
            try:
                reply = await GeminiEngine.chat_with_krishi_mitra(
                    query=item["msg"],
                    language=item["lang"],
                    farm_context={"farm_name": "Precision Agro Plot", "lat": 20.0050, "lon": 73.7850, "area_acres": 5.0}
                )
                dur = time.perf_counter() - t0
                latencies.append(dur)
                assert isinstance(reply, str) and len(reply.strip()) > 20, "Short/invalid AI reply"
                successes += 1
                replies_summary.append({
                    "lang": item["lang"],
                    "query_snippet": item["msg"][:40] + "...",
                    "reply_len": len(reply),
                    "duration_sec": round(dur, 2)
                })
                print(f"   -> [{item['lang'].upper()}] Query answered in {dur:.2f}s (Reply length: {len(reply)} chars)")
            except Exception as e:
                dur = time.perf_counter() - t0
                errors.append(f"Lang {item['lang']}: {str(e)}")
                print(f"   [ERR] [{item['lang'].upper()}] Failed ({dur:.2f}s): {e}")

    tasks = [chat_worker(item) for item in CHAT_PROMPTS]
    wall_start = time.perf_counter()
    await asyncio.gather(*tasks)
    wall_duration = time.perf_counter() - wall_start

    avg_lat = round(statistics.mean(latencies), 2) if latencies else 0.0

    print(f"  [OK] Krishi Mitra Chat: {successes}/{len(CHAT_PROMPTS)} succeeded in {wall_duration:.2f}s (Avg: {avg_lat}s)")
    return {
        "subtest": "Krishi Mitra Chat Multilingual Stress",
        "total_queries": len(CHAT_PROMPTS),
        "successes": successes,
        "errors": errors,
        "wall_time_sec": round(wall_duration, 2),
        "avg_latency_sec": avg_lat,
        "details": replies_summary
    }

async def stress_multimodal_decision_engine() -> Dict[str, Any]:
    print("\n* [AI 2/2] Stressing Multimodal Gemini Agronomic Reasoning Engine...")

    sample_satellite = {
        "vegetation_indices": {"mean_ndvi": 0.68, "ndwi_moisture_index": 0.32, "vegetation_classification": "Healthy"},
        "satellite_image_bytes": b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"\x00" * 2048,
        "satellite_image_filename": "sat_20.0050_73.7850_z17.jpg"
    }
    sample_weather = {
        "current": {"temperature_celsius": 29.5, "relative_humidity_pct": 58, "soil_physics": {"soil_moisture_0_7cm_m3_m3": 0.28}},
        "agronomic_summary": {"total_predicted_14d_rainfall_mm": 45.0, "soil_moisture_status": "Adequate Moisture"}
    }
    sample_soil = {
        "ph_level": 7.2,
        "organic_carbon_pct": 0.74,
        "nitrogen_status": "Medium",
        "soil_texture_fraction": {"clay_pct": 42, "sand_pct": 28, "silt_pct": 30}
    }

    t0 = time.perf_counter()
    try:
        rec = await GeminiEngine.generate_agronomic_recommendation(
            farm_name="Precision AI Test Farm",
            coordinates={"latitude": 20.0050, "longitude": 73.7850},
            satellite_data=sample_satellite,
            weather_data=sample_weather,
            soil_data=sample_soil,
            crop_history=["2024 Kharif: Cotton", "2024 Rabi: Chickpea"],
            fertilizer_history=["DAP 50kg/acre", "Potash 25kg/acre"],
            farmer_feedback="Observed good water retention and minimal pest pressure in preceding cycle."
        )
        dur = time.perf_counter() - t0

        assert "recommended_crop" in rec
        assert "confidence_score" in rec
        assert "fertilizer_schedule" in rec
        assert len(rec.get("fertilizer_schedule", [])) > 0

        print(f"  [OK] Multimodal Reasoning Generated in {dur:.2f}s:")
        print(f"      Crop: {rec.get('recommended_crop')} ({rec.get('recommended_variety')})")
        print(f"      Confidence: {rec.get('confidence_score')}")
        print(f"      Fertilizer Stages: {len(rec.get('fertilizer_schedule', []))}")
        print(f"      Summary: {rec.get('executive_summary', '')[:120]}...")

        return {
            "subtest": "Gemini Multimodal Reasoning",
            "success": True,
            "duration_sec": round(dur, 2),
            "recommended_crop": rec.get("recommended_crop"),
            "confidence_score": rec.get("confidence_score"),
            "stages_count": len(rec.get("fertilizer_schedule", []))
        }
    except Exception as e:
        dur = time.perf_counter() - t0
        print(f"  [ERR] Multimodal Reasoning Failed ({dur:.2f}s): {e}")
        return {
            "subtest": "Gemini Multimodal Reasoning",
            "success": False,
            "duration_sec": round(dur, 2),
            "error": str(e)
        }

async def run_gemini_stress_suite() -> Dict[str, Any]:
    print("\n" + "=" * 70)
    print(">> [SUITE 5/5] GEMINI AI & MULTIMODAL REASONING STRESS TEST")
    print("=" * 70)

    chat_res = await stress_krishi_mitra_chat(concurrency=3)
    multimodal_res = await stress_multimodal_decision_engine()

    return {
        "suite_name": "Gemini AI & Multimodal Reasoning Stress",
        "chat_stress": chat_res,
        "multimodal_stress": multimodal_res
    }

if __name__ == "__main__":
    asyncio.run(run_gemini_stress_suite())
