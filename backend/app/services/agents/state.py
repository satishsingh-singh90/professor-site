from typing import TypedDict, List, Dict, Any, Optional
from langchain_core.messages import BaseMessage

class ProfessorTwinState(TypedDict, total=False):
    """
    Shared State representation across all nodes in the Professor AI Twin LangGraph.
    Every agent reads and enriches this state.
    """
    # Incoming user prompt
    query: str
    
    # Raw conversation history passed from frontend [{role: 'user'|'assistant', content: '...'}]
    history: Optional[List[Dict[str, str]]]
    
    # LangChain message objects
    messages: List[BaseMessage]
    
    # Supervisor Classification & Routing
    intent: str  # "casual_bio" | "academic_rag"
    confidence: float
    reasoning: str
    active_agent: str  # "persona_agent" | "academic_rag_agent"
    
    # In-memory cached Professor profile (name, title, department, bio, contact, etc.)
    prof_profile: Dict[str, Any]
    
    # Weekly timetable & office hours schedule
    schedule: Optional[List[Dict[str, Any]]]
    
    # Retrieved academic knowledge context (Knowledge graph + vector chunks)
    context_text: str
    
    # Structured source citations for frontend cards/links
    sources: List[Dict[str, Any]]
    
    # Final generated answer
    answer: str
