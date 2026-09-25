from sqlalchemy.orm import Session
from app.models import ResearchArea, Project, Publication, Patent
from .rag import get_embedding

def update_embedding(obj, db: Session):
    if isinstance(obj, ResearchArea):
        text = obj.name + " " + (obj.description or "")
    elif isinstance(obj, Project):
        text = obj.title + " " + (obj.description or "")
    elif isinstance(obj, Publication):
        text = obj.title + " " + (obj.abstract or "")
    elif isinstance(obj, Patent):
        text = obj.title + " " + (obj.description or "")
    else:
        return
    obj.embedding = get_embedding(text)
    db.commit()
