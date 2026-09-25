import re
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional
import requests
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.professor import ScholarMetrics

SCHOLAR_USER_ID = "29NTiIgAAAAJ"
CACHE_TTL_SECONDS = 3600  # 1 hour cache to prevent rate-limiting

# Baseline fallback data in case of remote network failure or Google captcha
BASELINE_SCHOLAR_DATA = {
    "scholar_user_id": SCHOLAR_USER_ID,
    "total_citations": 8044,
    "citations_since_2021": 4923,
    "h_index": 41,
    "h_index_since_2021": 32,
    "i10_index": 184,
    "i10_index_since_2021": 94,
    "citation_history": [
        {"year": "2018", "value": 248, "label": "248"},
        {"year": "2019", "value": 203, "label": "203"},
        {"year": "2020", "value": 351, "label": "351"},
        {"year": "2021", "value": 423, "label": "423"},
        {"year": "2022", "value": 660, "label": "660"},
        {"year": "2023", "value": 862, "label": "862"},
        {"year": "2024", "value": 1097, "label": "1.1K"},
        {"year": "2025", "value": 1265, "label": "1.26K"},
        {"year": "2026", "value": 584, "label": "584"},
    ],
    "all_years_history": [
        {"year": "2000", "value": 33, "label": "33"},
        {"year": "2001", "value": 34, "label": "34"},
        {"year": "2002", "value": 31, "label": "31"},
        {"year": "2003", "value": 26, "label": "26"},
        {"year": "2004", "value": 45, "label": "45"},
        {"year": "2005", "value": 71, "label": "71"},
        {"year": "2006", "value": 94, "label": "94"},
        {"year": "2007", "value": 69, "label": "69"},
        {"year": "2008", "value": 72, "label": "72"},
        {"year": "2009", "value": 118, "label": "118"},
        {"year": "2010", "value": 94, "label": "94"},
        {"year": "2011", "value": 109, "label": "109"},
        {"year": "2012", "value": 124, "label": "124"},
        {"year": "2013", "value": 172, "label": "172"},
        {"year": "2014", "value": 176, "label": "176"},
        {"year": "2015", "value": 200, "label": "200"},
        {"year": "2016", "value": 229, "label": "229"},
        {"year": "2017", "value": 248, "label": "248"},
        {"year": "2018", "value": 248, "label": "248"},
        {"year": "2019", "value": 203, "label": "203"},
        {"year": "2020", "value": 351, "label": "351"},
        {"year": "2021", "value": 423, "label": "423"},
        {"year": "2022", "value": 660, "label": "660"},
        {"year": "2023", "value": 862, "label": "862"},
        {"year": "2024", "value": 1097, "label": "1.1K"},
        {"year": "2025", "value": 1265, "label": "1.26K"},
        {"year": "2026", "value": 584, "label": "584"},
    ],
    "last_synced_at": datetime.now().isoformat(),
    "source": "baseline"
}

_IN_MEMORY_CACHE = {
    "data": None,
    "timestamp": 0
}

def fetch_live_google_scholar(scholar_user_id: str = SCHOLAR_USER_ID) -> Optional[Dict[str, Any]]:
    """
    Directly scrapes Google Scholar citation metrics table and histogram.
    Returns parsed dictionary or None on failure.
    """
    url = f"https://scholar.google.com/citations?user={scholar_user_id}&hl=en"
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }

    try:
        resp = requests.get(url, headers=headers, timeout=12)
        if resp.status_code != 200:
            print(f"[Scholar Scraper] Warning: Received status {resp.status_code} from Google Scholar")
            return None

        html = resp.text
        
        # 1. Parse standard metrics table (Citations, h-index, i10-index)
        stds = re.findall(r'<td[^>]*class=["\']gsc_rsb_std["\'][^>]*>([^<]+)</td>', html)
        if len(stds) < 6:
            print(f"[Scholar Scraper] Incomplete metric cells found: {len(stds)}")
            return None

        total_citations = int(stds[0].replace(",", ""))
        citations_since_2021 = int(stds[1].replace(",", ""))
        h_index = int(stds[2].replace(",", ""))
        h_index_since_2021 = int(stds[3].replace(",", ""))
        i10_index = int(stds[4].replace(",", ""))
        i10_index_since_2021 = int(stds[5].replace(",", ""))

        # 2. Parse year histogram
        years = re.findall(r'<span[^>]*class=["\']gsc_g_t["\'][^>]*>([^<]+)</span>', html)
        vals = re.findall(r'<span[^>]*class=["\']gsc_g_al["\'][^>]*>([^<]+)</span>', html)

        all_years = []
        for y, v in zip(years, vals):
            try:
                iv = int(v.replace(",", ""))
                label = f"{iv/1000:.1f}K" if iv >= 1000 else str(iv)
                all_years.append({
                    "year": y.strip(),
                    "value": iv,
                    "label": label
                })
            except ValueError:
                continue

        # If histogram parsed, filter last 8-9 years for default compact presentation
        recent_years = [item for item in all_years if int(item["year"]) >= 2018]
        if not recent_years and all_years:
            recent_years = all_years[-9:]

        parsed = {
            "scholar_user_id": scholar_user_id,
            "total_citations": total_citations,
            "citations_since_2021": citations_since_2021,
            "h_index": h_index,
            "h_index_since_2021": h_index_since_2021,
            "i10_index": i10_index,
            "i10_index_since_2021": i10_index_since_2021,
            "citation_history": recent_years if recent_years else BASELINE_SCHOLAR_DATA["citation_history"],
            "all_years_history": all_years if all_years else BASELINE_SCHOLAR_DATA["all_years_history"],
            "last_synced_at": datetime.now().isoformat(),
            "source": "live_google_scholar"
        }
        return parsed

    except Exception as e:
        print(f"[Scholar Scraper] Error scraping Google Scholar: {e}")
        return None


def fetch_google_scholar_metrics(user_id: str = SCHOLAR_USER_ID) -> Optional[Dict[str, Any]]:
    """Fetches live Google Scholar metrics for a given user ID."""
    return fetch_live_google_scholar(scholar_user_id=user_id)


def get_cached_scholar_metrics(db: Optional[Session] = None, force_refresh: bool = False) -> Dict[str, Any]:
    """
    Retrieves Google Scholar metrics using a multi-tiered cache hierarchy:
    Tier 1: In-memory cached dictionary (1 hour TTL).
    Tier 2: Remote live scrape from Google Scholar.
    Tier 3: Database persisted record (`scholar_metrics`).
    Tier 4: Verified baseline constant.
    """
    now_ts = time.time()

    # Tier 1: Return memory cache if fresh and not forced
    if not force_refresh and _IN_MEMORY_CACHE["data"] and (now_ts - _IN_MEMORY_CACHE["timestamp"]) < CACHE_TTL_SECONDS:
        return _IN_MEMORY_CACHE["data"]

    # Tier 2: Attempt live fetch
    live_data = fetch_live_google_scholar()
    if live_data:
        _IN_MEMORY_CACHE["data"] = live_data
        _IN_MEMORY_CACHE["timestamp"] = now_ts
        # Persist to DB asynchronously or synchronously
        try:
            _persist_to_db(live_data, db)
        except Exception as e:
            print(f"[Scholar Service] Warning: DB persistence failed: {e}")
        return live_data

    # Tier 3: Fetch last persisted record from DB
    try:
        db_record = _load_from_db(db)
        if db_record:
            _IN_MEMORY_CACHE["data"] = db_record
            _IN_MEMORY_CACHE["timestamp"] = now_ts
            return db_record
    except Exception as e:
        print(f"[Scholar Service] DB load failed: {e}")

    # Tier 4: Fallback to baseline
    _IN_MEMORY_CACHE["data"] = BASELINE_SCHOLAR_DATA
    _IN_MEMORY_CACHE["timestamp"] = now_ts
    return BASELINE_SCHOLAR_DATA


def _persist_to_db(data: Dict[str, Any], db: Optional[Session] = None):
    """Saves or updates the scholar_metrics record in the database."""
    def _save(session: Session):
        record = session.query(ScholarMetrics).filter(
            ScholarMetrics.scholar_user_id == data["scholar_user_id"]
        ).first()

        json_data = json.dumps({
            "citation_history": data.get("citation_history", []),
            "all_years_history": data.get("all_years_history", [])
        })

        if not record:
            record = ScholarMetrics(
                scholar_user_id=data["scholar_user_id"],
                total_citations=data["total_citations"],
                citations_since_2021=data["citations_since_2021"],
                h_index=data["h_index"],
                h_index_since_2021=data["h_index_since_2021"],
                i10_index=data["i10_index"],
                i10_index_since_2021=data["i10_index_since_2021"],
                yearly_data=json_data,
            )
            session.add(record)
        else:
            record.total_citations = data["total_citations"]
            record.citations_since_2021 = data["citations_since_2021"]
            record.h_index = data["h_index"]
            record.h_index_since_2021 = data["h_index_since_2021"]
            record.i10_index = data["i10_index"]
            record.i10_index_since_2021 = data["i10_index_since_2021"]
            record.yearly_data = json_data
            record.last_synced_at = datetime.now()

        session.commit()

    if db is not None:
        _save(db)
    else:
        with SessionLocal() as s:
            _save(s)


def _load_from_db(db: Optional[Session] = None) -> Optional[Dict[str, Any]]:
    """Loads scholar_metrics record from database."""
    def _fetch(session: Session):
        return session.query(ScholarMetrics).filter(
            ScholarMetrics.scholar_user_id == SCHOLAR_USER_ID
        ).first()

    record = None
    if db is not None:
        record = _fetch(db)
    else:
        with SessionLocal() as s:
            record = _fetch(s)

    if not record:
        return None

    yearly = {}
    if record.yearly_data:
        try:
            yearly = json.loads(record.yearly_data)
        except Exception:
            yearly = {}

    return {
        "scholar_user_id": record.scholar_user_id,
        "total_citations": record.total_citations,
        "citations_since_2021": record.citations_since_2021,
        "h_index": record.h_index,
        "h_index_since_2021": record.h_index_since_2021,
        "i10_index": record.i10_index,
        "i10_index_since_2021": record.i10_index_since_2021,
        "citation_history": yearly.get("citation_history", BASELINE_SCHOLAR_DATA["citation_history"]),
        "all_years_history": yearly.get("all_years_history", BASELINE_SCHOLAR_DATA["all_years_history"]),
        "last_synced_at": record.last_synced_at.isoformat() if record.last_synced_at else datetime.now().isoformat(),
        "source": "database_cache"
    }
