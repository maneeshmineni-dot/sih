"""
AgriSense AI - Endurance & Memory Leak Stress Test Suite
Fires continuous rapid requests over sustained duration while monitoring RAM usage, memory allocations, and leak metrics.
"""

import sys
import asyncio
import time
import tracemalloc
import gc
from typing import Dict, Any, List
import httpx

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from app.main import app

async def run_endurance_leak_test(duration_seconds: int = 10, concurrency: int = 20) -> Dict[str, Any]:
    print("\n" + "=" * 70)
    print(f">> [SUITE 4/5] SUSTAINED ENDURANCE & RESOURCE LEAK TEST ({duration_seconds}s @ {concurrency} Workers)")
    print("=" * 70)

    gc.collect()
    tracemalloc.start()
    initial_current, initial_peak = tracemalloc.get_traced_memory()
    initial_current_mb = initial_current / (1024 * 1024)

    print(f"   Initial Traced Memory: {initial_current_mb:.2f} MB")

    transport = httpx.ASGITransport(app=app)
    endpoints = [
        "/api/health",
        "/api/national-analytics",
        "/api/mandi-prices?crop=soybean&state=Maharashtra",
        "/api/mandi-prices?crop=cotton&state=Telangana",
        "/api/farms"
    ]

    total_requests = 0
    successful_requests = 0
    failed_requests = 0
    latencies: List[float] = []

    sem = asyncio.Semaphore(concurrency)
    stop_event = asyncio.Event()

    async def worker(worker_id: int, client: httpx.AsyncClient):
        nonlocal total_requests, successful_requests, failed_requests
        ep_idx = worker_id % len(endpoints)

        while not stop_event.is_set():
            async with sem:
                ep = endpoints[ep_idx]
                ep_idx = (ep_idx + 1) % len(endpoints)
                t0 = time.perf_counter()
                try:
                    resp = await client.get(ep)
                    dur = time.perf_counter() - t0
                    latencies.append(dur)
                    total_requests += 1
                    if resp.status_code == 200:
                        successful_requests += 1
                    else:
                        failed_requests += 1
                except Exception:
                    total_requests += 1
                    failed_requests += 1

                await asyncio.sleep(0.001)

    wall_start = time.perf_counter()
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver", timeout=15.0) as client:
        workers = [asyncio.create_task(worker(i, client)) for i in range(concurrency)]

        await asyncio.sleep(duration_seconds)
        stop_event.set()
        await asyncio.gather(*workers)

    wall_duration = time.perf_counter() - wall_start

    mid_current, mid_peak = tracemalloc.get_traced_memory()
    mid_current_mb = mid_current / (1024 * 1024)
    mid_peak_mb = mid_peak / (1024 * 1024)

    gc.collect()
    final_current, final_peak = tracemalloc.get_traced_memory()
    final_current_mb = final_current / (1024 * 1024)
    tracemalloc.stop()

    memory_delta_mb = final_current_mb - initial_current_mb
    rps = round(total_requests / wall_duration, 2) if wall_duration > 0 else 0
    avg_latency_ms = round((sum(latencies) / len(latencies)) * 1000, 2) if latencies else 0

    print(f"\n   [METRICS] Endurance Run Summary:")
    print(f"      Total Requests Processed: {total_requests:,}")
    print(f"      Success Rate: {round((successful_requests/total_requests)*100, 2) if total_requests else 0}% ({successful_requests} OK, {failed_requests} Failed)")
    print(f"      Sustained Throughput: {rps} Requests/Sec")
    print(f"      Mean Latency: {avg_latency_ms} ms")
    print(f"   [MEMORY] Resource Profile:")
    print(f"      Initial Memory:  {initial_current_mb:.2f} MB")
    print(f"      Peak Memory:     {mid_peak_mb:.2f} MB")
    print(f"      Final Memory:    {final_current_mb:.2f} MB (After GC)")
    print(f"      Net Leak Delta:  {memory_delta_mb:+.2f} MB")

    leak_detected = memory_delta_mb > 20.0
    print(f"   Status: {'[OK] NO MEMORY LEAK DETECTED' if not leak_detected else '[WARN] POTENTIAL MEMORY RETENTION'}")

    return {
        "suite_name": "Endurance & Memory Leak Stress",
        "duration_seconds": round(wall_duration, 2),
        "concurrency": concurrency,
        "total_requests": total_requests,
        "successful_requests": successful_requests,
        "failed_requests": failed_requests,
        "throughput_rps": rps,
        "avg_latency_ms": avg_latency_ms,
        "memory_metrics": {
            "initial_mb": round(initial_current_mb, 2),
            "peak_mb": round(mid_peak_mb, 2),
            "final_mb": round(final_current_mb, 2),
            "net_delta_mb": round(memory_delta_mb, 2),
            "leak_detected": leak_detected
        }
    }

if __name__ == "__main__":
    asyncio.run(run_endurance_leak_test())
