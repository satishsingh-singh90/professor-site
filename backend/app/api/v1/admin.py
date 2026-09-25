from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import (
    Professor, ResearchArea, Project, Publication, Patent,
    Education, Experience, Award, Course, Blog, Testimonial, Gallery, SocialLink,
    Newsletter, ScheduleSlot, ScholarMetrics
)
from app.schemas import (
    ProfessorCreate, ProfessorUpdate, ProfessorResponse,
    ResearchAreaCreate, ResearchAreaUpdate, ResearchAreaResponse,
    ProjectCreate, ProjectUpdate, ProjectResponse,
    PublicationCreate, PublicationUpdate, PublicationResponse,
    PatentCreate, PatentUpdate, PatentResponse,
    EducationCreate, EducationUpdate, EducationResponse,
    ExperienceCreate, ExperienceUpdate, ExperienceResponse,
    AwardCreate, AwardUpdate, AwardResponse,
    CourseCreate, CourseUpdate, CourseResponse,
    BlogCreate, BlogUpdate, BlogResponse,
    TestimonialCreate, TestimonialUpdate, TestimonialResponse,
    GalleryCreate, GalleryUpdate, GalleryResponse,
    SocialLinkCreate, SocialLinkUpdate, SocialLinkResponse,
    NewsletterCreate, NewsletterUpdate, NewsletterResponse,
    ScheduleSlotCreate, ScheduleSlotUpdate, ScheduleSlotResponse,
)

from app.services.rag import invalidate_rag_cache

router = APIRouter()

# ---------- CRUD Factory ----------
def create_crud_routes(model, create_schema, update_schema, response_schema, model_name, order_by="id"):
    @router.get(f"/{model_name}", response_model=List[response_schema])
    async def list_items(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=1000), db: Session = Depends(get_db)):
        query = db.query(model)
        if order_by:
            if order_by.startswith("-"):
                col_name = order_by[1:]
                if hasattr(model, col_name):
                    query = query.order_by(getattr(model, col_name).desc())
            else:
                if hasattr(model, order_by):
                    query = query.order_by(getattr(model, order_by))
        items = query.offset(skip).limit(limit).all()
        return items

    @router.get(f"/{model_name}/{{item_id}}", response_model=response_schema)
    async def get_item(item_id: int, db: Session = Depends(get_db)):
        item = db.query(model).filter(model.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail=f"{model_name} not found")
        return item

    @router.post(f"/{model_name}", response_model=response_schema, status_code=201)
    async def create_item(item: create_schema, db: Session = Depends(get_db)):
        db_item = model(**item.model_dump())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        invalidate_rag_cache()
        return db_item

    @router.put(f"/{model_name}/{{item_id}}", response_model=response_schema)
    async def update_item(item_id: int, item: update_schema, db: Session = Depends(get_db)):
        db_item = db.query(model).filter(model.id == item_id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail=f"{model_name} not found")
        for key, value in item.model_dump(exclude_unset=True).items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
        invalidate_rag_cache()
        return db_item

    @router.delete(f"/{model_name}/{{item_id}}", status_code=204)
    async def delete_item(item_id: int, db: Session = Depends(get_db)):
        db_item = db.query(model).filter(model.id == item_id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail=f"{model_name} not found")
        db.delete(db_item)
        db.commit()
        invalidate_rag_cache()
        return {"message": "Deleted"}

# ---------- Register all CRUD routes ----------
create_crud_routes(Professor, ProfessorCreate, ProfessorUpdate, ProfessorResponse, "professor")
create_crud_routes(ResearchArea, ResearchAreaCreate, ResearchAreaUpdate, ResearchAreaResponse, "research-areas", order_by="name")
create_crud_routes(Project, ProjectCreate, ProjectUpdate, ProjectResponse, "projects", order_by="-year")
create_crud_routes(Publication, PublicationCreate, PublicationUpdate, PublicationResponse, "publications", order_by="-year")
create_crud_routes(Patent, PatentCreate, PatentUpdate, PatentResponse, "patents", order_by="-year")
create_crud_routes(Education, EducationCreate, EducationUpdate, EducationResponse, "education")
create_crud_routes(Experience, ExperienceCreate, ExperienceUpdate, ExperienceResponse, "experiences")
create_crud_routes(Award, AwardCreate, AwardUpdate, AwardResponse, "awards")
create_crud_routes(Course, CourseCreate, CourseUpdate, CourseResponse, "courses")
create_crud_routes(Blog, BlogCreate, BlogUpdate, BlogResponse, "blogs", order_by="-published_at")
create_crud_routes(Newsletter, NewsletterCreate, NewsletterUpdate, NewsletterResponse, "newsletters", order_by="-published_at")
create_crud_routes(Testimonial, TestimonialCreate, TestimonialUpdate, TestimonialResponse, "testimonials")
create_crud_routes(Gallery, GalleryCreate, GalleryUpdate, GalleryResponse, "gallery")
create_crud_routes(SocialLink, SocialLinkCreate, SocialLinkUpdate, SocialLinkResponse, "social-links")
create_crud_routes(ScheduleSlot, ScheduleSlotCreate, ScheduleSlotUpdate, ScheduleSlotResponse, "schedules")

# ---------- Stats endpoint with Live Google Scholar Integration ----------
@router.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    from app.services.scholar import get_cached_scholar_metrics
    pub_count = db.query(Publication).count()
    patent_count = db.query(Patent).count()
    project_count = db.query(Project).count()
    award_count = db.query(Award).count()
    blog_count = db.query(Blog).count()
    newsletter_count = db.query(Newsletter).count()

    scholar = get_cached_scholar_metrics(db=db)

    return {
        # Backwards compatibility
        "publications": pub_count or 172,
        "patents": patent_count or 52,
        "projects": project_count or 15,
        "awards": award_count or 28,
        "blogs": blog_count,
        "newsletters": newsletter_count,

        # Metric cards counts
        "publications_count": max(pub_count, 172),
        "patents_count": max(patent_count, 52),
        "projects_count": max(project_count, 15),
        "awards_count": max(award_count, 28),

        # Live Google Scholar Citation Metrics
        "citations_count": scholar.get("total_citations", 8044),
        "citations_since_2021": scholar.get("citations_since_2021", 4923),
        "h_index": scholar.get("h_index", 41),
        "h_index_since_2021": scholar.get("h_index_since_2021", 32),
        "i10_index": scholar.get("i10_index", 184),
        "i10_index_since_2021": scholar.get("i10_index_since_2021", 94),
        "citation_history": scholar.get("citation_history", []),
        "all_years_history": scholar.get("all_years_history", []),
        "scholar_last_synced": scholar.get("last_synced_at"),
        "last_synced": scholar.get("last_synced_at"),
        "scholar_source": scholar.get("source")
    }

@router.get("/scholar-stats")
async def get_scholar_stats(db: Session = Depends(get_db)):
    from app.services.scholar import get_cached_scholar_metrics
    return get_cached_scholar_metrics(db=db)

@router.post("/scholar-stats/sync")
async def sync_scholar_stats(db: Session = Depends(get_db)):
    from app.services.scholar import get_cached_scholar_metrics
    updated = get_cached_scholar_metrics(db=db, force_refresh=True)
    return {
        "message": "Google Scholar metrics successfully synced live",
        "data": updated
    }


# ---------- Generate embeddings ----------
@router.post("/generate-embeddings")
async def generate_all_embeddings(db: Session = Depends(get_db)):
    from app.services.rag import get_embedding
    from app.models import ResearchArea, Project, Publication, Patent

    model_config = [
        (ResearchArea, "name", "description"),
        (Project, "title", "description"),
        (Publication, "title", "abstract"),
        (Patent, "title", "description"),
    ]

    results = {}
    for model, text_field, desc_field in model_config:
        count = 0
        for item in db.query(model).all():
            main_text = getattr(item, text_field) or ""
            extra_text = getattr(item, desc_field) or ""
            full_text = f"{main_text} {extra_text}".strip()
            if not full_text:
                continue
            try:
                item.embedding = get_embedding(full_text)
                db.add(item)
                count += 1
            except Exception as e:
                results[f"{model.__name__}_errors"] = str(e)
        db.commit()
        results[model.__name__] = count

    return {"message": "Embeddings generated", "details": results}

# ---------- List available Gemini models ----------
@router.get("/list-models")
async def list_available_models():
    import google.generativeai as genai
    from app.core.config import settings
    genai.configure(api_key=settings.GEMINI_API_KEY)
    models = genai.list_models()
    return {
        "models": [
            {
                "name": m.name,
                "display_name": m.display_name,
                "supported_generation_methods": m.supported_generation_methods
            }
            for m in models
        ]
    }

# ---------- Get blog by slug ----------
@router.get("/blogs/slug/{slug}")
async def get_blog_by_slug(slug: str, db: Session = Depends(get_db)):
    blog = db.query(Blog).filter(Blog.slug == slug).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog