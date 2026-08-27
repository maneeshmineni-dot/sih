# 🌱 AgriSense AI
### 100% Real-Data Multimodal Precision Agriculture & Decision Support Engine

AgriSense AI is an agronomic intelligence and farm management platform built for modern precision agriculture. It combines live Sentinel-2 Earth Observation satellite imagery, Open-Meteo ECMWF 4-layer agrometeorological soil physics, ISRIC SoilGrids 250m global soil database, and Google Gemini 3.6 Flash multimodal reasoning to empower farmers with actionable crop advisories, soil amendments, and fertilizer schedules.

---

## 🚀 Key Highlights & Architecture

- **🛰️ Live Satellite Remote Sensing**: Dynamic Sentinel-2 & USGS Earth Observation raster tiles with real-time NDVI & NDWI spectral vigor calculations.
- **🌦️ Agrometeorology & Soil Physics**: Ingestion of ECMWF 4-layer root-zone soil moisture (0-7cm, 7-28cm, 28-100cm, 100-255cm), surface soil temperature, and 14-day rainfall forecasts.
- **🧪 ISRIC SoilGrids 250m & Soil Health Card**: Ground-truth soil chemistry (pH, Organic Carbon %, NPK status, Texture fractions, CEC) merged with physical lab test cards.
- **🤖 Multimodal Google Gemini 3.6 Flash Engine**: Vision-based leaf pathogen diagnostics + satellite raster ingestion generating structured ICAR-grounded schedules.
- **💬 Krishi Mitra Conversational AI**: ICAR-grounded multilingual assistant for crop advice, disease remedies, and irrigation planning.
- **📊 eNAM Mandi Market Intelligence & National Analytics**: Real-time APMC mandi modal rates, MSP benchmarks, and ICAR state-wise yield distributions.
- **⚡ Resilient Offline & Network Detection**: Client-side network status indicator, custom 404 page, loading radar scanner, and global error boundaries.

---

## 📁 Project Structure

```
agrisense-ai/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application & REST endpoints
│   │   ├── config.py                # Environment configuration
│   │   └── services/
│   │       ├── gemini_engine.py     # Google GenAI 3.6 Flash multimodal vision & reasoning
│   │       ├── satellite_engine.py  # Sentinel-2 raster tile fetcher & NDVI calculator
│   │       ├── soil_engine.py       # ISRIC SoilGrids 250m REST integration
│   │       ├── weather_engine.py    # Open-Meteo ECMWF agrometeorology model
│   │       └── db_service.py        # Supabase PostgreSQL / PostGIS & local storage
│   ├── storage/                     # Cached satellite rasters & local JSON store
│   ├── requirements.txt             # Python dependencies
│   ├── supabase_schema.sql          # Supabase PostGIS database schema
│   └── test_live_pipeline.py        # End-to-end verification script
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx             # Main Farm Command Dashboard
    │   │   ├── layout.tsx           # Root layout with NetworkStatusIndicator
    │   │   ├── loading.tsx          # Radar sweep agronomic loader
    │   │   ├── not-found.tsx        # Custom 404 Not Found page
    │   │   └── error.tsx            # Global error boundary
    │   ├── components/              # Telemetry gauges, map drawer, modals, chat
    │   ├── context/                 # Auth & Multilingual Language providers
    │   └── types/                   # TypeScript interfaces
    ├── package.json
    └── tailwind.config.ts
```

---

## 🛠️ Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# Activate venv:
# Windows: .venv\Scripts\activate
# Linux/Mac: source .venv/bin/activate

pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Environment Variables

Create `.env` in `backend/`:
```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=8000
ENVIRONMENT=development
```

Create `.env.local` in `frontend/`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
