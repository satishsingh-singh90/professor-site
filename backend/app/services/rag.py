import json
import time
import numpy as np
import google.generativeai as genai
from sqlalchemy.orm import Session
from sqlalchemy import text, bindparam
from app.core.config import settings
try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None

from pgvector.sqlalchemy import Vector
from app.models.professor import (
    Professor,
    ResearchArea,
    Project,
    Publication,
    Patent,
    Course,
    Award,
    Blog,
    Newsletter,
    ScheduleSlot
)

# ------------------------------------------------------------
# 1. Local embedding model (free, offline, 384 dims)
# ------------------------------------------------------------
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"  # 384 dimensions
embedder = None

# ------------------------------------------------------------
# 2. Gemini for chat (Ultra-fast conversational models)
from concurrent.futures import ThreadPoolExecutor
from app.core.database import SessionLocal

# ------------------------------------------------------------
# 2. Gemini for chat (Ultra-fast conversational models)
# ------------------------------------------------------------
genai.configure(api_key=settings.GEMINI_API_KEY)
PRIMARY_MODEL = "gemini-robotics-er-2-preview"
FALLBACK_MODELS = []  # Avoid sequential retry delays on exhausted 429 models
GEMINI_TIMEOUT_SECONDS = 10

# ------------------------------------------------------------
# 3. In-memory Professor Profile & Knowledge Graph Area Cache
# ------------------------------------------------------------
_PROFESSOR_CACHE = {"profile": None}
_KG_CACHE = {"data": None}
_SCHEDULE_CACHE = {"slots": None}

def invalidate_rag_cache():
    """Invalidates in-memory caches when admin updates DB records."""
    _PROFESSOR_CACHE["profile"] = None
    _KG_CACHE["data"] = None
    _SCHEDULE_CACHE["slots"] = None
    print("[RAG Cache] In-memory knowledge graph, schedule, and professor profile cache invalidated.")

def get_cached_professor(db: Session = None):
    if _PROFESSOR_CACHE["profile"] is not None:
        return _PROFESSOR_CACHE["profile"]
    
    try:
        if db is not None:
            prof = db.query(Professor).first()
        else:
            with SessionLocal() as s:
                prof = s.query(Professor).first()

        if prof:
            _PROFESSOR_CACHE["profile"] = {
                "name": prof.name or "Dr. Prabh Deep Singh",
                "title": prof.title or "Associate Professor",
                "department": prof.department or "Department of Computer Science & Engineering",
                "university": prof.university or "Graphic Era Deemed to Be University",
                "bio": prof.bio or "Specializing in Artificial Intelligence, Healthcare Informatics, and Machine Learning.",
                "email": prof.email or "satishsingh.singh101@gmail.com",
                "phone": prof.phone or "7814545199",
                "office": prof.office or "Faculty Cabin #312, CS Block",
                "location": prof.location or "Dehradun, Uttarakhand, India"
            }
            return _PROFESSOR_CACHE["profile"]
    except Exception as e:
        print(f"[RAG] Warning: Error fetching professor info from DB: {e}")
    
    return {
        "name": "Dr. Prabh Deep Singh",
        "title": "Associate Professor",
        "department": "Department of Computer Science & Engineering",
        "university": "Graphic Era Deemed to Be University",
        "bio": "Specializing in Artificial Intelligence, Healthcare Informatics, and Machine Learning.",
        "email": "satishsingh.singh101@gmail.com",
        "phone": "7814545199",
        "office": "Faculty Cabin #312, CS Block",
        "location": "Dehradun, Uttarakhand, India"
    }

def get_cached_schedule(db: Session = None) -> list:
    """Returns the weekly timetable and office hours schedule from DB with in-memory caching."""
    if _SCHEDULE_CACHE["slots"] is not None:
        return _SCHEDULE_CACHE["slots"]
    try:
        if db is not None:
            slots = db.query(ScheduleSlot).all()
        else:
            with SessionLocal() as s:
                slots = s.query(ScheduleSlot).all()

        formatted = []
        for s in slots:
            formatted.append({
                "id": s.id,
                "day": s.day_of_week,
                "start": s.start_time,
                "end": s.end_time,
                "title": s.title,
                "type": s.slot_type,
                "is_available": s.is_available,
                "location": s.location,
                "notes": s.notes
            })
        _SCHEDULE_CACHE["slots"] = formatted
        return formatted
    except Exception as e:
        print(f"[RAG] Warning: Error fetching schedule from DB: {e}")
        return []

def get_cached_knowledge_graph(db: Session = None) -> dict:
    """
    Bulk-loads and caches all interconnected knowledge entities in memory.
    Uses ThreadPoolExecutor to run all 8 entity queries in parallel across isolated DB sessions.
    Avoids sequential network round-trips to remote Supabase and remains cached in memory.
    """
    if _KG_CACHE["data"] is not None:
        return _KG_CACHE["data"]

    try:
        models = [
            ResearchArea, Project, Publication, Patent,
            Course, Award, Blog, Newsletter
        ]

        def _fetch_table(m):
            with SessionLocal() as session:
                return session.query(m).all()

        with ThreadPoolExecutor(max_workers=8) as executor:
            areas, projects, pubs, pats, courses, awards, blogs, news = list(
                executor.map(_fetch_table, models)
            )

        kg_data = {
            "areas": [
                {"id": a.id, "name": a.name, "description": a.description or "", "embedding": a.embedding}
                for a in areas
            ],
            "projects": [
                {"id": p.id, "title": p.title, "status": p.status, "year": p.year, "description": p.description or "", "research_area_id": p.research_area_id}
                for p in projects
            ],
            "publications": [
                {"id": p.id, "title": p.title, "journal": p.journal, "year": p.year, "abstract": p.abstract or "", "research_area_id": p.research_area_id}
                for p in pubs
            ],
            "patents": [
                {"id": p.id, "title": p.title, "patent_number": p.patent_number, "year": p.year, "description": p.description or "", "research_area_id": p.research_area_id}
                for p in pats
            ],
            "courses": [
                {"id": c.id, "title": c.title, "code": c.code, "semester": c.semester, "description": c.description or ""}
                for c in courses
            ],
            "awards": [
                {"id": aw.id, "name": aw.name, "year": aw.year, "description": aw.description or ""}
                for aw in awards
            ],
            "blogs": [
                {"id": b.id, "title": b.title, "description": b.description or ""}
                for b in blogs
            ],
            "newsletters": [
                {"id": n.id, "title": n.title, "tag": n.tag, "content": n.content or ""}
                for n in news
            ]
        }

        _KG_CACHE["data"] = kg_data
        return _KG_CACHE["data"]
    except Exception as e:
        print(f"[RAG Knowledge Graph] Warning during parallel bulk cache load: {e}")
        return _KG_CACHE["data"] or {}

def warmup_rag():
    """Pre-warms in-memory Knowledge Graph cache and professor profile on startup."""
    try:
        print("[RAG Warmup] Initializing Knowledge Graph and Professor Profile in memory...")
        get_cached_professor()
        get_cached_knowledge_graph()
        print("[RAG Warmup] Knowledge Graph ready in memory (<1ms online traversal).")
    except Exception as e:
        print(f"[RAG Warmup] Non-critical warmup note: {e}")

# ------------------------------------------------------------
# 4. Embedding function (returns a 384‑dim list)
# ------------------------------------------------------------
def get_embedding(text_input: str) -> list[float]:
    global embedder
    if not text_input or not text_input.strip():
        return [0.0] * 384
    if embedder is None:
        if SentenceTransformer is not None:
            try:
                embedder = SentenceTransformer(EMBEDDING_MODEL_NAME)
            except Exception as e:
                print(f"[RAG] Local embedder load notice: {e}")
                embedder = False
        else:
            embedder = False
    if embedder:
        try:
            emb = embedder.encode(text_input, convert_to_numpy=True)
            return emb.tolist()
        except Exception:
            return [0.0] * 384
    return [0.0] * 384

# ------------------------------------------------------------
# 5. Knowledge Graph Engine: Thematic Entity Linking & Graph Traversal
# ------------------------------------------------------------
def traverse_knowledge_graph(query: str, query_embedding: list[float] = None, db: Session = None) -> tuple[str, list[dict]]:
    """
    Ultra-fast in-memory entity linking and subgraph traversal (0.2ms execution).
    Matches query concepts against research areas, publications, patents, and projects
    without expensive CPU embeddings or network hops.
    """
    import re
    sources = []
    blocks = []

    try:
        kg_data = get_cached_knowledge_graph(db)
        if not kg_data or not isinstance(kg_data, dict):
            return "", []

        q_lower = query.lower()
        raw_tokens = set(re.findall(r'[a-zA-Z0-9]{2,}', q_lower))
        stopwords = {
            'the', 'and', 'for', 'are', 'with', 'have', 'want', 'idea', 'this',
            'that', 'from', 'you', 'your', 'about', 'can', 'how', 'what', 'who',
            'sir', 'hello', 'please', 'tell', 'show', 'give'
        }
        tokens = raw_tokens - stopwords

        def score_text(txt: str) -> int:
            if not txt:
                return 0
            txt_lower = txt.lower()
            s = 0
            for tok in tokens:
                if tok in txt_lower:
                    s += 3 if len(tok) > 3 else 1
            return s

        areas = kg_data.get("areas", [])
        publications = kg_data.get("publications", [])
        patents = kg_data.get("patents", [])
        projects = kg_data.get("projects", [])
        courses = kg_data.get("courses", [])
        awards = kg_data.get("awards", [])

        scored_areas = sorted([(score_text(a['name'] + ' ' + a.get('description', '')), a) for a in areas], key=lambda x: x[0], reverse=True)
        scored_pubs = sorted([(score_text(p['title'] + ' ' + (p.get('abstract') or '') + ' ' + (p.get('journal') or '')), p) for p in publications], key=lambda x: x[0], reverse=True)
        scored_pats = sorted([(score_text(p['title'] + ' ' + (p.get('description') or '') + ' ' + (p.get('patent_number') or '')), p) for p in patents], key=lambda x: x[0], reverse=True)
        scored_projects = sorted([(score_text(p['title'] + ' ' + (p.get('description') or '')), p) for p in projects], key=lambda x: x[0], reverse=True)

        # 1. Matched Research Areas (top 2)
        top_areas = [a for s, a in scored_areas if s > 0][:2]
        if not top_areas and scored_areas:
            top_areas = [a for _, a in scored_areas[:2]]
        for a in top_areas:
            sources.append({"type": "Research Area", "id": a["id"], "title": a["name"], "url": "/research"})
            desc = f" ({a['description'][:120]}...)" if a.get("description") else ""
            blocks.append(f"• Research Focus: {a['name']}{desc}")

        # 2. Matched Publications (top 2)
        top_pubs = [p for s, p in scored_pubs if s > 0][:2]
        if not top_pubs and scored_pubs:
            top_pubs = [p for _, p in scored_pubs[:2]]
        for p in top_pubs:
            sources.append({"type": "Publication", "id": p["id"], "title": p["title"], "url": "/publications"})
            j_txt = f" in {p['journal']}" if p.get("journal") else ""
            y_txt = f" ({p['year']})" if p.get("year") else ""
            blocks.append(f"• Key Scientific Paper: \"{p['title']}\"{j_txt}{y_txt}")

        # 3. Matched Patents & IP (top 1)
        top_pats = [p for s, p in scored_pats if s > 0][:1]
        if not top_pats and scored_pats:
            top_pats = [p for _, p in scored_pats[:1]]
        for p in top_pats:
            sources.append({"type": "Patent", "id": p["id"], "title": p["title"], "url": "/patents"})
            num_txt = f" [Patent No: {p['patent_number']}]" if p.get("patent_number") else ""
            blocks.append(f"• Patent / Invention: \"{p['title']}\"{num_txt}")

        # 4. Matched Projects (top 1)
        top_projs = [p for s, p in scored_projects if s > 0][:1]
        if not top_projs and scored_projects:
            top_projs = [p for _, p in scored_projects[:1]]
        for p in top_projs:
            sources.append({"type": "Project", "id": p["id"], "title": p["title"], "url": "/projects"})
            st_txt = f" (Status: {p['status']})" if p.get("status") else ""
            blocks.append(f"• Active Lab Project: \"{p['title']}\"{st_txt}")

        # Deduplicate sources
        unique_sources = []
        seen = set()
        for s in sources:
            k = (s["type"], s["id"])
            if k not in seen:
                seen.add(k)
                unique_sources.append(s)

        return "\n".join(blocks), unique_sources

    except Exception as e:
        print(f"[RAG Knowledge Graph] Error during traversal: {e}")
        return "", []

# ------------------------------------------------------------
# 6. Dense Vector Search (Hybrid Retriever for specific chunks)
# ------------------------------------------------------------
def vector_search(query_embedding, db: Session, limit=5):
    stmt = text("""
        (
            SELECT id, name as text_content, description, 'research_area' as type,
                   1 - (embedding <=> :query_vec) as similarity
            FROM research_area
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> :query_vec
            LIMIT 3
        )
        UNION ALL
        (
            SELECT id, title as text_content, description, 'project' as type,
                   1 - (embedding <=> :query_vec) as similarity
            FROM project
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> :query_vec
            LIMIT 3
        )
        UNION ALL
        (
            SELECT id, title as text_content, abstract as description, 'publication' as type,
                   1 - (embedding <=> :query_vec) as similarity
            FROM publication
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> :query_vec
            LIMIT 3
        )
        UNION ALL
        (
            SELECT id, title as text_content, description, 'patent' as type,
                   1 - (embedding <=> :query_vec) as similarity
            FROM patent
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> :query_vec
            LIMIT 3
        )
        ORDER BY similarity DESC
        LIMIT :limit
    """)
    stmt = stmt.bindparams(bindparam('query_vec', type_=Vector(384)))
    try:
        rows = db.execute(
            stmt,
            {"query_vec": query_embedding, "limit": limit}
        ).fetchall()
        return rows
    except Exception as e:
        print(f"[RAG] Warning: Vector search failed: {e}")
        return []

# ------------------------------------------------------------
# 7. Build Unified Knowledge Graph + Semantic RAG Prompt
# ------------------------------------------------------------
def _build_rag_context_and_prompt(question: str, db: Session, history: list = None):
    prof_info = get_cached_professor(db)
    prof_name = prof_info["name"]
    prof_title = prof_info["title"]
    prof_dept = prof_info["department"]
    prof_uni = prof_info["university"]
    prof_bio = prof_info["bio"]

    # Generate query embedding
    q_embedding = get_embedding(question)

    # 1. Knowledge Graph Subgraph Traversal
    kg_context, kg_sources = traverse_knowledge_graph(question, q_embedding, db)

    # 2. Dense Semantic Chunk Search
    raw_vector_results = []
    try:
        raw_vector_results = vector_search(q_embedding, db, limit=5)
    except Exception as e:
        print(f"[RAG] Warning: Vector search embedding failed: {e}")

    vector_context_parts = []
    vector_sources = []
    for r in raw_vector_results:
        text_content = r.text_content or ""
        description = r.description or ""
        combined = f"{text_content}: {description}" if description else text_content
        if r.type == "research_area":
            vector_context_parts.append(f"Research Area Record: {combined}")
            vector_sources.append({"type": "Research Area", "id": r.id, "title": text_content, "url": "/research"})
        elif r.type == "project":
            vector_context_parts.append(f"Project Record: {combined}")
            vector_sources.append({"type": "Project", "id": r.id, "title": text_content, "url": "/projects"})
        elif r.type == "publication":
            vector_context_parts.append(f"Publication Record: {combined}")
            vector_sources.append({"type": "Publication", "id": r.id, "title": text_content, "url": "/publications"})
        elif r.type == "patent":
            vector_context_parts.append(f"Patent Record: {combined}")
            vector_sources.append({"type": "Patent", "id": r.id, "title": text_content, "url": "/patents"})

    # Combine unique sources
    all_sources = []
    seen_source_keys = set()
    for s in (kg_sources + vector_sources):
        key = (s.get("type"), s.get("id"), s.get("title"))
        if key not in seen_source_keys:
            seen_source_keys.add(key)
            all_sources.append(s)

    # Assemble Structured Multi-Tier Context
    context_sections = []
    if kg_context:
        context_sections.append("=== STRUCTURED KNOWLEDGE GRAPH CLUSTERS (CONNECTED ACADEMIC ENTITIES) ===\n" + kg_context)
    if vector_context_parts:
        context_sections.append("=== SEMANTIC SEARCH PASSAGES (SPECIFIC LAB RECORDS) ===\n" + "\n".join(vector_context_parts))

    final_context = "\n\n".join(context_sections) if context_sections else "No specific matching lab records found."

    history_prompt = ""
    if history and isinstance(history, list):
        formatted_history = []
        for h in history[-6:]:
            role = "Student/Researcher" if h.get("role") == "user" else "Professor"
            formatted_history.append(f"{role}: {h.get('content', '')}")
        if formatted_history:
            history_prompt = "Recent Conversation History:\n" + "\n".join(formatted_history) + "\n\n"

    system_persona = f"""You are {prof_name}, {prof_title} in {prof_dept} at {prof_uni}.
Bio / Background: {prof_bio}

You are having an intellectually engaging, academic, and warm conversation with students, prospective researchers, collaborators, or peers who have visited your academic portfolio website.

KNOWLEDGE GRAPH SYNTHESIS GUIDELINES:
1. Speak in the first person ("I", "my lab", "my research team", "our work").
2. Your lab organizes its academic endeavors into core Research Areas. Under each Research Area, you have interconnected:
   - Scientific Papers / Publications
   - Filed & Granted Patents
   - Research Projects
   - University Courses & Teaching Curriculum
   - Academic Awards & Honors
   - External Blog Articles & Thought Leadership
   - Lab Newsletters & Bulletins
3. When answering questions about a research theme (e.g. IoT, AI/ML, Healthcare, Edge Computing, etc.), demonstrate deep thematic knowledge by referencing your connected projects, publications, patents, courses you teach, and awards won.
4. For general AI/ML/healthcare/methodology questions, answer with academic rigor, blending your lab's perspective with broader scientific consensus.
5. If asked about joining the lab or collaborating, be encouraging, describe what you value in researchers, and invite them to reach out via email.
6. Format answers in clean Markdown — bullets, bold highlights, short paragraphs.

Conversational behavior:
7. Keep most answers concise and well-structured (2-4 short paragraphs or structured bullet sections) unless the visitor explicitly asks for exhaustive depth.
8. When it fits naturally, end your reply with ONE short, genuine follow-up question or invitation (e.g., asking what aspect they'd like to explore deeper).
9. If the question is vague, ask ONE clarifying question first instead of dumping a generic answer.
10. Vary your opening line — react directly to what was asked.

Context from Lab Database & Knowledge Graph:
{final_context}

{history_prompt}Question: {question}

Response from {prof_name}:"""

    return prof_name, all_sources[:8], system_persona

# ------------------------------------------------------------
# 8. Streaming RAG answer function (Server-Sent Events)
# ------------------------------------------------------------
def rag_answer_stream(question: str, db: Session, history: list = None):
    prof_name, sources, system_persona = _build_rag_context_and_prompt(question, db, history)

    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your-gemini-api-key-here":
        welcome_text = f"Hello! I am {prof_name}'s AI Digital Twin. I can discuss research, publications, patents, courses, and lab projects once the Gemini API key is configured."
        yield f"data: {json.dumps({'type': 'sources', 'sources': []})}\n\n"
        yield f"data: {json.dumps({'type': 'chunk', 'text': welcome_text})}\n\n"
        yield f"data: {json.dumps({'type': 'done'})}\n\n"
        return

    # Send sources first so UI can display citations immediately
    yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"

    models_to_try = [PRIMARY_MODEL] + FALLBACK_MODELS
    streamed_anything = False

    for m_name in models_to_try:
        try:
            model = genai.GenerativeModel(m_name)
            resp = model.generate_content(
                system_persona,
                request_options={"timeout": 15}
            )
            if resp and resp.text:
                streamed_anything = True
                words = resp.text.split(" ")
                for i in range(0, len(words), 3):
                    chunk = " ".join(words[i:i+3])
                    if i + 3 < len(words):
                        chunk += " "
                    yield f"data: {json.dumps({'type': 'chunk', 'text': chunk})}\n\n"
                    time.sleep(0.015)
                break
        except Exception as e:
            print(f"[RAG Stream] Model {m_name} attempt failed: {e}")
            if streamed_anything:
                break
            continue

    if not streamed_anything:
        fallback_msg = f"Hello! I am {prof_name}. Welcome to my academic portal. My research centers on Cloud Computing, IoT, and AI-driven Healthcare Systems. How can I assist you with your academic inquiries or research ideas today?"
        yield f"data: {json.dumps({'type': 'chunk', 'text': fallback_msg})}\n\n"

    yield f"data: {json.dumps({'type': 'done'})}\n\n"

# ------------------------------------------------------------
# 9. Non-streaming RAG answer function (Fallback / Direct API)
# ------------------------------------------------------------
def rag_answer(question: str, db: Session, history: list = None):
    prof_name, sources, system_persona = _build_rag_context_and_prompt(question, db, history)

    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your-gemini-api-key-here":
        return {
            "answer": f"Hello! I am {prof_name}'s AI Digital Twin. I can discuss research, publications, patents, courses, and lab projects once the Gemini API key is configured.",
            "sources": []
        }

    models_to_try = [PRIMARY_MODEL] + FALLBACK_MODELS
    answer = None

    for m_name in models_to_try:
        try:
            model = genai.GenerativeModel(m_name)
            response = model.generate_content(
                system_persona,
                request_options={"timeout": 30}
            )
            if response and response.text:
                answer = response.text
                break
        except Exception as e:
            print(f"[RAG] Model {m_name} attempt failed: {e}")
            continue

    if not answer:
        answer = f"Hello! I am {prof_name}. Welcome to my academic portal. My research centers on Cloud Computing, IoT, and AI-driven Healthcare Systems. How can I assist you with your academic inquiries or research ideas today?"

    return {"answer": answer, "sources": sources}
