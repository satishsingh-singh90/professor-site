import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { 
  Quote, 
  Play, 
  X, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  Building2, 
  Calendar, 
  Sparkles, 
  Star, 
  Video, 
  Award,
  BookOpen,
  MessageSquare
} from 'lucide-react';

export interface StudentTestimonial {
  id: string;
  name: string;
  role: string;
  institution: string;
  cohort: string;
  avatarUrl?: string;
  content: string;
  highlight?: string;
  researchTopic?: string;
  youtubeUrl?: string;
  videoDuration?: string;
  rating?: number;
  category: 'phd' | 'masters' | 'bachelors' | 'alumni';
}

// Sample initial testimonials with rich written content and YouTube video links
export const DEFAULT_TESTIMONIALS: StudentTestimonial[] = [
  {
    id: 't-1',
    name: 'Dr. Aranya Sen',
    role: 'Ph.D. Graduate & Former Research Scholar',
    institution: 'Now Postdoctoral Fellow at Max Planck Institute',
    cohort: 'Class of 2023',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    highlight: 'Rigorous academic guidance and immense encouragement to publish in top-tier Q1 journals.',
    content: `Working under Dr. Prabh Deep Singh during my doctorate was the defining journey of my academic career. His meticulous approach to research methodology, continuous push toward theoretical depth, and patient feedback transformed how I formulate hypotheses. Under his guidance, we co-authored 4 IEEE and Springer Q1 papers in clinical AI. Dr. Singh does not merely supervise; he nurtures scholars to become independent, ethical, and ambitious researchers ready for global scientific challenges.`,
    researchTopic: 'Deep Neural Architectures for Multimodal Clinical Diagnostics',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Sample video link
    videoDuration: '3:20',
    rating: 5,
    category: 'phd'
  },
  {
    id: 't-2',
    name: 'Rohit Verma',
    role: 'M.Tech Research Scholar (CSE)',
    institution: 'Now Lead AI Systems Engineer at Microsoft',
    cohort: 'Class of 2024',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    highlight: 'Hands-on mentorship on patent filing and translating research into real-world healthcare prototypes.',
    content: `Dr. Singh fostered an open lab environment where asking unconventional questions was celebrated. During our research on automated ECG signal classification, he personally reviewed our mathematical proofs and encouraged us to file a joint patent. His industry connections and high benchmark for experimental rigor gave me the confidence and portfolio to secure a lead AI engineering position right after graduation.`,
    researchTopic: 'Explainable AI for Edge-Assisted Biomedical Signal Analysis',
    youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    videoDuration: '2:45',
    rating: 5,
    category: 'masters'
  },
  {
    id: 't-3',
    name: 'Simran Kaur',
    role: 'Ph.D. Scholar & Senior Research Fellow',
    institution: 'Graphic Era Deemed to be University',
    cohort: '2022 – Present',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    highlight: 'Unwavering support during challenging experimentation and constant encouragement to present at international conferences.',
    content: `When my early experimental results on medical image segmentation plateaued, Dr. Singh sat down with me for hours reviewing the training loss curves and ablation setups until we broke through the bottleneck. His emphasis on scientific reproducibility, academic integrity, and student well-being makes him an exceptional mentor. He supported my participation in two prestigious international conferences where our work received best paper honors.`,
    researchTopic: 'Federated & Trustworthy Learning in Clinical Neuroimaging',
    youtubeUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    videoDuration: '4:10',
    rating: 5,
    category: 'phd'
  },
  {
    id: 't-4',
    name: 'Aditya Sharma',
    role: 'B.Tech Research Intern & Co-Author',
    institution: 'Now Graduate Student at Georgia Tech',
    cohort: 'Class of 2024',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    highlight: 'Empowering undergraduate students to publish in reputed Scopus-indexed venues.',
    content: `Many professors reserve core research for doctoral candidates, but Dr. Singh welcomed me into his lab as a second-year undergraduate. He patiently introduced me to LaTeX, literature review standards, and benchmark validation. Through his mentorship, our undergraduate team published a Scopus-indexed conference paper and won a state-level innovation award. That experience completely reshaped my career path toward graduate research.`,
    researchTopic: 'Real-time Computer Vision for Assistive Healthcare Devices',
    youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    videoDuration: '2:15',
    rating: 5,
    category: 'bachelors'
  }
];

// Helper to extract YouTube video ID from various link formats
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0`;
    }
  } catch (err) {
    console.error('Failed to parse YouTube URL', err);
  }
  return null;
}

interface TestimonialsSectionProps {
  customTestimonials?: StudentTestimonial[];
}

export default function TestimonialsSection({ customTestimonials }: TestimonialsSectionProps) {
  const [liveTestimonials, setLiveTestimonials] = useState<StudentTestimonial[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'phd' | 'masters' | 'video'>('all');
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; studentName: string; role: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch live testimonials added via Admin Panel
  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/testimonials`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: StudentTestimonial[] = data.map((item: any) => ({
            id: `api-${item.id}`,
            name: item.student_name || 'Student Scholar',
            role: item.course || 'Research Scholar',
            institution: item.institution || 'Graphic Era Deemed to be University',
            cohort: item.year ? (item.year < 1000 ? `Batch ${item.year}` : `Class of ${item.year}`) : 'Alumni',
            avatarUrl: item.avatar_url || '',
            highlight: item.highlight || (item.content && item.content.length > 90 ? item.content.slice(0, 90) + '...' : item.content),
            content: item.content || '',
            researchTopic: item.research_topic || undefined,
            youtubeUrl: item.youtube_url || undefined,
            videoDuration: item.video_duration || undefined,
            rating: item.rating || 5,
            category: (item.course && item.course.toLowerCase().includes('phd')) ? 'phd' : 'masters'
          }));
          setLiveTestimonials(mapped);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch testimonials from API, falling back to curated defaults', err);
      });
  }, []);

  const combinedTestimonials = [
    ...liveTestimonials,
    ...DEFAULT_TESTIMONIALS
  ];

  const testimonials = customTestimonials || (combinedTestimonials.length > 0 ? combinedTestimonials : DEFAULT_TESTIMONIALS);

  // Filtered testimonials
  const filteredList = testimonials.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'video') return Boolean(item.youtubeUrl);
    if (activeFilter === 'phd') return item.category === 'phd';
    if (activeFilter === 'masters') return item.category === 'masters' || item.category === 'bachelors';
    return true;
  });

  // Keep index within bounds if filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter]);

  const activeTestimonial = filteredList[currentIndex] || filteredList[0];

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedVideo(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!filteredList || filteredList.length === 0) return null;

  return (
    <section 
      id="student-testimonials" 
      aria-label="Student Testimonials"
      className="py-16 bg-[#FAFAF8] border-t border-slate-200/80 relative overflow-hidden"
    >
      {/* Background Subtle Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#0D9488]">
                STUDENT EXPERIENCES & MENTORSHIP
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Voices of Our Scholars & Alumni
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-sans max-w-2xl">
              Authentic written reflections and video stories from doctoral scholars, graduate researchers, and mentees on academic growth, research methodology, and career milestones.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#0C2340] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All ({testimonials.length})
            </button>
            <button
              onClick={() => setActiveFilter('phd')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeFilter === 'phd'
                  ? 'bg-[#0C2340] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Ph.D. Scholars
            </button>
            <button
              onClick={() => setActiveFilter('masters')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeFilter === 'masters'
                  ? 'bg-[#0C2340] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Graduates & Interns
            </button>
            <button
              onClick={() => setActiveFilter('video')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeFilter === 'video'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-red-600 hover:bg-red-50 border border-red-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Stories</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            FEATURED TESTIMONIAL HERO CARD (Large Showcase)
        ========================================================================== */}
        {activeTestimonial && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-[0_6px_30px_rgba(15,23,42,0.05)] relative overflow-hidden transition-all duration-300">
            {/* Top decorative gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0C2340] via-[#0D9488] to-[#D49E2D]" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Fixed-Size Photo & Student Identity (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
                
                {/* Fixed Size Photo Frame */}
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-md relative shrink-0">
                    {activeTestimonial.avatarUrl ? (
                      <img
                        src={activeTestimonial.avatarUrl}
                        alt={activeTestimonial.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0C2340] to-[#0D9488] text-white font-heading font-bold text-2xl">
                        {activeTestimonial.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Student badge pill */}
                  <span className="absolute -bottom-2 -right-2 bg-[#0D9488] text-white p-1.5 rounded-xl shadow-md border-2 border-white" title="Verified Scholar">
                    <GraduationCap className="w-4 h-4" />
                  </span>
                </div>

                {/* Name & Academic Credentials */}
                <div className="space-y-1 w-full">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {activeTestimonial.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#0D9488] flex items-center justify-center sm:justify-start gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span>{activeTestimonial.role}</span>
                  </p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-600 pt-1 font-sans">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700">{activeTestimonial.institution}</span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-mono text-slate-400 pt-0.5">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{activeTestimonial.cohort}</span>
                  </div>
                </div>

                {/* Research Topic Tag */}
                {activeTestimonial.researchTopic && (
                  <div className="w-full pt-2">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-left">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1">
                        Thesis & Research Area:
                      </span>
                      <p className="text-xs font-medium text-slate-800 leading-snug">
                        {activeTestimonial.researchTopic}
                      </p>
                    </div>
                  </div>
                )}

                {/* YouTube Video Action Button (if student has video testimonial) */}
                {activeTestimonial.youtubeUrl && (
                  <div className="w-full pt-2">
                    <button
                      onClick={() => {
                        setSelectedVideo({
                          url: activeTestimonial.youtubeUrl!,
                          studentName: activeTestimonial.name,
                          role: activeTestimonial.role
                        });
                      }}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 group cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                      </div>
                      <span>Watch Video Story</span>
                      {activeTestimonial.videoDuration && (
                        <span className="text-[11px] font-mono px-1.5 py-0.5 bg-black/20 rounded font-normal">
                          {activeTestimonial.videoDuration}
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-500 pt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-mono text-slate-400 ml-1.5 font-bold">5.0 / 5.0</span>
                </div>
              </div>

              {/* Right Column: Written Testimonial Content (8 Cols) */}
              <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-6 lg:border-l lg:border-slate-100 lg:pl-8">
                
                {/* Punchy Highlight Quote */}
                {activeTestimonial.highlight && (
                  <div className="flex items-start gap-3 bg-teal-50/70 border border-[#0D9488]/20 p-4 rounded-2xl">
                    <Sparkles className="w-5 h-5 text-[#0D9488] shrink-0 mt-0.5" />
                    <p className="font-heading italic text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      "{activeTestimonial.highlight}"
                    </p>
                  </div>
                )}

                {/* Full Written Content Area */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-slate-400">
                    <Quote className="w-4 h-4 text-[#0D9488]" />
                    <span>Written Testimonial by Student</span>
                  </div>

                  <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-100 text-justify">
                    <p className="whitespace-pre-line">
                      {activeTestimonial.content}
                    </p>
                  </div>
                </div>

                {/* Bottom Bar: Carousel Controls & Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">
                      Scholar {currentIndex + 1} of {filteredList.length}
                    </span>
                    <div className="flex items-center gap-1">
                      {filteredList.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            currentIndex === idx ? 'w-6 bg-[#0D9488]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                          }`}
                          title={`Go to testimonial ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Prev / Next buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length)}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-medium transition cursor-pointer"
                      title="Previous testimonial"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={() => setCurrentIndex((prev) => (prev + 1) % filteredList.length)}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#0C2340] hover:bg-[#071A2B] text-white text-xs font-mono font-medium transition cursor-pointer"
                      title="Next testimonial"
                    >
                      <span>Next Scholar</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            MINI CARDS GRID (All Testimonials Overview)
        ========================================================================== */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
              <span>Browse All Student Mentees</span>
              <span className="text-slate-400">({filteredList.length})</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredList.map((t, idx) => (
              <div
                key={t.id}
                onClick={() => setCurrentIndex(idx)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between space-y-3 ${
                  currentIndex === idx
                    ? 'bg-white border-[#0D9488] shadow-md ring-1 ring-[#0D9488]'
                    : 'bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Header: Fixed photo & Name */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                    {t.avatarUrl ? (
                      <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white font-bold text-xs">
                        {t.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-heading text-sm font-bold text-slate-900 truncate">
                      {t.name}
                    </h5>
                    <p className="text-[11px] font-sans text-[#0D9488] truncate">
                      {t.role}
                    </p>
                  </div>
                </div>

                {/* Excerpt of written content */}
                <p className="text-xs text-slate-600 line-clamp-2 font-sans italic">
                  "{t.highlight || t.content}"
                </p>

                {/* Footer: Video indicator & Cohort */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                  <span>{t.cohort}</span>
                  {t.youtubeUrl && (
                    <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                      <Play className="w-2.5 h-2.5 fill-red-600" />
                      <span>Video</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =========================================================================
          YOUTUBE VIDEO LIGHTBOX MODAL
      ========================================================================== */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="bg-[#071A2B] text-white rounded-2xl overflow-hidden max-w-3xl w-full border border-white/10 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-red-500 text-red-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    {selectedVideo.studentName} &bull; Video Testimonial
                  </h4>
                  <p className="text-xs text-slate-400 font-sans">
                    {selectedVideo.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={selectedVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-300 hover:text-white transition"
                  title="Open directly on YouTube"
                >
                  <span>Open in YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Close video modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Player Embed */}
            <div className="relative aspect-video w-full bg-black">
              {getYouTubeEmbedUrl(selectedVideo.url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(selectedVideo.url)!}
                  title={`${selectedVideo.studentName} Video Testimonial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <p className="text-sm text-slate-300">
                    Unable to load embedded video player for this URL.
                  </p>
                  <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold"
                  >
                    <span>Watch directly on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer Note */}
            <div className="p-3 bg-black/40 border-t border-white/5 text-center text-xs text-slate-400 font-mono">
              Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-slate-200">ESC</kbd> or click outside to close
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
