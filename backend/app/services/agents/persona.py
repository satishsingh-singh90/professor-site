import google.generativeai as genai
from datetime import datetime, timedelta
from app.core.config import settings
from app.services.agents.state import ProfessorTwinState

from app.services.rag import PRIMARY_MODEL, FALLBACK_MODELS

def get_temporal_context() -> dict:
    """Computes dynamic real-world calendar and clock context for current execution."""
    now = datetime.now()
    today_day = now.strftime("%A")            # e.g., "Saturday"
    today_date = now.strftime("%B %d, %Y")     # e.g., "September 19, 2026"
    current_time = now.strftime("%I:%M %p")    # e.g., "01:35 PM"

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

    # Match today's, tomorrow's, and yesterday's slots
    today_slots = [s for s in schedule_data if s.get("day", "").strip().lower() == today_day.lower()]
    tomorrow_slots = [s for s in schedule_data if s.get("day", "").strip().lower() == tomorrow_day.lower()]

    if today_slots:
        today_lines = []
        for s in today_slots:
            status = "AVAILABLE (Open Office Hours / Student Advising)" if s.get("is_available") else f"BUSY ({s.get('title')})"
            today_lines.append(f"  * {s.get('start')} – {s.get('end')} | {status} | Loc: {s.get('location')}")
        today_text = "\n".join(today_lines)
    else:
        today_text = f"  * No scheduled university lectures or open office hours for {today_day} (Weekend / Non-teaching day)."

    if tomorrow_slots:
        tomorrow_lines = []
        for s in tomorrow_slots:
            status = "AVAILABLE (Open Office Hours / Student Advising)" if s.get("is_available") else f"BUSY ({s.get('title')})"
            tomorrow_lines.append(f"  * {s.get('start')} – {s.get('end')} | {status} | Loc: {s.get('location')}")
        tomorrow_text = "\n".join(tomorrow_lines)
    else:
        tomorrow_text = f"  * No scheduled university lectures or open office hours for {tomorrow_day}."

    all_schedule_lines = []
    for s in schedule_data:
        status = "AVAILABLE (Open Office Hours / Student Advising)" if s.get("is_available") else f"BUSY ({s.get('title')})"
        all_schedule_lines.append(f"- {s.get('day')}: {s.get('start')} – {s.get('end')} | {status} | Loc: {s.get('location')}")
    full_table_text = "\n".join(all_schedule_lines) if all_schedule_lines else "No timetable entries loaded."

    schedule_prompt = f"""REAL-WORLD DATE, TIME & CALENDAR CONTEXT:
- TODAY IS DEFINITIVELY: {today_day}, {today_date} (Current Local Time: {current_time})
- TOMORROW IS: {tomorrow_day}, {tomorrow_date}
- YESTERDAY WAS: {yesterday_day}, {yesterday_date}

TODAY'S TIMETABLE ({today_day}, {today_date}):
{today_text}

TOMORROW'S TIMETABLE ({tomorrow_day}, {tomorrow_date}):
{tomorrow_text}

OFFICIAL WEEKLY TIMETABLE & OFFICE HOURS (ALL DAYS):
{full_table_text}

TEMPORAL GROUNDING RULES:
- When the user asks for "today", "today's timetable", "todays schedule", "are you free today?", or asks what I am doing today:
  You MUST answer based strictly on TODAY ({today_day}, {today_date}). NEVER guess Monday or another day!
- When the user asks for "tomorrow" or "tomorrow's timetable", answer for {tomorrow_day} ({tomorrow_date}).
- When the user asks for "yesterday", answer for {yesterday_day} ({yesterday_date}).
- When the user asks for a named day (e.g. "Monday", "Wednesday"), use that specific day's schedule from the weekly timetable.
- If today is a weekend ({today_day}) or has no scheduled classes, explicitly explain that today is {today_day} and share today's activities or direct them to my upcoming weekday office hours.

"""

    system_prompt = f"""You are {prof_name}, {prof_title} in the {prof_dept} at {prof_uni}.
Bio & Background: {prof_bio}
Office Location: {office}
Official Contact Email: {email}
Official Emergency Contact Number: {phone}

{schedule_prompt}You are having a warm, friendly, intellectual conversation with a student, prospective researcher, or academic colleague visiting your digital portfolio website.

IMPORTANT RULES & GUIDELINES:
1. Speak in the first person ("I", "my lab", "my students").
2. For greetings or general questions: Be welcoming, encouraging, and articulate (1-2 paragraphs).

3. STRICT MEETING, APPOINTMENT & TIMETABLE RULES:
   - Always remember: TODAY IS {today_day}, {today_date}. NEVER say today is Monday unless today is actually Monday!
   - You have an official university timetable (shown above). You MUST NEVER guess, invent, or hallucinate random meeting times or confuse days of the week!
   - If asked for "today's timetable", list today's ({today_day}'s) schedule clearly.
   - When a student asks for a meeting or appointment (e.g., asking for a day, time range, or slot):
     a) Check the timetable for the requested day and time.
     b) IF THERE IS A GENUINE OPEN/AVAILABLE SLOT that fits:
        - Propose ONLY that real open slot and specify your office location ({office}).
     c) IF I AM BUSY OR NOT FREE at the requested time (e.g. in class, lab supervision, or departmental meeting):
        - Explain specifically what I am engaged in (e.g., "On Monday from 2:00 PM to 3:30 PM, I have a scheduled Departmental Research Meeting and cannot meet.").
        - DO NOT leave it at a dead end! Proactively engage in problem-solving conversation:
          "However, as my AI Digital Twin, I have full access to all our research papers, datasets, and lab materials. What specific question, research obstacle, or project topic would you like to discuss? Let's discuss it right now—I may be able to resolve it for you immediately!"
        - IF THE ISSUE CANNOT BE RESOLVED via discussion (e.g., requires physical thesis sign-off, official administrative approval, or is an urgent emergency):
          Advise them to email me at {email} with full details, or call my office contact at {phone} for an urgent/emergency meeting.

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
            resp = model.generate_content(prompt, request_options={"timeout": 30})
            if resp and resp.text:
                answer = resp.text
                break
        except Exception as e:
            print(f"[Persona Agent] Attempt with {m_name} failed: {e}")
            continue

    if not answer:
        prof_name = (state.get("prof_profile") or {}).get("name", "Dr. Prabh Deep Singh")
        answer = f"Hello! I am {prof_name}. Welcome to my academic portal. How can I assist you today with research, courses, or collaborations?"

    return {
        "answer": answer,
        "sources": []  # No citations required for general conversation / bio
    }
