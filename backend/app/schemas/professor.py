from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ---------- Professor ----------
class ProfessorBase(BaseModel):
    name: str
    title: Optional[str] = None
    department: Optional[str] = None
    university: Optional[str] = None
    bio: Optional[str] = None
    tagline: Optional[str] = None
    photo_url: Optional[str] = None
    cv_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    office: Optional[str] = None
    location: Optional[str] = None

class ProfessorCreate(ProfessorBase):
    pass

class ProfessorUpdate(ProfessorBase):
    pass

class ProfessorResponse(ProfessorBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ---------- Research Area ----------
class ResearchAreaBase(BaseModel):
    name: str
    description: Optional[str] = None

class ResearchAreaCreate(ResearchAreaBase):
    pass

class ResearchAreaUpdate(ResearchAreaBase):
    pass

class ResearchAreaResponse(ResearchAreaBase):
    id: int

    class Config:
        from_attributes = True

# ---------- Project ----------
class ProjectBase(BaseModel):
    research_area_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    year: Optional[int] = None
    status: Optional[str] = None
    image_url: Optional[str] = None
    link: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True

# ---------- Publication ----------
class PublicationBase(BaseModel):
    research_area_id: Optional[int] = None
    title: str
    authors: Optional[str] = None
    year: Optional[int] = None
    journal: Optional[str] = None
    abstract: Optional[str] = None
    doi: Optional[str] = None
    link: Optional[str] = None

class PublicationCreate(PublicationBase):
    pass

class PublicationUpdate(PublicationBase):
    pass

class PublicationResponse(PublicationBase):
    id: int

    class Config:
        from_attributes = True

# ---------- Patent ----------
class PatentBase(BaseModel):
    research_area_id: Optional[int] = None
    title: str
    inventors: Optional[str] = None
    year: Optional[int] = None
    patent_number: Optional[str] = None
    description: Optional[str] = None
    link: Optional[str] = None

class PatentCreate(PatentBase):
    pass

class PatentUpdate(PatentBase):
    pass

class PatentResponse(PatentBase):
    id: int

    class Config:
        from_attributes = True

# ---------- Education ----------
class EducationBase(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[str] = None
    description: Optional[str] = None

class EducationCreate(EducationBase):
    pass

class EducationUpdate(EducationBase):
    pass

class EducationResponse(EducationBase):
    id: int

    class Config:
        from_attributes = True

# ---------- Experience ----------
class ExperienceBase(BaseModel):
    position: Optional[str] = None
    institution: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    description: Optional[str] = None

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(ExperienceBase):
    pass

class ExperienceResponse(ExperienceBase):
    id: int

    class Config:
        from_attributes = True

# ---------- Award ----------
class AwardBase(BaseModel):
    research_area_id: Optional[int] = None
    name: Optional[str] = None
    year: Optional[int] = None
    description: Optional[str] = None

class AwardCreate(AwardBase):
    pass

class AwardUpdate(AwardBase):
    pass

class AwardResponse(AwardBase):
    id: int

    class Config:
        from_attributes = True

# ---------- Course ----------
class CourseBase(BaseModel):
    research_area_id: Optional[int] = None
    code: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    semester: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int

    class Config:
        from_attributes = True

# ---------- Blog ----------
class BlogBase(BaseModel):
    research_area_id: Optional[int] = None
    title: str
    slug: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    link: Optional[str] = None

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BlogBase):
    pass

class BlogResponse(BlogBase):
    id: int
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ---------- Testimonial ----------
class TestimonialBase(BaseModel):
    student_name: Optional[str] = None
    content: Optional[str] = None
    course: Optional[str] = None
    year: Optional[int] = None
    avatar_url: Optional[str] = None
    institution: Optional[str] = None
    highlight: Optional[str] = None
    youtube_url: Optional[str] = None
    video_duration: Optional[str] = None
    rating: Optional[int] = 5

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(TestimonialBase):
    pass

class TestimonialResponse(TestimonialBase):
    id: int

    class Config:
        from_attributes = True

# ---------- Gallery ----------
class GalleryBase(BaseModel):
    title: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None

class GalleryCreate(GalleryBase):
    pass

class GalleryUpdate(GalleryBase):
    pass

class GalleryResponse(GalleryBase):
    id: int

    class Config:
        from_attributes = True

# ---------- Social Link ----------
class SocialLinkBase(BaseModel):
    platform: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None

class SocialLinkCreate(SocialLinkBase):
    pass

class SocialLinkUpdate(SocialLinkBase):
    pass

class SocialLinkResponse(SocialLinkBase):
    id: int

    class Config:
        from_attributes = True

# ---------- Newsletter ----------
class NewsletterBase(BaseModel):
    research_area_id: Optional[int] = None
    title: str
    tag: Optional[str] = None
    content: str
    link: Optional[str] = None

class NewsletterCreate(NewsletterBase):
    pass

class NewsletterUpdate(NewsletterBase):
    pass

class NewsletterResponse(NewsletterBase):
    id: int
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ---------- Schedule Slot / Timetable ----------
class ScheduleSlotBase(BaseModel):
    day_of_week: str
    start_time: str
    end_time: str
    title: str
    slot_type: Optional[str] = "office_hours"
    is_available: Optional[bool] = True
    location: Optional[str] = "Faculty Cabin #312, CS Block"
    notes: Optional[str] = None

class ScheduleSlotCreate(ScheduleSlotBase):
    pass

class ScheduleSlotUpdate(BaseModel):
    day_of_week: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    title: Optional[str] = None
    slot_type: Optional[str] = None
    is_available: Optional[bool] = None
    location: Optional[str] = None
    notes: Optional[str] = None

class ScheduleSlotResponse(ScheduleSlotBase):
    id: int

    class Config:
        from_attributes = True

