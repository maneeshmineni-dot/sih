import httpx
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class WeatherEngine:
    """
    Live real-world Agrometeorological & Soil Physics Engine.
    Queries Open-Meteo ECMWF/GFS scientific models for real volumetric soil moisture,
    soil temperature at 4 profile layers, solar radiation, and FAO-56 Reference Evapotranspiration (ET0).
    """

    OPEN_METEO_API_URL = "https://api.open-meteo.com/v1/forecast"

    @classmethod
    async def fetch_agri_weather(cls, latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Fetch authentic real-time agro-meteorological metrics for the exact GPS coordinate.
        """
        # Normalize longitude into [-180, 180] and clamp latitude to [-90, 90]
        norm_lon = ((((longitude + 180) % 360) + 360) % 360) - 180
        norm_lat = max(-90.0, min(90.0, latitude))

        params = {
            "latitude": norm_lat,
            "longitude": norm_lon,
            "current": [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "precipitation",
                "rain",
                "weather_code",
                "wind_speed_10m",
                "wind_direction_10m",
                "surface_pressure"
            ],
            "hourly": [
                "temperature_2m",
                "relative_humidity_2m",
                "precipitation_probability",
                "precipitation",
                "et0_fao_evapotranspiration",
                "vapor_pressure_deficit",
                "soil_temperature_0cm",
                "soil_temperature_6cm",
                "soil_temperature_18cm",
                "soil_temperature_54cm",
                "soil_moisture_0_to_7cm",
                "soil_moisture_7_to_28cm",
                "soil_moisture_28_to_100cm",
                "soil_moisture_100_to_255cm",
                "direct_normal_irradiance"
            ],
            "daily": [
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_sum",
                "precipitation_probability_max",
                "et0_fao_evapotranspiration"
            ],
            "timezone": "auto",
            "forecast_days": 14
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(cls.OPEN_METEO_API_URL, params=params)
            response.raise_for_status()
            raw_data = response.json()

        # Parse current instant metrics from Open-Meteo 'current' object
        cur_obj = raw_data.get("current", {})
        cur_time = cur_obj.get("time", "")
        hourly = raw_data.get("hourly", {})
        times = hourly.get("time", [])

        # Find closest hourly step index to current time
        curr_idx = 0
        if cur_time and times:
            try:
                curr_idx = times.index(cur_time)
            except ValueError:
                curr_idx = 0

        current_metrics = {
            "temperature_celsius": cur_obj.get("temperature_2m", hourly.get("temperature_2m", [25.0])[curr_idx]),
            "apparent_temperature_celsius": cur_obj.get("apparent_temperature", cur_obj.get("temperature_2m", 25.0)),
            "relative_humidity_pct": cur_obj.get("relative_humidity_2m", hourly.get("relative_humidity_2m", [60.0])[curr_idx]),
            "precipitation_prob_pct": hourly.get("precipitation_probability", [0])[curr_idx],
            "precipitation_mm": cur_obj.get("precipitation", hourly.get("precipitation", [0.0])[curr_idx]),
            "wind_speed_kmh": cur_obj.get("wind_speed_10m", 10.0),
            "wind_direction_deg": cur_obj.get("wind_direction_10m", 0),
            "surface_pressure_hpa": cur_obj.get("surface_pressure", 1013.0),
            "weather_code": cur_obj.get("weather_code", 0),
            "et0_evapotranspiration_mm": hourly.get("et0_fao_evapotranspiration", [3.5])[curr_idx],
            "vapor_pressure_deficit_kpa": hourly.get("vapor_pressure_deficit", [1.2])[curr_idx],
            "solar_irradiance_w_m2": hourly.get("direct_normal_irradiance", [450.0])[curr_idx],
            "soil_physics": {
                "soil_temp_surface_c": hourly.get("soil_temperature_0cm", [24.0])[curr_idx],
                "soil_temp_6cm_c": hourly.get("soil_temperature_6cm", [23.5])[curr_idx],
                "soil_temp_18cm_c": hourly.get("soil_temperature_18cm", [22.8])[curr_idx],
                "soil_temp_54cm_c": hourly.get("soil_temperature_54cm", [21.5])[curr_idx],
                "soil_moisture_0_7cm_m3_m3": hourly.get("soil_moisture_0_to_7cm", [0.22])[curr_idx],
                "soil_moisture_7_28cm_m3_m3": hourly.get("soil_moisture_7_to_28cm", [0.25])[curr_idx],
                "soil_moisture_28_100cm_m3_m3": hourly.get("soil_moisture_28_to_100cm", [0.28])[curr_idx],
                "soil_moisture_100_255cm_m3_m3": hourly.get("soil_moisture_100_to_255cm", [0.30])[curr_idx]
            }
        }

        # 14-day aggregated agricultural summary
        daily = raw_data.get("daily", {})
        daily_summary = []
        for i in range(len(daily.get("time", []))):
            daily_summary.append({
                "date": daily["time"][i],
                "temp_max": daily.get("temperature_2m_max", [None])[i],
                "temp_min": daily.get("temperature_2m_min", [None])[i],
                "rain_sum_mm": daily.get("precipitation_sum", [None])[i],
                "rain_probability": daily.get("precipitation_probability_max", [None])[i],
                "et0_fao_mm": daily.get("et0_fao_evapotranspiration", [None])[i]
            })

        total_predicted_rain_mm = sum(d["rain_sum_mm"] or 0 for d in daily_summary)
        avg_et0 = sum(d["et0_fao_mm"] or 0 for d in daily_summary) / max(len(daily_summary), 1)

        return {
            "source": "Open-Meteo ECMWF High-Resolution Real-Time Model",
            "coordinates": {"latitude": latitude, "longitude": longitude},
            "current": current_metrics,
            "forecast_14_days": daily_summary,
            "agronomic_summary": {
                "total_predicted_14d_rainfall_mm": round(total_predicted_rain_mm, 2),
                "average_daily_evapotranspiration_mm": round(avg_et0, 2),
                "soil_moisture_status": cls._classify_soil_moisture(
                    current_metrics.get("soil_physics", {}).get("soil_moisture_0_7cm_m3_m3", 0)
                )
            }
        }

    @staticmethod
    def _classify_soil_moisture(moisture_m3_m3: float) -> str:
        """Classify topsoil moisture level based on volumetric water content."""
        if moisture_m3_m3 < 0.15:
            return "Dry / Critical Water Stress (Immediate Irrigation Needed)"
        elif moisture_m3_m3 < 0.25:
            return "Moderate Moisture (Adequate for mature roots, dry for germination)"
        elif moisture_m3_m3 < 0.40:
            return "Optimal Field Capacity (Ideal vegetative growth conditions)"
        else:
            return "Saturated / Potential Waterlogging Risk (Ensure Drainage)"
