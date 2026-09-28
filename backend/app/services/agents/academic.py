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

    # 1. Embed query
    q_embedding = get_embedding(query)

    # 2. Knowledge Graph Subgraph Traversal
    kg_context = ""
    kg_sources = []
    if db is not None:
        try:
            kg_context, kg_sources = traverse_knowledge_graph(query, q_embedding, db)
        except Exception as e:
            print(f"[Academic Agent] Knowledge Graph traversal warning: {e}")

    # 3. Dense Semantic Vector Search
    vector_context_parts = []
    vector_sources = []
    if db is not None:
        try:
            raw_vector_results = vector_search(q_embedding, db, limit=5)
            for r in raw_vector_results:
                text_content = r.text_content or ""
                description = r.description or ""
                combined = f"{text_content}: {description}" if description else text_content
                if r.type == "research_area":
                    vector_context_parts.append(f"Research Area: {combined}")
                    vector_sources.append({"type": "Research Area", "id": r.id, "title": text_content, "url": "/research"})
                elif r.type == "project":
                    vector_context_parts.append(f"Project: {combined}")
                    vector_sources.append({"type": "Project", "id": r.id, "title": text_content, "url": "/projects"})
                elif r.type == "publication":
                    vector_context_parts.append(f"Publication: {combined}")
                    vector_sources.append({"type": "Publication", "id": r.id, "title": text_content, "url": "/publications"})
                elif r.type == "patent":
                    vector_context_parts.append(f"Patent: {combined}")
                    vector_sources.append({"type": "Patent", "id": r.id, "title": text_content, "url": "/patents"})
        except Exception as e:
            print(f"[Academic Agent] Vector search warning: {e}")

    # Merge and deduplicate sources
    all_sources = []
    seen = set()
    for s in (kg_sources + vector_sources):
        key = (s.get("type"), s.get("id"), s.get("title"))
        if key not in seen:
            seen.add(key)
            all_sources.append(s)

    # Assemble context
    context_sections = []
    if kg_context:
        context_sections.append("=== KNOWLEDGE GRAPH CLUSTERS (CONNECTED ACADEMIC ENTITIES) ===\n" + kg_context)
    if vector_context_parts:
        context_sections.append("=== LAB DATABASE PASSAGES ===\n" + "\n".join(vector_context_parts))

    final_context = "\n\n".join(context_sections) if context_sections else "No specific matching lab records found."

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
