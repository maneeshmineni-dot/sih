export interface Farm {
  id: string;
  farm_name: string;
  total_area_acres: number;
  soil_type: string;
  primary_water_source: string;
  center_latitude: number;
  center_longitude: number;
  boundary_polygon?: number[][];
  created_at?: string;
}

export interface SoilPhysics {
  soil_temp_surface_c: number;
  soil_temp_6cm_c: number;
  soil_temp_18cm_c: number;
  soil_temp_54cm_c: number;
  soil_moisture_0_7cm_m3_m3: number;
  soil_moisture_7_28cm_m3_m3: number;
  soil_moisture_28_100cm_m3_m3: number;
  soil_moisture_100_255cm_m3_m3: number;
}

export interface CurrentWeather {
  temperature_celsius: number;
  relative_humidity_pct: number;
  precipitation_prob_pct: number;
  precipitation_mm: number;
  et0_evapotranspiration_mm: number;
  vapor_pressure_deficit_kpa: number;
  solar_irradiance_w_m2: number;
  soil_physics: SoilPhysics;
}

export interface DailyForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  rain_sum_mm: number;
  rain_probability: number;
  et0_fao_mm: number;
}

export interface WeatherTelemetry {
  source: string;
  coordinates: { latitude: number; longitude: number };
  current: CurrentWeather;
  forecast_14_days: DailyForecast[];
  agronomic_summary: {
    total_predicted_14d_rainfall_mm: number;
    average_daily_evapotranspiration_mm: number;
    soil_moisture_status: string;
  };
}

export interface SoilProfile {
  source: string;
  coordinates: { latitude: number; longitude: number };
  ph_level: number;
  organic_carbon_pct: number;
  nitrogen_status: string | number;
  phosphorus_status: string | number;
  potassium_status: string | number;
  electrical_conductivity_ds_m: number;
  soil_texture_fraction: {
    clay_pct: number;
    sand_pct: number;
    silt_pct: number;
  };
  cation_exchange_capacity_cmol_kg: number;
  soil_classification_summary: string;
}

export interface SatelliteTelemetry {
  source: string;
  acquisition_date: string;
  coordinates: {
    center_latitude: number;
    center_longitude: number;
    bounding_box: number[];
  };
  vegetation_indices: {
    mean_ndvi: number;
    ndwi_moisture_index: number;
    vegetation_classification: string;
    canopy_density_pct: number;
  };
  satellite_image_filename: string;
  image_url: string;
  agromonitoring_live_sync: boolean;
}

export interface FertilizerStage {
  stage: string;
  day_offset: number;
  product: string;
  dosage_per_acre: string;
  application_method: string;
  scientific_rationale: string;
}

export interface GeminiRecommendation {
  recommended_crop: string;
  recommended_variety: string;
  target_season: string;
  confidence_score: number;
  expected_yield_range: string;
  executive_summary: string;
  soil_rehabilitation_strategy: {
    primary_deficiency: string;
    amendment_protocol: string;
    organic_matter_restoration: string;
  };
  fertilizer_schedule: FertilizerStage[];
  irrigation_advisory: string;
  pest_and_disease_warning: string;
}

export interface LiveTelemetryResponse {
  farm_id: string;
  farm_name: string;
  coordinates: { latitude: number; longitude: number };
  live_weather_and_soil_physics: WeatherTelemetry;
  live_soil_properties: SoilProfile;
  live_satellite_remote_sensing: SatelliteTelemetry;
}
