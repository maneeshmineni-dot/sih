"""
AgriSense AI - Concurrency Stress Test Suite
Evaluates API throughput, latency distribution (P50/P90/P95/P99), and success rates under tiered concurrent worker loads.
"""

import sys
import asyncio
import time
import statistics
from typing import Dict, Any, List
import httpx

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from app.main import app

def calculate_percentiles(latencies: List[float]) -> Dict[str, float]:
    """Computes statistical metrics and percentiles in milliseconds."""
    if not latencies:
        return {"min": 0, "mean": 0, "p50": 0, "p90": 0, "p95": 0, "p99": 0, "max": 0, "stdev": 0}
    
    sorted_lat = sorted(latencies)
    n = len(sorted_lat)
    
    def pct(p: float) -> float:
        idx = max(0, min(n - 1, int(round(p * (n - 1)))))
        return round(sorted_lat[idx] * 1000, 2)

    return {
        "min": round(min(latencies) * 1000, 2),
        "mean": round(statistics.mean(latencies) * 1000, 2),
        "p50": pct(0.50),
        "p90": pct(0.90),
        "p95": pct(0.95),
        "p99": pct(0.99),
        "max": round(max(latencies) * 1000, 2),
        "stdev": round(statistics.stdev(latencies) * 1000, 2) if n > 1 else 0.0
    }

async def run_single_request(client: httpx.AsyncClient, method: str, url: str, json_data: dict = None) -> Dict[str, Any]:
    """Fires a single request and returns duration, status, and error status."""
    start = time.perf_counter()
    try:
        if method == "GET":
            resp = await client.get(url)
        elif method == "POST":
            resp = await client.post(url, json=json_data)
        else:
            resp = await client.request(method, url)
        
        duration = time.perf_counter() - start
        return {
            "status_code": resp.status_code,
            "duration": duration,
            "success": 200 <= resp.status_code < 400,
            "error": None
        }
    except Exception as e:
        duration = time.perf_counter() - start
        return {
            "status_code": 0,
            "duration": duration,
            "success": False,
            "error": str(e)
        }

async def stress_endpoint(
    client: httpx.AsyncClient,
    name: str,
    method: str,
    url: str,
    concurrency: int,
    total_requests: int,
    json_data: dict = None
) -> Dict[str, Any]:
    semaphore = asyncio.Semaphore(concurrency)
    results: List[Dict[str, Any]] = []

    async def worker_task():
        async with semaphore:
            res = await run_single_request(client, method, url, json_data)
            results.append(res)

    wall_start = time.perf_counter()
    tasks = [asyncio.create_task(worker_task()) for _ in range(total_requests)]
    await asyncio.gather(*tasks)
    total_wall_time = time.perf_counter() - wall_start

    successful_requests = sum(1 for r in results if r["success"])
    failed_requests = total_requests - successful_requests
    latencies = [r["duration"] for r in results]
    percentiles = calculate_percentiles(latencies)
    rps = round(total_requests / total_wall_time, 2) if total_wall_time > 0 else 0.0

    return {
        "endpoint_name": name,
        "method": method,
        "url": url,
        "concurrency": concurrency,
        "total_requests": total_requests,
        "successful_requests": successful_requests,
        "failed_requests": failed_requests,
        "success_rate_pct": round((successful_requests / total_requests) * 100, 2),
        "total_wall_time_sec": round(total_wall_time, 3),
        "requests_per_second": rps,
        "latency_ms": percentiles,
        "status_distribution": {
            code: sum(1 for r in results if r["status_code"] == code)
            for code in set(r["status_code"] for r in results)
        }
    }

async def run_concurrency_stress_suite() -> Dict[str, Any]:
    print("\n" + "=" * 70)
    print(">> [SUITE 1/5] API CONCURRENCY & LATENCY LOAD STRESS TEST")
    print("=" * 70)

    test_matrix = [
        ("Health Check", "GET", "/api/health", 50, 250, None),
        ("National Agronomic Analytics", "GET", "/api/national-analytics", 50, 250, None),
        ("Mandi Market Prices (eNAM)", "GET", "/api/mandi-prices?crop=cotton&state=Telangana", 50, 250, None),
        ("Farms Listing", "GET", "/api/farms", 25, 100, None),
        ("High Concurrency Ramp (100 Workers)", "GET", "/api/health", 100, 500, None),
        ("Live Inspection (Parallel Telemetry)", "GET", "/api/live-inspect?latitude=20.0050&longitude=73.7850", 15, 30, None)
    ]

    all_results = []
    transport = httpx.ASGITransport(app=app)

    async with httpx.AsyncClient(transport=transport, base_url="http://testserver", timeout=45.0) as client:
        for name, method, url, concurrency, total_reqs, payload in test_matrix:
            print(f"\n* Stressing: {name} [{method} {url}]")
            print(f"  Concurrency: {concurrency} workers | Total Requests: {total_reqs}")
            
            result = await stress_endpoint(client, name, method, url, concurrency, total_reqs, payload)
            all_results.append(result)

            p = result["latency_ms"]
            print(f"  [OK] Done in {result['total_wall_time_sec']}s | Throughput: {result['requests_per_second']} RPS | Success: {result['success_rate_pct']}%")
            print(f"  [METRICS] Latencies (ms): Min={p['min']} | P50={p['p50']} | P90={p['p90']} | P95={p['p95']} | P99={p['p99']} | Max={p['max']}")

    return {
        "suite_name": "API Concurrency & Latency Stress",
        "results": all_results
    }

if __name__ == "__main__":
    asyncio.run(run_concurrency_stress_suite())
