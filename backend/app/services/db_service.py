import json
import uuid
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime
from ..config import settings

logger = logging.getLogger(__name__)

class DatabaseService:
    """
    Unified Data Persistence Layer.
    Syncs with Supabase PostgreSQL (PostGIS) when credentials are provided,
    and maintains an active local persistence cache to guarantee zero downtime.
    """

    LOCAL_DB_FILE = settings.STORAGE_DIR / "local_database.json"

    @classmethod
    def _init_local_store(cls) -> Dict[str, Any]:
        """Initializes or loads local database store."""
        if not cls.LOCAL_DB_FILE.exists():
            initial_data = {
                "farms": {},
                "soil_health_records": {},
                "crop_history": {},
                "fertilizer_logs": {},
                "farmer_feedback": {},
                "satellite_snapshots": {},
                "ai_recommendations": {}
            }
            cls.LOCAL_DB_FILE.parent.mkdir(parents=True, exist_ok=True)
            with open(cls.LOCAL_DB_FILE, "w", encoding="utf-8") as f:
                json.dump(initial_data, f, indent=2)
            return initial_data
        
        try:
            with open(cls.LOCAL_DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {"farms": {}, "soil_health_records": {}, "crop_history": {}, "fertilizer_logs": {}, "farmer_feedback": {}, "satellite_snapshots": {}, "ai_recommendations": {}}

    @classmethod
    def _save_local_store(cls, data: Dict[str, Any]):
        with open(cls.LOCAL_DB_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    @classmethod
    def get_supabase_client(cls):
        """Returns initialized Supabase client if configured."""
        if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY:
            try:
                from supabase import create_client, Client
                return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
            except Exception as e:
                logger.warning(f"Supabase client initialization warning: {e}")
        return None

    @classmethod
    async def create_farm(cls, farm_data: Dict[str, Any]) -> Dict[str, Any]:
        """Saves a new farm boundary and metadata."""
        farm_id = farm_data.get("id") or str(uuid.uuid4())
        farm_record = {
            "id": farm_id,
            "farm_name": farm_data.get("farm_name", "My Farm Plot"),
            "total_area_acres": farm_data.get("total_area_acres", 5.0),
            "soil_type": farm_data.get("soil_type", "Black Soil / Medium Clay"),
            "primary_water_source": farm_data.get("primary_water_source", "Borewell + Drip"),
            "center_latitude": farm_data.get("center_latitude"),
            "center_longitude": farm_data.get("center_longitude"),
            "boundary_polygon": farm_data.get("boundary_polygon", []),
            "created_at": datetime.utcnow().isoformat()
        }

        # 1. Save locally
        store = cls._init_local_store()
        store["farms"][farm_id] = farm_record
        cls._save_local_store(store)

        # 2. Sync to Supabase if connected
        client = cls.get_supabase_client()
        if client:
            try:
                try:
                    valid_uuid = str(uuid.UUID(farm_id))
                except Exception:
                    valid_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, farm_id))

                client.table("farms").upsert({
                    "id": valid_uuid,
                    "user_id": farm_data.get("user_id", "00000000-0000-0000-0000-000000000000"),
                    "farm_name": farm_record["farm_name"],
                    "total_area_acres": farm_record["total_area_acres"],
                    "soil_type": farm_record["soil_type"],
                    "primary_water_source": farm_record["primary_water_source"],
                    "center_latitude": farm_record["center_latitude"],
                    "center_longitude": farm_record["center_longitude"]
                }).execute()
            except Exception as e:
                logger.warning(f"Supabase sync notice: {e}")

        return farm_record

    @classmethod
    def _to_uuid(cls, id_str: str) -> str:
        """Converts any string farm_id into a stable deterministic UUID for Supabase."""
        try:
            return str(uuid.UUID(id_str))
        except Exception:
            return str(uuid.uuid5(uuid.NAMESPACE_DNS, str(id_str)))

    @classmethod
    async def get_farm(cls, farm_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves farm details by ID (Local -> Supabase -> Default Preset Fallback)."""
        store = cls._init_local_store()
        farm = store.get("farms", {}).get(farm_id)
        if farm:
            return farm

        # Try Supabase if connected
        client = cls.get_supabase_client()
        if client:
            try:
                valid_uuid = cls._to_uuid(farm_id)
                res = client.table("farms").select("*").eq("id", valid_uuid).execute()
                if res.data and len(res.data) > 0:
                    farm_data = res.data[0]
                    # Cache locally
                    store["farms"][farm_id] = farm_data
                    cls._save_local_store(store)
                    return farm_data
            except Exception as e:
                logger.warning(f"Supabase get_farm query note: {e}")

        # Default fallback for initial load (e.g., preset zones)
        default_farm = {
            "id": farm_id,
            "farm_name": "Nashik Precision Agro Field #1",
            "total_area_acres": 4.8,
            "soil_type": "Black Soil (Clay Loam)",
            "primary_water_source": "Drip Irrigation + Borewell",
            "center_latitude": 20.0050,
            "center_longitude": 73.7850,
            "boundary_polygon": [
                [73.7836, 20.0036],
                [73.7864, 20.0036],
                [73.7864, 20.0064],
                [73.7836, 20.0064]
            ],
            "created_at": datetime.utcnow().isoformat()
        }
        store["farms"][farm_id] = default_farm
        cls._save_local_store(store)
        return default_farm

    @classmethod
    async def list_farms(cls) -> List[Dict[str, Any]]:
        """Lists all registered farms."""
        store = cls._init_local_store()
        return list(store.get("farms", {}).values())

    @classmethod
    async def save_recommendation(
        cls, 
        farm_id: str, 
        recommendation: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Saves a generated Gemini multimodal recommendation."""
        rec_id = str(uuid.uuid4())
        rec_record = {
            "id": rec_id,
            "farm_id": farm_id,
            "target_season": recommendation.get("target_season", "Upcoming Season"),
            "recommended_crop": recommendation.get("recommended_crop", ""),
            "recommended_variety": recommendation.get("recommended_variety", ""),
            "confidence_score": recommendation.get("confidence_score", 0.9),
            "summary_rationale": recommendation.get("executive_summary", ""),
            "full_gemini_payload": recommendation,
            "created_at": datetime.utcnow().isoformat()
        }

        store = cls._init_local_store()
        if "ai_recommendations" not in store:
            store["ai_recommendations"] = {}
        store["ai_recommendations"][rec_id] = rec_record
        cls._save_local_store(store)

        client = cls.get_supabase_client()
        if client:
            try:
                valid_farm_uuid = cls._to_uuid(farm_id)
                # Ensure the farm exists in Supabase before foreign key insert
                farm_obj = await cls.get_farm(farm_id)
                if farm_obj:
                    client.table("farms").upsert({
                        "id": valid_farm_uuid,
                        "user_id": farm_obj.get("user_id", "00000000-0000-0000-0000-000000000000"),
                        "farm_name": farm_obj.get("farm_name", "Farm Plot"),
                        "total_area_acres": farm_obj.get("total_area_acres", 5.0),
                        "soil_type": farm_obj.get("soil_type", "Black Soil"),
                        "primary_water_source": farm_obj.get("primary_water_source", "Borewell"),
                        "center_latitude": farm_obj.get("center_latitude", 20.0050),
                        "center_longitude": farm_obj.get("center_longitude", 73.7850)
                    }).execute()

                db_payload = {**rec_record, "farm_id": valid_farm_uuid}
                client.table("ai_recommendations").insert(db_payload).execute()
            except Exception as e:
                logger.warning(f"Supabase recommendation sync: {e}")

        return rec_record

    @classmethod
    async def get_farm_recommendations(cls, farm_id: str) -> List[Dict[str, Any]]:
        """Returns all recommendations for a given farm sorted by date desc."""
        store = cls._init_local_store()
        recs = [
            r for r in store.get("ai_recommendations", {}).values() 
            if r.get("farm_id") == farm_id
        ]
        recs.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return recs
