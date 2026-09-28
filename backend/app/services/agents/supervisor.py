import re
import json
import google.generativeai as genai
from app.core.config import settings
from app.services.agents.state import ProfessorTwinState

# High-frequency fast-path patterns for instant 0ms routing
GREETINGS_PATTERN = re.compile(
    r"\b(hi|hello|hey|greetings|good\s+(morning|afternoon|evening)|how\s+are\s+you|who\s+are\s+you|who\s+is\s+dr|what\s+is\s+your\s+name|nice\s+to\s+meet\s+you|dear\s+sir|respected\s+sir)\b",
    re.IGNORECASE
)

BIO_CONTACT_PATTERN = re.compile(
    r"\b(email|contact|phone|office|room|reach\s+you|get\s+in\s+touch|biography|bio|background|education|degree|qualification|cv|resume|social|linkedin|github)\b",
    re.IGNORECASE
)

RESEARCH_KEYWORD_PATTERN = re.compile(
    r"\b(phd|doctorate|mtech|btech|scholar|scholars|advising|advise|supervision|admissions?|prospective|join|openings?|lab|cse|computer\s+science|paper|papers|publication|publications|patent|patents|project|projects|grant|research|conference|journal|doi|algorithm|model|architecture|dataset|healthcare|sensor|sensors|iot|ecg|eeg|wearable|clinical|medical|deep\s+learning|machine\s+learning|neural)\b",
    re.IGNORECASE
)

MEETING_SCHEDULING_PATTERN = re.compile(
    r"\b(meet|meeting|appointment|schedule|timetable|time\s+table|routine|calendar|office\s+hours?|free\s+(slot|time|hours?)|cabin|timing|visit\s+you|talk\s+in\s+person|come\s+by|slots?|today('s)?\s+(timetable|schedule|routine|plan|classes?|hours?)|tomorrow('s)?\s+(timetable|schedule|routine|plan|classes?|hours?)|yesterday('s)?\s+(timetable|schedule|routine|plan|classes?|hours?)|free\s+(today|tomorrow|yesterday|now)|available\s+(today|tomorrow|yesterday|now))\b",
    re.IGNORECASE
)

def supervisor_node(state: ProfessorTwinState) -> dict:
    """
    Supervisor / Triage Orchestrator Node.
    Decides whether query requires the Persona Agent or Academic RAG Agent.
    """
    query = state.get("query", "").strip()
    
    # -------------------------------------------------------------
    # 1. Tier 1: 0ms Fast-Path Heuristic Routing
    # -------------------------------------------------------------
    if not query:
        return {
            "intent": "casual_bio",
            "active_agent": "persona_agent",
            "reasoning": "Empty query - routed to persona agent."
        }

    # Check if query requests meeting or appointment
    if MEETING_SCHEDULING_PATTERN.search(query):
        return {
            "intent": "scheduling_meeting",
            "active_agent": "persona_agent",
            "reasoning": "Fast-path heuristic matched meeting or appointment inquiry."
        }
        
    # Check if query is distinctly casual greeting or bio/contact
    is_greeting = bool(GREETINGS_PATTERN.search(query))
    is_bio_contact = bool(BIO_CONTACT_PATTERN.search(query))
    is_research = bool(RESEARCH_KEYWORD_PATTERN.search(query))
    
    # If it's a greeting or bio/contact query WITHOUT deep technical/research specifics:
    if (is_greeting or is_bio_contact) and not is_research:
        return {
            "intent": "casual_bio",
            "active_agent": "persona_agent",
            "reasoning": "Fast-path heuristic matched greeting or bio/contact inquiry."
        }
    
    # If explicitly asking about publications, patents, or research topics:
    if is_research and not (is_greeting and len(query.split()) < 6):
        return {
            "intent": "academic_rag",
            "active_agent": "academic_rag_agent",
            "reasoning": "Fast-path heuristic matched academic, research, patent, or publication keywords."
        }
        
    # Default intelligent routing (Zero LLM quota consumption)
    if is_research:
        return {
            "intent": "academic_rag",
            "active_agent": "academic_rag_agent",
            "reasoning": "Fast-path heuristic routed to Academic RAG agent."
        }
    
    # If conversational or general inquiry, route to persona agent
    return {
        "intent": "casual_bio",
        "active_agent": "persona_agent",
        "reasoning": "Default heuristic routed to Persona agent."
    }

