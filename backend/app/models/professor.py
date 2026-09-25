from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from app.core.database import Base

class Professor(Base):
    __tablename__ = "professor"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    title = Column(String(200))
    department = Column(String(200))
    university = Column(String(200))
    bio = Column(Text)
    tagline = Column(String(300))
    photo_url = Column(String(500))
    cv_url = Column(String(500))
    email = Column(String(200))
    phone = Column(String(50))
    office = Column(String(200))
    location = Column(String(200))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class ResearchArea(Base):
    __tablename__ = "research_area"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    embedding = Column(Vector(384))

    # Relationships to connected academic entities for Knowledge Graph RAG
    projects = relationship("Project", back_populates="research_area")
    publications = relationship("Publication", back_populates="research_area")
    patents = relationship("Patent", back_populates="research_area")
    courses = relationship("Course", back_populates="research_area")
    awards = relationship("Award", back_populates="research_area")
    blogs = relationship("Blog", back_populates="research_area")
    newsletters = relationship("Newsletter", back_populates="research_area")

class Project(Base):
    __tablename__ = "project"
    id = Column(Integer, primary_key=True, index=True)
    research_area_id = Column(Integer, ForeignKey("research_area.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(300), nullable=False)
    description = Column(Text)
    year = Column(Integer)
    status = Column(String(50))
    image_url = Column(String(500))
    link = Column(String(500))
    embedding = Column(Vector(384))

    research_area = relationship("ResearchArea", back_populates="projects")

class Publication(Base):
    __tablename__ = "publication"
    id = Column(Integer, primary_key=True, index=True)
    research_area_id = Column(Integer, ForeignKey("research_area.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(500), nullable=False)
    authors = Column(Text)
    year = Column(Integer)
    journal = Column(String(300))
    abstract = Column(Text)
    doi = Column(String(100))
    link = Column(String(500))
    embedding = Column(Vector(384))

    research_area = relationship("ResearchArea", back_populates="publications")

class Patent(Base):
    __tablename__ = "patent"
    id = Column(Integer, primary_key=True, index=True)
    research_area_id = Column(Integer, ForeignKey("research_area.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(300), nullable=False)
    inventors = Column(Text)
    year = Column(Integer)
    patent_number = Column(String(50))
    description = Column(Text)
    link = Column(String(500))
    embedding = Column(Vector(384))

    research_area = relationship("ResearchArea", back_populates="patents")

class Education(Base):
    __tablename__ = "education"
    id = Column(Integer, primary_key=True, index=True)
    degree = Column(String(200))
    institution = Column(String(200))
    year = Column(String(50))
    description = Column(Text)

class Experience(Base):
    __tablename__ = "experience"
    id = Column(Integer, primary_key=True, index=True)
    position = Column(String(200))
    institution = Column(String(200))
    start_year = Column(Integer)
    end_year = Column(Integer)
    description = Column(Text)

class Award(Base):
    __tablename__ = "award"
    id = Column(Integer, primary_key=True, index=True)
    research_area_id = Column(Integer, ForeignKey("research_area.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(200))
    year = Column(Integer)
    description = Column(Text)

    research_area = relationship("ResearchArea", back_populates="awards")

class Course(Base):
    __tablename__ = "course"
    id = Column(Integer, primary_key=True, index=True)
    research_area_id = Column(Integer, ForeignKey("research_area.id", ondelete="SET NULL"), nullable=True)
    code = Column(String(50))
    title = Column(String(200))
    description = Column(Text)
    semester = Column(String(50))

    research_area = relationship("ResearchArea", back_populates="courses")

class Blog(Base):
    __tablename__ = "blog"
    id = Column(Integer, primary_key=True, index=True)
    research_area_id = Column(Integer, ForeignKey("research_area.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(300), nullable=False)
    slug = Column(String(300), unique=True)
    description = Column(Text)
    content = Column(Text)
    link = Column(String(500))
    image_url = Column(String(500))
    published_at = Column(DateTime, server_default=func.now())

    research_area = relationship("ResearchArea", back_populates="blogs")

class Testimonial(Base):
    __tablename__ = "testimonial"
    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String(200))
    content = Column(Text)
    course = Column(String(200))
    year = Column(Integer)
    avatar_url = Column(String(500), nullable=True)
    institution = Column(String(300), nullable=True)
    highlight = Column(String(500), nullable=True)
    youtube_url = Column(String(500), nullable=True)
    video_duration = Column(String(50), nullable=True)
    rating = Column(Integer, default=5, nullable=True)

class Gallery(Base):
    __tablename__ = "gallery"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    image_url = Column(String(500))
    description = Column(Text)

class SocialLink(Base):
    __tablename__ = "social_link"
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String(50))
    url = Column(String(500))
    icon = Column(String(100))

class Newsletter(Base):
    __tablename__ = "newsletter"
    id = Column(Integer, primary_key=True, index=True)
    research_area_id = Column(Integer, ForeignKey("research_area.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(300), nullable=False)
    tag = Column(String(100))
    content = Column(Text, nullable=False)
    link = Column(String(500))
    published_at = Column(DateTime, server_default=func.now())

    research_area = relationship("ResearchArea", back_populates="newsletters")

class ScheduleSlot(Base):
    __tablename__ = "schedule_slot"
    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(String(50), nullable=False) # e.g. "Monday", "Tuesday", etc.
    start_time = Column(String(20), nullable=False)  # e.g. "09:00 AM"
    end_time = Column(String(20), nullable=False)    # e.g. "11:00 AM"
    title = Column(String(200), nullable=False)      # e.g. "Office Hours & Student Advising"
    slot_type = Column(String(50), default="office_hours") # "office_hours", "lecture", "lab", "meeting", "busy"
    is_available = Column(Boolean, default=True)     # True if free for appointment; False if busy/class
    location = Column(String(200), default="Faculty Cabin #312, CS Block")
    notes = Column(Text, nullable=True)

class ScholarMetrics(Base):
    __tablename__ = "scholar_metrics"
    id = Column(Integer, primary_key=True, index=True)
    scholar_user_id = Column(String(50), default="29NTiIgAAAAJ")
    total_citations = Column(Integer, default=8044)
    citations_since_2021 = Column(Integer, default=4923)
    h_index = Column(Integer, default=41)
    h_index_since_2021 = Column(Integer, default=32)
    i10_index = Column(Integer, default=184)
    i10_index_since_2021 = Column(Integer, default=94)
    yearly_data = Column(Text, nullable=True)  # JSON string of [{year, value, label}]
    last_synced_at = Column(DateTime, server_default=func.now(), onupdate=func.now())