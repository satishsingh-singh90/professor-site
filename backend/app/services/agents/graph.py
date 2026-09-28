import json
import re
from typing import Dict, Any, List
from sqlalchemy.orm import Session
import google.generativeai as genai

from langgraph.graph import StateGraph, END
from app.core.config import settings
from app.services.rag import get_cached_professor, get_cached_schedule, PRIMARY_MODEL, FALLBACK_MODELS
from app.services.agents.state import ProfessorTwinState
from app.services.agents.supervisor import supervisor_node
from app.services.agents.persona import persona_node, build_persona_prompt
from app.services.agents.academic import (
    academic_rag_node,
    build_academic_rag_context_and_prompt
)

# -------------------------------------------------------------
# LangGraph Workflow Construction
# -------------------------------------------------------------

def route_intent(state: ProfessorTwinState) -> str:
    """Conditional edge decision function for LangGraph."""
    agent = state.get("active_agent", "persona_agent")
    if agent == "academic_rag_agent":
        return "academic_rag_agent"
    return "persona_agent"

def create_twin_graph(db: Session = None):
    """
    Creates and compiles the Multi-Agent StateGraph.
    db can be optionally closed over or passed via context.
    """
    workflow = StateGraph(ProfessorTwinState)

    # 1. Add Agent Nodes
    workflow.add_node("supervisor", supervisor_node)
    workflow.add_node("persona_agent", persona_node)
    workflow.add_node("academic_rag_agent", lambda state: academic_rag_node(state, db=db))

    # 2. Configure Entry Point & Routing
    workflow.set_entry_point("supervisor")
    
    workflow.add_conditional_edges(
        "supervisor",
        route_intent,
        {
            "persona_agent": "persona_agent",
            "academic_rag_agent": "academic_rag_agent"
        }
    )

    # 3. Terminal Edges
    workflow.add_edge("persona_agent", END)
    workflow.add_edge("academic_rag_agent", END)

    return workflow.compile()


# -------------------------------------------------------------
# Synchronous Chat Invocation (/chat)
# -------------------------------------------------------------
def run_twin_chat(query: str, db: Session, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
    """
    Executes full LangGraph multi-agent flow synchronously.
    Returns: { "answer": str, "sources": list, "intent": str, "active_agent": str }
    """
    prof_profile = get_cached_professor(db)
    
    initial_state: ProfessorTwinState = {
        "query": query,
        "history": history or [],
        "prof_profile": prof_profile,
        "schedule": get_cached_schedule(db),
        "sources": [],
        "messages": []
    }

    compiled_graph = create_twin_graph(db=db)
    final_state = compiled_graph.invoke(initial_state)

    return {
        "answer": final_state.get("answer", ""),
        "response": final_state.get("answer", ""),  # for backwards compatibility with frontend
        "sources": final_state.get("sources", []),
        "intent": final_state.get("intent", "casual_bio"),
        "active_agent": final_state.get("active_agent", "persona_agent")
    }


# -------------------------------------------------------------
# Streaming Token Generator (/chat/stream)
# -------------------------------------------------------------
def stream_twin_chat(query: str, db: Session, history: List[Dict[str, str]] = None):
    """
    Multi-agent streaming generator using Server-Sent Events (SSE).
    1. Runs supervisor triage to route query.
    2. Sends intent & sources immediately to frontend.
    3. Streams tokens from Gemini in real-time.
    """
    prof_profile = get_cached_professor(db)

    # Step 1: Run supervisor triage
    state: ProfessorTwinState = {
        "query": query,
        "history": history or [],
        "prof_profile": prof_profile,
        "schedule": get_cached_schedule(db),
        "sources": []
    }
    triage_result = supervisor_node(state)
    state.update(triage_result)

    active_agent = state.get("active_agent", "persona_agent")

    # Step 2: Prepare prompt and sources depending on routed agent
    if active_agent == "academic_rag_agent":
        prompt, sources = build_academic_rag_context_and_prompt(state, db)
    else:
        prompt = build_persona_prompt(state)
        sources = []

    # Send sources first so UI citation chips render immediately
    yield f"data: {json.dumps({'type': 'sources', 'sources': sources, 'agent': active_agent, 'intent': state.get('intent')})}\n\n"

    # Step 3: Stream tokens from Gemini
    models_to_try = [PRIMARY_MODEL] + FALLBACK_MODELS
    streamed_anything = False

    for m_name in models_to_try:
        try:
            model = genai.GenerativeModel(m_name)
            response = model.generate_content(
                prompt,
                stream=True,
                request_options={"timeout": 30}
            )
            for chunk in response:
                if chunk.text:
                    streamed_anything = True
                    yield f"data: {json.dumps({'type': 'chunk', 'text': chunk.text})}\n\n"
            if streamed_anything:
                break
        except Exception as e:
            print(f"[Agent Stream] Model {m_name} attempt failed: {e}")
            if streamed_anything:
                break
            continue

    if not streamed_anything:
        prof_name = prof_profile.get("name", "Dr. Prabh Deep Singh")
        dept = prof_profile.get("department", "School of Computing")
        uni = prof_profile.get("university", "Graphic Era Deemed to Be University")

        name_match = re.search(r"(?:my name is|i am|i'm)\s+([A-Za-z]+)", query, re.I)
        greeting_name = f" {name_match.group(1).title()}" if name_match else ""

        if state.get("intent") == "scheduling_meeting":
            fallback_msg = f"Hello{greeting_name}! I would be happy to coordinate with you. Please check my weekly timetable on this portal for open advising hours, or email me directly at {prof_profile.get('email', 'prabhdeep.singh@geu.ac.in')} to schedule a slot."
        elif state.get("intent") == "casual_bio":
            fallback_msg = f"Hello{greeting_name}! Welcome to my academic portal. I am {prof_name}, Associate Professor in {dept} at {uni}. My research spans Cloud Computing, IoT, and Artificial Intelligence in Healthcare. How can I assist you with your research ideas, coursework, or academic journey today?"
        else:
            source_titles = [f"• {s['title']} ({s['type']})" for s in sources[:3]] if sources else []
            sources_text = "\n".join(source_titles) if source_titles else "• AI and Edge Computing\n• Smart Healthcare IoT"
            fallback_msg = f"Hello{greeting_name}! I am {prof_name}. Regarding your research inquiry, our lab is actively working on several key projects and publications:\n\n{sources_text}\n\nI would be delighted to hear more about your specific proposal or problem statement. Feel free to share your thoughts or reach out directly!"

        yield f"data: {json.dumps({'type': 'chunk', 'text': fallback_msg})}\n\n"

    yield f"data: {json.dumps({'type': 'done'})}\n\n"
