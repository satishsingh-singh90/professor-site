import google.generativeai as genai
from datetime import datetime, timezone, timedelta
from app.core.config import settings
from app.services.agents.state import ProfessorTwinState

from app.services.rag import PRIMARY_MODEL, FALLBACK_MODELS

# Indian Standard Time (IST - UTC+5:30) for Graphic Era Deemed to Be University, India
IST = timezone(timedelta(hours=5, minutes=30))

def get_temporal_context() -> dict:
    """Computes dynamic real-world calendar and clock context in Indian Standard Time (IST)."""
    now = datetime.now(IST)
    today_day = now.strftime("%A")            # e.g., "Monday"
    today_date = now.strftime("%B %d, %Y")     # e.g., "September 28, 2026"
    current_time = now.strftime("%I:%M %p")    # e.g., "10:05 PM"

    tomorrow = now + timedelta(days=1)
    tomorrow_day = tomorrow.strftime("%A")
    tomorrow_date = tomorrow.strftime("%B %d, %Y")

    yesterday = now - timedelta(days=1)
    yesterday_day = yesterday.strftime("%A")
    yesterday_date = yesterday.strftime("%B %d, %Y")

    return {
        "today_day": today_day,
        "today_date": today_date,
        "current_time": current_time,
        "tomorrow_day": tomorrow_day,
        "tomorrow_date": tomorrow_date,
        "yesterday_day": yesterday_day,
        "yesterday_date": yesterday_date,
    }

def build_persona_prompt(state: ProfessorTwinState) -> str:
    """Constructs prompt for Persona & General Communication Agent."""
    prof_info = state.get("prof_profile") or {}
    prof_name = prof_info.get("name", "Dr. Prabh Deep Singh")
    prof_title = prof_info.get("title", "Associate Professor")
    prof_dept = prof_info.get("department", "School of Computing")
    prof_uni = prof_info.get("university", "Graphic Era Deemed to Be University")
    prof_bio = prof_info.get("bio", "Leading researcher in Artificial Intelligence, Healthcare Informatics, and Wearable IoT Sensors.")
    email = prof_info.get("email", "satishsingh.singh101@gmail.com")
    phone = prof_info.get("phone", "7814545199")
    office = prof_info.get("office", "Faculty Cabin #312, CS Block")

    query = state.get("query", "")
    history = state.get("history") or []
    schedule_data = state.get("schedule") or []

    # Calculate real-world calendar context
    temporal = get_temporal_context()
    today_day = temporal["today_day"]
    today_date = temporal["today_date"]
    current_time = temporal["current_time"]
    tomorrow_day = temporal["tomorrow_day"]
    tomorrow_date = temporal["tomorrow_date"]
    yesterday_day = temporal["yesterday_day"]
    yesterday_date = temporal["yesterday_date"]

    history_prompt = ""
    if history and isinstance(history, list):
        formatted = []
        for h in history[-6:]:
            role = "Student/Visitor" if h.get("role") == "user" else "Professor"
            formatted.append(f"{role}: {h.get('content', '')}")
        if formatted:
            history_prompt = "Recent Conversation History:\n" + "\n".join(formatted) + "\n\n"

    is_scheduling = state.get("intent") == "scheduling_meeting" or any(w in query.lower() for w in ["meet", "appointment", "schedule", "timetable", "office hour", "free", "timing", "available"])

    if is_scheduling:
        today_slots = [s for s in schedule_data if s.get("day", "").strip().lower() == today_day.lower()]
        tomorrow_slots = [s for s in schedule_data if s.get("day", "").strip().lower() == tomorrow_day.lower()]

        today_lines = []
        if today_slots:
            for s in today_slots:
                status = "AVAILABLE (Open Office Hours / Student Advising)" if s.get("is_available") else f"BUSY ({s.get('title')})"
                today_lines.append(f"  * {s.get('start')} – {s.get('end')} | {status} | Loc: {s.get('location')}")
            today_text = "\n".join(today_lines)
        else:
            today_text = f"  * No scheduled university lectures or open office hours for {today_day}."

        all_schedule_lines = []
        for s in schedule_data:
            status = "AVAILABLE (Open Office Hours / Student Advising)" if s.get("is_available") else f"BUSY ({s.get('title')})"
            all_schedule_lines.append(f"- {s.get('day')}: {s.get('start')} – {s.get('end')} | {status} | Loc: {s.get('location')}")
        full_table_text = "\n".join(all_schedule_lines) if all_schedule_lines else "No timetable entries loaded."

        schedule_prompt = f"""REAL-WORLD DATE, TIME & CALENDAR CONTEXT:
- TODAY IS DEFINITIVELY: {today_day}, {today_date} (Current Local Time: {current_time})
- TOMORROW IS: {tomorrow_day}, {tomorrow_date}

TODAY'S TIMETABLE ({today_day}):
{today_text}

OFFICIAL WEEKLY TIMETABLE:
{full_table_text}
"""
    else:
        schedule_prompt = f"""REAL-WORLD DATE, TIME & CALENDAR CONTEXT:
- Current Local Time: {today_day}, {today_date}, {current_time} (IST)
"""

    system_prompt = f"""You are {prof_name}, {prof_title} in the {prof_dept} at {prof_uni}.
Bio & Background: {prof_bio}
Office Location: {office}
Official Contact Email: {email}

{schedule_prompt}You are having a warm, friendly, intellectual conversation with a student, prospective researcher, or colleague.

RULES:
1. Speak in the first person ("I", "my lab", "my research").
2. Be welcoming, encouraging, articulate, and concise (1-2 paragraphs).
3. If discussing meetings or timetable, strictly adhere to the real-world date ({today_day}) and open slots provided. Propose discussing topics digitally if not free.

{history_prompt}Visitor: {query}

Response from {prof_name}:"""
    return system_prompt

def persona_node(state: ProfessorTwinState) -> dict:
    """
    Persona & Bio Agent Node (Sync execution).
    Generates response using in-memory profile context without DB/vector queries.
    """
    prompt = build_persona_prompt(state)
    answer = None

    for m_name in [PRIMARY_MODEL] + FALLBACK_MODELS:
        try:
            model = genai.GenerativeModel(m_name)
            resp = model.generate_content(prompt, request_options={"timeout": 10})
            if resp and resp.text:
                answer = resp.text
                break
        except Exception as e:
            print(f"[Persona Agent] Attempt with {m_name} failed: {e}")
            break

    if not answer:
        prof_name = (state.get("prof_profile") or {}).get("name", "Dr. Prabh Deep Singh")
        answer = f"Hello! I am {prof_name}. Welcome to my academic portal. How can I assist you today with research, courses, or collaborations?"

    return {
        "answer": answer,
        "sources": []  # No citations required for general conversation / bio
    }
