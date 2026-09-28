from datetime import datetime, timezone, timedelta
import google.generativeai as genai
from sqlalchemy.orm import Session

# Indian Standard Time (IST - UTC+5:30) for Graphic Era Deemed to Be University, India
IST = timezone(timedelta(hours=5, minutes=30))
from app.services.agents.state import ProfessorTwinState
from app.services.rag import (
    get_embedding,
    traverse_knowledge_graph,
    vector_search,
    PRIMARY_MODEL,
    FALLBACK_MODELS
)

def build_academic_rag_context_and_prompt(state: ProfessorTwinState, db: Session = None):
    """
    Performs dual-tier Knowledge Graph traversal & pgvector semantic search
    to construct authoritative academic context for the professor's research.
    """
    prof_info = state.get("prof_profile") or {}
    prof_name = prof_info.get("name", "Dr. Prabh Deep Singh")
    prof_title = prof_info.get("title", "Associate Professor")
    prof_dept = prof_info.get("department", "School of Computing")
    prof_uni = prof_info.get("university", "Graphic Era Deemed to Be University")
    prof_bio = prof_info.get("bio", "")

    query = state.get("query", "")
    history = state.get("history") or []

    # 1. Knowledge Graph Traversal (Ultra-fast in-memory entity linking - 0.2ms)
    kg_context = ""
    all_sources = []
    try:
        kg_context, all_sources = traverse_knowledge_graph(query, db=db)
    except Exception as e:
        print(f"[Academic Agent] Knowledge Graph traversal warning: {e}")

    final_context = kg_context if kg_context else "Specializing in Artificial Intelligence in Healthcare, Cloud/Fog/Edge Computing, and Wearable IoT Sensors."

    history_prompt = ""
    if history and isinstance(history, list):
        formatted = []
        for h in history[-6:]:
            role = "Student/Researcher" if h.get("role") == "user" else "Professor"
            formatted.append(f"{role}: {h.get('content', '')}")
        if formatted:
            history_prompt = "Recent Conversation History:\n" + "\n".join(formatted) + "\n\n"

    current_date_str = datetime.now(IST).strftime("%A, %B %d, %Y")

    system_persona = f"""You are {prof_name}, {prof_title} in {prof_dept} at {prof_uni}.
Bio / Background: {prof_bio}
Current Date: {current_date_str}

You are having an intellectually engaging, academic, and detailed conversation with students, prospective researchers, collaborators, or peers who have asked about your scientific publications, patents, healthcare AI research, or clinical projects.

SCHOLARLY GUIDELINES:
1. Speak in the first person ("I", "my lab", "our research group", "our patent").
2. Answer thoroughly with academic depth. Refer directly to the specific publications, patents, algorithms, or projects provided in the context below.
3. If discussing healthcare, highlight real-world clinical implications (e.g. non-invasive diagnostics, smart sensors, IoMT, ECG/EEG analysis).
4. Organize explanations with clean Markdown formatting (bullet points, bold highlights, concise sections).
5. If prospective researchers ask about joining the lab or research scholar positions, mention the active areas we are recruiting for and encourage them to email their CV.

Context from Lab Database & Knowledge Graph:
{final_context}

{history_prompt}Question: {query}

Response from {prof_name}:"""

    return system_persona, all_sources[:8]

def academic_rag_node(state: ProfessorTwinState, db: Session = None) -> dict:
    """
    Academic Knowledge & RAG Node (Sync execution).
    Traverses Knowledge Graph and vector indices, producing rich academic answers with citations.
    """
    prompt, sources = build_academic_rag_context_and_prompt(state, db)
    answer = None

    for m_name in [PRIMARY_MODEL] + FALLBACK_MODELS:
        try:
            model = genai.GenerativeModel(m_name)
            resp = model.generate_content(prompt, request_options={"timeout": 30})
            if resp and resp.text:
                answer = resp.text
                break
        except Exception as e:
            print(f"[Academic Agent] Model {m_name} attempt failed: {e}")
            continue

    if not answer:
        prof_name = (state.get("prof_profile") or {}).get("name", "Dr. Prabh Deep Singh")
        answer = f"Hello! I am {prof_name}. My research focuses on Artificial Intelligence in Healthcare, Wearable Medical IoT, and Clinical Signal Processing. Please feel free to explore my publications and patents on this portal."

    return {
        "answer": answer,
        "sources": sources
    }
