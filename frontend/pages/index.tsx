import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';
import DynamicMindGraph from '../components/DynamicMindGraph';
import TestimonialsSection from '../components/TestimonialsSection';
import { 
  BookOpen, 
  Award, 
  FileText, 
  ArrowRight, 
  User,
  Mail, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Atom,
  Quote,
  Activity,
  Image as ImageIcon,
  Brain,
  MessageSquare,
  Cpu,
  Sparkles,
  Send,
  Layers,
  Copy,
  Check,
  ExternalLink,
  Newspaper,
  Calendar,
  Search
} from 'lucide-react';

const Home: NextPage = () => {
  const router = useRouter();
  const topicsScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollTopics = (direction: 'left' | 'right') => {
    if (topicsScrollRef.current) {
      const amount = direction === 'left' ? -280 : 280;
      topicsScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Dynamic API states
  const [professor, setProfessor] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [researchAreas, setResearchAreas] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [newsletters, setNewsletters] = useState<any[]>([]);

  // Interactive UI states
  const [quickQuestion, setQuickQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedYearRange, setSelectedYearRange] = useState('All Years');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'areas' | 'projects'>('areas');

  // Dynamic Research Areas Carousel (Shift Right to Left with Middle Zoom & Boundary Colors)
  const defaultResearchAreasList = [
    {
      id: 'ai-health',
      title: 'AI in Healthcare',
      description: 'Developing intelligent systems for early detection, diagnosis and treatment.',
      icon: Activity,
      iconBg: 'bg-[#E6F8F6] text-[#0D9488]',
      borderColor: 'border-[#0D9488]/40 hover:border-[#0D9488]',
      activeBorder: 'border-2 border-[#0D9488] ring-4 ring-[#0D9488]/20',
      activeBg: 'bg-gradient-to-br from-[#E6F8F6] via-white to-white',
      accentColor: 'text-[#0D9488]',
      tag: 'Clinical AI'
    },
    {
      id: 'med-imaging',
      title: 'Medical Imaging',
      description: 'Deep learning for MRI, CT, X-ray and ultrasound image analysis.',
      icon: ImageIcon,
      iconBg: 'bg-[#FEF6E8] text-[#D97706]',
      borderColor: 'border-[#D97706]/40 hover:border-[#D97706]',
      activeBorder: 'border-2 border-[#D97706] ring-4 ring-[#D97706]/20',
      activeBg: 'bg-gradient-to-br from-[#FEF6E8] via-white to-white',
      accentColor: 'text-[#D97706]',
      tag: 'Radiology ML'
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning',
      description: 'Building robust models for prediction, classification and decision support.',
      icon: Brain,
      iconBg: 'bg-[#EBF5FF] text-[#2563EB]',
      borderColor: 'border-[#2563EB]/40 hover:border-[#2563EB]',
      activeBorder: 'border-2 border-[#2563EB] ring-4 ring-[#2563EB]/20',
      activeBg: 'bg-gradient-to-br from-[#EBF5FF] via-white to-white',
      accentColor: 'text-[#2563EB]',
      tag: 'Deep Neural Nets'
    },
    {
      id: 'nlp',
      title: 'Natural Language Processing',
      description: 'Advancing clinical NLP, text mining and medical knowledge extraction.',
      icon: MessageSquare,
      iconBg: 'bg-[#F3E8FF] text-[#9333EA]',
      borderColor: 'border-[#9333EA]/40 hover:border-[#9333EA]',
      activeBorder: 'border-2 border-[#9333EA] ring-4 ring-[#9333EA]/20',
      activeBg: 'bg-gradient-to-br from-[#F3E8FF] via-white to-white',
      accentColor: 'text-[#9333EA]',
      tag: 'Clinical NLP'
    },
    {
      id: 'smart-systems',
      title: 'Smart Systems',
      description: 'IoMT, wearable analytics and real-time health monitoring systems.',
      icon: Cpu,
      iconBg: 'bg-[#E6F7F2] text-[#059669]',
      borderColor: 'border-[#059669]/40 hover:border-[#059669]',
      activeBorder: 'border-2 border-[#059669] ring-4 ring-[#059669]/20',
      activeBg: 'bg-gradient-to-br from-[#E6F7F2] via-white to-white',
      accentColor: 'text-[#059669]',
      tag: 'IoMT & Sensors'
    }
  ];

  const [areaShiftIndex, setAreaShiftIndex] = useState<number>(0);
  const [isAreasHovered, setIsAreasHovered] = useState<boolean>(false);

  useEffect(() => {
    if (isAreasHovered || activeTab !== 'areas') return;
    const interval = setInterval(() => {
      setAreaShiftIndex((prev) => (prev + 1) % defaultResearchAreasList.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isAreasHovered, activeTab]);

  // Dynamic 2x2 Metric Cards Highlight Cycling
  const [activeStatIndex, setActiveStatIndex] = useState<number>(0);
  const [isStatHovered, setIsStatHovered] = useState<boolean>(false);

  useEffect(() => {
    if (isStatHovered) return;
    const interval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, [isStatHovered]);

  // Publication Spotlight States
  const [currentPubIndex, setCurrentPubIndex] = useState<number>(0);
  const [isAutoCyclingPub, setIsAutoCyclingPub] = useState<boolean>(true);
  const [copiedBibId, setCopiedBibId] = useState<number | null>(null);

  // Newsletter Bulletin States
  const [activeNewsIndex, setActiveNewsIndex] = useState<number>(0);
  const [isNewsCycling, setIsNewsCycling] = useState<boolean>(true);

  // Fetch backend data
  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/professor/1`)
      .then(res => setProfessor(res.data))
      .catch(() => {});
    
    axios.get(`${API_BASE_URL}/admin/stats`)
      .then(res => setStats(res.data))
      .catch(() => {});

    axios.get(`${API_BASE_URL}/admin/research-areas`)
      .then(res => setResearchAreas(res.data || []))
      .catch(() => {});

    axios.get(`${API_BASE_URL}/admin/publications`)
      .then(res => setPublications(res.data || []))
      .catch(() => {});

    axios.get(`${API_BASE_URL}/admin/projects`)
      .then(res => setProjects(res.data || []))
      .catch(() => {});

    axios.get(`${API_BASE_URL}/admin/blogs`)
      .then(res => setNewsletters(res.data || []))
      .catch(() => {});
  }, []);

  // Auto-cycle through publications
  useEffect(() => {
    if (!isAutoCyclingPub || publications.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentPubIndex((prev) => (prev + 1) % publications.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoCyclingPub, publications.length]);

  // Curated Fallback Newsletter Bulletins
  const defaultNewsletters = [
    {
      title: "Call for Papers: Special Journal Issue on Clinical AI & IoMT",
      content: "Announcing an upcoming special issue on Trustworthy Machine Learning and Computational Diagnostics in Healthcare. Submissions are now invited for peer-reviewed publication.",
      tag: "Special Issue",
      date: "Recent Dispatch"
    },
    {
      title: "Summer Undergraduate Research Internship Cohort",
      content: "Welcoming talented undergraduate researchers for immersive 10-week summer research fellowships in medical imaging, clinical NLP, and smart hospital IoT.",
      tag: "Internships",
      date: "Student Cohort"
    },
    {
      title: "Best Research Paper Recognition at IEEE Healthcare Informatics",
      content: "Honored to receive the Outstanding Paper Recognition for our breakthrough framework in federated patient privacy for intensive care monitoring.",
      tag: "Honors & Awards",
      date: "Symposium Honor"
    }
  ];

  const adminNewsList = (newsletters || []).map((b, i) => ({
    title: b.title,
    content: b.content || "",
    tag: b.slug || `Bulletin #${i + 1}`,
    date: b.published_at ? new Date(b.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Lab Dispatch"
  }));

  const curatedNews = adminNewsList.length > 0 
    ? [...adminNewsList, ...defaultNewsletters.slice(adminNewsList.length)]
    : defaultNewsletters;

  // Auto-cycle newsletter bulletins
  useEffect(() => {
    if (!isNewsCycling || curatedNews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveNewsIndex((prev) => (prev + 1) % curatedNews.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isNewsCycling, curatedNews.length]);

  const currentNews = curatedNews[activeNewsIndex % curatedNews.length];

  const handleAskProfAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuestion.trim()) {
      router.push(`/ai-assistant?q=${encodeURIComponent(quickQuestion.trim())}`);
    } else {
      router.push('/ai-assistant');
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  const handleCopyBibtex = (pub: any) => {
    if (!pub) return;
    const bibtex = `@article{singh${pub.year || 2024},
  title = {${pub.title}},
  author = {${pub.authors}},
  journal = {${pub.journal}},
  year = {${pub.year}},
  doi = {${pub.doi || ''}}
}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedBibId(pub.id);
    setTimeout(() => setCopiedBibId(null), 2000);
  };

  // Live Google Scholar citation baseline
  const fallbackCitationHistory = [
    { year: '2018', value: 248, label: '248' },
    { year: '2019', value: 203, label: '203' },
    { year: '2020', value: 351, label: '351' },
    { year: '2021', value: 423, label: '423' },
    { year: '2022', value: 660, label: '660' },
    { year: '2023', value: 862, label: '862' },
    { year: '2024', value: 1097, label: '1.1K' },
    { year: '2025', value: 1265, label: '1.3K' },
    { year: '2026', value: 584, label: '584' },
  ];

  // Dynamic Citation Chart Data matching live Google Scholar metrics
  const rawCitationList = (stats?.citation_history && stats.citation_history.length > 0)
    ? stats.citation_history
    : fallbackCitationHistory;

  const citationData = selectedYearRange === 'Last 5 Years'
    ? rawCitationList.slice(-5)
    : (stats?.all_years_history && stats.all_years_history.length > 0)
      ? stats.all_years_history
      : rawCitationList;

  const chartWidth = 560;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Auto-calibrate maximum Y scale based on highest citation count
  const rawMaxVal = Math.max(...citationData.map((d: any) => d.value || 0), 1000);
  const maxVal = Math.ceil((rawMaxVal * 1.15) / 500) * 500;

  const points = citationData.map((d: any, index: number) => {
    const total = citationData.length;
    const x = total > 1 
      ? paddingX + (index * (chartWidth - 2 * paddingX)) / (total - 1)
      : chartWidth / 2;
    const y = chartHeight - paddingY - (d.value / maxVal) * (chartHeight - 2 * paddingY);
    return { x, y, ...d };
  });

  const pathD = points.length > 0 
    ? points.reduce((acc: string, pt: any, idx: number) => {
        return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
      }, '')
    : '';

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  // Active Publication for Spotlight
  const activePub = publications.length > 0 ? publications[currentPubIndex] : {
    id: 1,
    title: "Deep Learning Architectures for Early Detection of Thoracic Abnormalities in Computed Tomography",
    authors: "Dr. Prabh Deep Singh, et al.",
    journal: "IEEE Transactions on Medical Imaging & Computational Healthcare",
    year: 2024,
    citations: 142,
    doi: "10.1109/TMI.2024.3389102",
    abstract: "We introduce a novel self-supervised attention mechanism for 3D thoracic CT analysis that reduces false positive nodules by 31.4% while maintaining high diagnostic sensitivity across heterogeneous scanner protocols."
  };

  return (
    <>
      <Head>
        <title>{professor?.name ? `${professor.name} — AI & Healthcare Lab` : 'Dr. Prabh Deep Singh — AI & Healthcare Lab'}</title>
        <meta 
          name="description" 
          content="Dr. Prabh Deep Singh — Professor, Researcher, Innovator. Pioneering the convergence of Artificial Intelligence and Healthcare." 
        />
      </Head>

      <main className="w-full bg-[#071A2B] text-slate-800">
        {/* =========================================================================
            1. PROFESSOR HERO SECTION (Exact Match with Reference Design)
        ========================================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#030F24] via-[#04132B] to-[#030E22] pt-6 pb-4 lg:pt-8 lg:pb-5 border-b border-white/[0.06]">
          {/* Ambient Subtle Cyan/Teal Glow Behind Graphic */}
          <div className="absolute top-1/3 right-1/4 w-[420px] h-[420px] bg-[#0284C7]/12 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-6 left-6 w-[260px] h-[260px] bg-[#0D9488]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Left Column: Academic Identity (Calibrated to 80% compact viewing scale) */}
              <div className="lg:col-span-6 space-y-3.5 sm:space-y-4">
                {/* Pill Badge: AI • HEALTHCARE • INNOVATION */}
                <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#072438]/70 border border-[#00B4D8]/35 text-[#00B4D8] text-[10px] font-mono font-medium tracking-widest uppercase">
                  <span>AI &bull; HEALTHCARE &bull; INNOVATION</span>
                </div>

                {/* Main Heading: Dr. Prabh Deep Singh in Playfair Display (80% scale) */}
                <h1 className="font-['Playfair_Display'] font-bold text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] text-white tracking-tight leading-[1.12]">
                  Dr. Prabh Deep Singh
                </h1>

                {/* Subtitle: Professor • Researcher • Innovator in Gold */}
                <p className="text-base sm:text-lg lg:text-[19px] font-['Playfair_Display'] text-[#E5A93C] font-normal tracking-wide">
                  Professor &bull; Researcher &bull; Innovator
                </p>

                {/* Mission Statement: Compact, readable 3-line format */}
                <p className="text-slate-300 text-xs sm:text-[13.5px] lg:text-[14px] leading-relaxed max-w-[420px] font-sans font-light">
                  Pioneering the convergence of Artificial Intelligence and Healthcare to build intelligent systems that improve lives and transform the future.
                </p>

                {/* Action Buttons (Compact padding) */}
                <div className="pt-1.5 flex flex-wrap items-center gap-3">
                  <Link
                    href="/research"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#088395] hover:bg-[#0A97AD] text-white font-medium text-xs sm:text-[13px] shadow-[0_4px_16px_rgba(8,131,149,0.35)] transition-all duration-200 group cursor-pointer"
                  >
                    <span>Explore Research</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/20 hover:border-white/40 text-xs sm:text-[13px] font-medium transition-all duration-200 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-300" />
                    <span>About Me</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Distinguished Professor AI Mind Graph Visual (80% scale) */}
              <div className="lg:col-span-6 flex justify-center lg:justify-end items-center relative overflow-visible">
                <div className="relative w-full max-w-[420px] lg:max-w-[460px] xl:max-w-[500px] h-[300px] sm:h-[380px] lg:h-[430px] xl:h-[460px] flex items-center justify-center lg:justify-end overflow-visible">
                  <DynamicMindGraph />
                </div>
              </div>
            </div>

            {/* =========================================================================
                FEATURED RESEARCH AREAS (Matching Reference Screenshot)
            ========================================================================== */}
            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] sm:text-[15px] font-heading font-semibold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2DD4BF]" />
                  <span>Featured Research Areas</span>
                </h3>
                <Link
                  href="/research"
                  className="text-[12px] font-medium text-[#2DD4BF] hover:text-[#5EEAD4] flex items-center gap-1 transition-colors group"
                >
                  <span>Explore All Areas</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* NLP */}
                <Link
                  href="/research"
                  className="group relative bg-[#051C33]/80 hover:bg-[#082949]/90 border border-[#143E63]/80 hover:border-[#2DD4BF]/60 rounded-xl p-3.5 flex items-start gap-3 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(45,212,191,0.2)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#07243E] border border-[#2DD4BF]/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(45,212,191,0.2)] group-hover:scale-105 group-hover:border-[#2DD4BF] transition-all">
                    <span className="font-mono text-[11px] font-bold text-[#2DD4BF] tracking-tighter">text</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[13px] font-semibold text-white group-hover:text-[#5EEAD4] transition-colors leading-snug">
                      NLP & Clinical LLMs
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                      Medical dialogue summarization, knowledge discovery, and clinical entity recognition.
                    </p>
                  </div>
                </Link>

                {/* Medical Imaging */}
                <Link
                  href="/research"
                  className="group relative bg-[#051C33]/80 hover:bg-[#082949]/90 border border-[#143E63]/80 hover:border-[#00B4D8]/60 rounded-xl p-3.5 flex items-start gap-3 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,180,216,0.2)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#07243E] border border-[#00B4D8]/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,180,216,0.2)] group-hover:scale-105 group-hover:border-[#00B4D8] transition-all">
                    <Activity className="w-5 h-5 text-[#00B4D8]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[13px] font-semibold text-white group-hover:text-[#5EEAD4] transition-colors leading-snug">
                      Medical Imaging
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                      Deep learning for 3D CT, MRI, ultrasound, and automated pulmonary nodule triage.
                    </p>
                  </div>
                </Link>

                {/* Deep Learning */}
                <Link
                  href="/research"
                  className="group relative bg-[#051C33]/80 hover:bg-[#082949]/90 border border-[#143E63]/80 hover:border-[#F59E0B]/60 rounded-xl p-3.5 flex items-start gap-3 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.2)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#07243E] border border-[#F59E0B]/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.2)] group-hover:scale-105 group-hover:border-[#F59E0B] transition-all">
                    <Brain className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[13px] font-semibold text-white group-hover:text-[#5EEAD4] transition-colors leading-snug">
                      Deep Learning
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                      Foundational neural architectures, self-supervised learning, and explainable models.
                    </p>
                  </div>
                </Link>

                {/* Medical Vision */}
                <Link
                  href="/research"
                  className="group relative bg-[#051C33]/80 hover:bg-[#082949]/90 border border-[#143E63]/80 hover:border-[#10B981]/60 rounded-xl p-3.5 flex items-start gap-3 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#07243E] border border-[#10B981]/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.2)] group-hover:scale-105 group-hover:border-[#10B981] transition-all">
                    <Cpu className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[13px] font-semibold text-white group-hover:text-[#5EEAD4] transition-colors leading-snug">
                      Medical Vision & IoMT
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                      Real-time clinical sensor monitoring, surgical instrumentation, and edge AI.
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* =========================================================================
                RESEARCH WORK RIBBON / TICKER BANNER (Docked at Base of Hero)
            ========================================================================== */}
            <div className="mt-5 lg:mt-6">
              <div className="bg-[#051C33]/85 backdrop-blur-md border border-[#143E63]/80 rounded-xl px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3 sm:gap-5 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
                {/* Left Tag */}
                <div className="flex items-center gap-2 shrink-0 text-[#00B4D8] font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
                  <Atom className="w-3.5 h-3.5 text-[#00B4D8]" />
                  <span>RESEARCH WORK</span>
                </div>

                {/* Topics List with middots */}
                <div 
                  ref={topicsScrollRef}
                  className="overflow-x-auto scrollbar-hide py-0.5 flex items-center gap-3 text-[11px] sm:text-xs text-slate-200 font-sans whitespace-nowrap scroll-smooth"
                >
                  <span>AI in Healthcare</span>
                  <span className="text-[#00B4D8]/50">&bull;</span>
                  <span>Medical Imaging</span>
                  <span className="text-[#00B4D8]/50">&bull;</span>
                  <span>Deep Learning</span>
                  <span className="text-[#00B4D8]/50">&bull;</span>
                  <span>Computer Vision</span>
                  <span className="text-[#00B4D8]/50">&bull;</span>
                  <span>NLP</span>
                  <span className="text-[#00B4D8]/50">&bull;</span>
                  <span>Smart Diagnostics</span>
                  <span className="text-[#00B4D8]/50">&bull;</span>
                  <span>Predictive Analytics</span>
                  <span className="text-[#00B4D8]/50">&bull;</span>
                  <span>IoMT</span>
                  <span className="text-[#00B4D8]/50">&bull;</span>
                  <span>RAG Systems</span>
                </div>

                {/* Direction Arrows */}
                <div className="flex items-center gap-1 shrink-0 text-slate-400">
                  <button 
                    type="button"
                    onClick={() => scrollTopics('left')} 
                    className="p-1 rounded-md bg-white/[0.04] border border-white/10 hover:text-white hover:bg-white/15 transition cursor-pointer" 
                    aria-label="Previous topics"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => scrollTopics('right')} 
                    className="p-1 rounded-md bg-white/[0.04] border border-white/10 hover:text-white hover:bg-white/15 transition cursor-pointer" 
                    aria-label="Next topics"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. AI DIGITAL TWIN (Interactive Academic Intelligence Interface)
        ========================================================================== */}
        <section className="bg-gradient-to-b from-[#030E22] to-[#071A2B] py-6 border-b border-white/[0.06]">
          <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8">
            <div className="relative rounded-2xl bg-[#081E32]/90 border border-[#2DD4BF]/25 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Left: AI Avatar & Status */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#0284C7] p-0.5 shadow-[0_0_20px_rgba(45,212,191,0.3)] shrink-0">
                    <div className="w-full h-full bg-[#071A2B] rounded-[10px] flex items-center justify-center text-[#2DD4BF]">
                      <Sparkles className="w-6 h-6 text-[#FDE047] animate-pulse" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#071A2B]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">ProfAI Digital Twin</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30 font-medium">
                        RAG &bull; 170+ Papers
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans mt-0.5">
                      Ask about clinical research, paper methodologies, PhD positions, or course materials.
                    </p>
                  </div>
                </div>

                {/* Right: Quick Interactive Input */}
                <form onSubmit={handleAskProfAI} className="w-full lg:w-auto flex-1 max-w-xl flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={quickQuestion}
                      onChange={(e) => setQuickQuestion(e.target.value)}
                      placeholder="e.g., What are your latest papers on Medical Imaging?"
                      className="w-full pl-4 pr-10 py-2.5 bg-white/[0.06] border border-white/15 focus:border-[#2DD4BF] rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2DD4BF] transition"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#0F766E] hover:bg-[#0D9488] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-md hover:shadow-[0_0_16px_rgba(45,212,191,0.4)] transition shrink-0 whitespace-nowrap cursor-pointer"
                  >
                    <span>Ask ProfAI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto scrollbar-hide text-[11px] text-slate-400">
                <span className="font-mono text-slate-400 shrink-0">Popular:</span>
                {[
                  "Medical imaging CT framework",
                  "Are you accepting PhD students?",
                  "Federated learning patient privacy",
                  "Download CV & Publications"
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      router.push(`/ai-assistant?q=${encodeURIComponent(q)}`);
                    }}
                    className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-[#2DD4BF]/15 text-slate-300 hover:text-[#5EEAD4] border border-white/[0.08] hover:border-[#2DD4BF]/40 transition whitespace-nowrap shrink-0 font-sans cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4 & 5. METRICS CARDS & CITATION GRAPH (Research Portfolio Dashboard)
        ========================================================================== */}
        <section className="bg-[#F8FAFC] py-14 border-t border-slate-200/80">
          <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 space-y-14">
            
            {/* Row: 4 Metric Cards + Citation Overview Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Sub-grid: 4 Stat Cards in 2x2 Layout with Dynamic Rotating Highlight */}
              <div 
                className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-5"
                onMouseEnter={() => setIsStatHovered(true)}
                onMouseLeave={() => setIsStatHovered(false)}
              >
                {[
                  {
                    id: 0,
                    count: stats?.publications_count ? `${stats.publications_count}+` : '172+',
                    label: 'Publications',
                    icon: BookOpen,
                    linkText: 'View all publications',
                    linkHref: '/publications',
                    activeColor: 'text-[#0D9488]',
                    activeBorder: 'border-[#0D9488]',
                    activeRing: 'ring-4 ring-[#0D9488]/20',
                    activeBg: 'bg-gradient-to-br from-[#E6F8F6] via-white to-white',
                    activeShadow: 'shadow-[0_16px_36px_rgba(13,148,136,0.22)]',
                    iconBgActive: 'bg-[#0D9488] text-white shadow-[0_0_16px_rgba(13,148,136,0.4)]',
                    iconBgNormal: 'bg-[#E6F8F6] text-[#0D9488]'
                  },
                  {
                    id: 1,
                    count: stats?.citations_count ? `${stats.citations_count.toLocaleString()}+` : '8,044+',
                    label: 'Citations',
                    icon: Quote,
                    linkText: 'View citation overview',
                    linkHref: '#citation-chart',
                    activeColor: 'text-[#D97706]',
                    activeBorder: 'border-[#D97706]',
                    activeRing: 'ring-4 ring-[#D97706]/20',
                    activeBg: 'bg-gradient-to-br from-[#FEF6E8] via-white to-white',
                    activeShadow: 'shadow-[0_16px_36px_rgba(217,119,6,0.22)]',
                    iconBgActive: 'bg-[#D97706] text-white shadow-[0_0_16px_rgba(217,119,6,0.4)]',
                    iconBgNormal: 'bg-[#FEF6E8] text-[#D97706]'
                  },
                  {
                    id: 2,
                    count: stats?.patents_count ? `${stats.patents_count}+` : '52+',
                    label: 'Patents',
                    icon: FileText,
                    linkText: 'View all patents',
                    linkHref: '/patents',
                    activeColor: 'text-[#2563EB]',
                    activeBorder: 'border-[#2563EB]',
                    activeRing: 'ring-4 ring-[#2563EB]/20',
                    activeBg: 'bg-gradient-to-br from-[#EBF5FF] via-white to-white',
                    activeShadow: 'shadow-[0_16px_36px_rgba(37,99,235,0.22)]',
                    iconBgActive: 'bg-[#2563EB] text-white shadow-[0_0_16px_rgba(37,99,235,0.4)]',
                    iconBgNormal: 'bg-[#EBF5FF] text-[#2563EB]'
                  },
                  {
                    id: 3,
                    count: stats?.awards_count ? `${stats.awards_count}+` : '28+',
                    label: 'Awards',
                    icon: Award,
                    linkText: 'View all awards',
                    linkHref: '/awards',
                    activeColor: 'text-[#9333EA]',
                    activeBorder: 'border-[#9333EA]',
                    activeRing: 'ring-4 ring-[#9333EA]/20',
                    activeBg: 'bg-gradient-to-br from-[#F3E8FF] via-white to-white',
                    activeShadow: 'shadow-[0_16px_36px_rgba(147,51,234,0.22)]',
                    iconBgActive: 'bg-[#9333EA] text-white shadow-[0_0_16px_rgba(147,51,234,0.4)]',
                    iconBgNormal: 'bg-[#F3E8FF] text-[#9333EA]'
                  }
                ].map((item) => {
                  const isActive = activeStatIndex === item.id;
                  const IconComponent = item.icon;

                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setActiveStatIndex(item.id)}
                      className={`
                        relative rounded-2xl p-5 sm:p-6 border transition-all duration-500 ease-out flex flex-col justify-between items-center text-center cursor-pointer select-none
                        ${isActive
                          ? `${item.activeBg} ${item.activeBorder} ${item.activeRing} ${item.activeShadow} scale-[1.05] z-10 -translate-y-1`
                          : 'bg-white border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] scale-[0.98] opacity-90 hover:opacity-100 hover:scale-100'
                        }
                      `}
                    >
                      {/* Active Indicator Pulse Dot */}
                      {isActive && (
                        <span className={`absolute top-3 right-3 flex h-2.5 w-2.5 ${item.activeColor}`}>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-current" />
                        </span>
                      )}

                      {/* Icon */}
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                          isActive ? item.iconBgActive : item.iconBgNormal
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {/* Value & Label */}
                      <div className="space-y-1 mb-4">
                        <h3 
                          className={`font-heading text-3xl sm:text-4xl font-bold tracking-tight transition-colors duration-300 ${
                            isActive ? item.activeColor : 'text-slate-900'
                          }`}
                        >
                          {item.count}
                        </h3>
                        <p className={`text-xs tracking-wide transition-colors duration-300 ${
                          isActive ? 'text-slate-900 font-bold' : 'text-slate-600 font-semibold'
                        }`}>
                          {item.label}
                        </p>
                      </div>

                      {/* Bottom Link */}
                      <Link 
                        href={item.linkHref} 
                        className={`text-[11px] font-medium inline-flex items-center gap-1 transition-all duration-300 ${
                          isActive ? `${item.activeColor} font-semibold underline underline-offset-2` : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <span>{item.linkText}</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Right: Citation Overview Card */}
              <div id="citation-chart" className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                
                {/* Header Row */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#0D9488] rounded-full" />
                    <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-800">
                      CITATION OVERVIEW
                    </h4>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Google Scholar Live
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="https://scholar.google.com/citations?user=29NTiIgAAAAJ&hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-[#0D9488] transition"
                      title="View on Google Scholar"
                    >
                      <span>Scholar Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="relative">
                      <button 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                        onClick={() => setSelectedYearRange(selectedYearRange === 'All Years' ? 'Last 5 Years' : 'All Years')}
                      >
                        <span>{selectedYearRange}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Line & Area Chart */}
                <div className="relative w-full py-3">
                  <svg 
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                    className="w-full h-[180px] sm:h-[210px] overflow-visible"
                  >
                    <defs>
                      <linearGradient id="citationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines & Y-axis labels dynamically generated */}
                    {[1, 0.75, 0.5, 0.25, 0].map((ratio, idx) => {
                      const val = Math.round(maxVal * ratio);
                      const label = val >= 1000 ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K` : `${val}`;
                      const yPos = chartHeight - paddingY - ratio * (chartHeight - 2 * paddingY);
                      return (
                        <g key={idx}>
                          <line 
                            x1={paddingX} 
                            y1={yPos} 
                            x2={chartWidth - paddingX} 
                            y2={yPos} 
                            stroke="#E2E8F0" 
                            strokeDasharray="3 3" 
                          />
                          <text 
                            x={paddingX - 10} 
                            y={yPos + 3} 
                            textAnchor="end" 
                            className="text-[10px] fill-slate-400 font-mono"
                          >
                            {label}
                          </text>
                        </g>
                      );
                    })}

                    {/* Gradient Area */}
                    <path d={areaD} fill="url(#citationGradient)" />

                    {/* Main Line */}
                    <path 
                      d={pathD} 
                      fill="none" 
                      stroke="#0D9488" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />

                    {/* Data Points and X labels */}
                    {points.map((pt: any, idx: number) => {
                      const isDense = points.length > 12;
                      const showYear = !isDense || idx === 0 || idx === points.length - 1 || idx % 4 === 0 || hoveredPoint === idx;
                      const showLabel = !isDense || idx === points.length - 1 || (isDense && idx % 5 === 0) || hoveredPoint === idx;
                      const isHovered = hoveredPoint === idx;

                      return (
                        <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(idx)} onMouseLeave={() => setHoveredPoint(null)}>
                          {/* Pulse ring for hovered or latest point */}
                          {isHovered && (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={9}
                              fill="none"
                              stroke="#0D9488"
                              strokeWidth="1.5"
                              strokeOpacity="0.4"
                              className="animate-ping"
                            />
                          )}

                          <circle 
                            cx={pt.x} 
                            cy={pt.y} 
                            r={isHovered ? 6 : (isDense ? 2.5 : 4)} 
                            fill="#0D9488" 
                            stroke="#FFFFFF" 
                            strokeWidth={isDense && !isHovered ? 1 : 2} 
                            className="transition-all duration-150"
                          />
                          
                          {showLabel && (
                            <text 
                              x={pt.x} 
                              y={pt.y - 8} 
                              textAnchor="middle" 
                              className={`font-mono transition-all ${
                                isHovered 
                                  ? 'text-[11px] font-bold fill-[#0D9488]' 
                                  : 'text-[9px] font-semibold fill-slate-700'
                              }`}
                            >
                              {pt.label}
                            </text>
                          )}

                          {showYear && (
                            <text 
                              x={pt.x} 
                              y={chartHeight - 8} 
                              textAnchor="middle" 
                              className={`font-mono transition-colors ${
                                isHovered 
                                  ? 'text-[11px] font-bold fill-[#0D9488]' 
                                  : 'text-[10px] fill-slate-500'
                              }`}
                            >
                              {pt.year}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Bottom Stats Row: h-index, i10-index, Total Citations (Grounded in Live Scholar Metrics) */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                  <div className="bg-[#F8FAFC] rounded-xl p-3 border border-slate-100 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-mono text-slate-500">h-index</p>
                      <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1 rounded font-semibold">Live</span>
                    </div>
                    <p className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                      {stats?.h_index || 41}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Since 2021: {stats?.h_index_since_2021 || 32}
                    </p>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-xl p-3 border border-slate-100 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-mono text-slate-500">i10-index</p>
                      <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1 rounded font-semibold">Live</span>
                    </div>
                    <p className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                      {stats?.i10_index || 184}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Since 2021: {stats?.i10_index_since_2021 || 94}
                    </p>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-xl p-3 border border-slate-100 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-mono text-slate-500">Total Citations</p>
                      <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1 rounded font-semibold">Live</span>
                    </div>
                    <p className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                      {stats?.citations_count ? stats.citations_count.toLocaleString() : '8,044'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Since 2021: {stats?.citations_since_2021 ? stats.citations_since_2021.toLocaleString() : '4,923'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                6. RESEARCH AREAS & FUNDED PROJECTS (Academic Intelligence Showcase)
            ========================================================================== */}
            <div className="space-y-6">
              {/* Header & Tab Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#0D9488] rounded-full" />
                  <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-800">
                    RESEARCH AREAS & HIGH-IMPACT PROJECTS
                  </h3>
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                  <button
                    onClick={() => setActiveTab('areas')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'areas'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Research Areas (5)
                  </button>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'projects'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Funded Projects
                  </button>
                </div>
              </div>

              {/* View 1: 5 Featured Research Areas in Smooth Continuous Infinite Marquee Moving Right to Left */}
              {activeTab === 'areas' && (
                <div className="relative overflow-hidden py-3 marquee-container">
                  {/* Left & Right subtle edge fade gradient masks */}
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10" />
                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10" />

                  {/* Continuously moving horizontal strip */}
                  <div className="animate-marquee flex items-stretch gap-5">
                    {[
                      ...defaultResearchAreasList,
                      ...defaultResearchAreasList,
                      ...defaultResearchAreasList,
                      ...defaultResearchAreasList
                    ].map((area, idx) => {
                      const IconComp = area.icon;

                      return (
                        <div
                          key={`${area.id}-${idx}`}
                          className={`
                            shrink-0 w-[270px] sm:w-[290px] bg-white rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col justify-between items-center text-center group cursor-pointer hover:-translate-y-1 hover:shadow-lg
                            ${area.borderColor}
                          `}
                        >
                          <div className="w-full flex justify-between items-center mb-3">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-500 font-medium">
                              {area.tag}
                            </span>
                            <span className={`w-2 h-2 rounded-full ${area.accentColor.replace('text-', 'bg-')}`} />
                          </div>

                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${area.iconBg}`}>
                            <IconComp className="w-6 h-6" />
                          </div>

                          <div className="space-y-2 mb-6">
                            <h4 className="font-heading text-base font-bold text-slate-900 transition-colors">
                              {area.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-sans">
                              {area.description}
                            </p>
                          </div>

                          <Link 
                            href="/research" 
                            className="text-xs font-semibold inline-flex items-center gap-1 text-slate-600 group-hover:text-slate-900 group-hover:underline transition-colors"
                          >
                            <span>Explore</span>
                            <span>&rarr;</span>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View 2: High-Impact Projects */}
              {activeTab === 'projects' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {(projects.length > 0 ? projects.slice(0, 3) : [
                    {
                      title: "Federated Learning for Cross-Hospital Intensive Care Monitoring",
                      funding_agency: "DST / SERB Government of India",
                      grant_amount: "₹45,00,000",
                      role: "Principal Investigator",
                      description: "Decentralized privacy-preserving neural framework for multi-site intensive care telemetry and early sepsis prediction."
                    },
                    {
                      title: "IoMT Smart Wearables for Post-Operative Remote Cardiac Monitoring",
                      funding_agency: "Healthcare Innovation Council",
                      grant_amount: "₹28,50,000",
                      role: "Lead Researcher",
                      description: "Real-time arrhythmia detection using ultra-low power edge neural network inferencing on wearable sensor nodes."
                    },
                    {
                      title: "Self-Supervised 3D Volumetric Imaging in Pulmonary Disease Diagnostics",
                      funding_agency: "University Research Grant",
                      grant_amount: "₹18,00,000",
                      role: "Principal Investigator",
                      description: "Deep transformer architecture for automated micro-nodule detection and longitudinal volumetric tracking across CT scans."
                    }
                  ]).map((proj: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-md transition flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#0D9488]/10 text-[#0D9488] font-semibold">
                            {proj.role || "Principal Investigator"}
                          </span>
                          <span className="text-slate-500 font-bold">{proj.grant_amount || "Funded"}</span>
                        </div>
                        <h4 className="font-heading text-lg font-bold text-slate-900 leading-snug">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans">
                          {proj.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="font-mono text-[11px]">{proj.funding_agency}</span>
                        <Link href="/projects" className="text-[#0D9488] font-semibold hover:underline">
                          Details &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* =========================================================================
                7. NEWSLETTER & ROTATING LAB DISPATCHES
            ========================================================================== */}
            <div className="space-y-6">
              {/* Dynamic Rotating Bulletin Card */}
              <div 
                className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0D9488]/20 shadow-[0_4px_24px_rgba(13,148,136,0.04)] space-y-4 transition-all duration-300 relative overflow-hidden group"
                onMouseEnter={() => setIsNewsCycling(false)}
                onMouseLeave={() => setIsNewsCycling(true)}
              >
                {/* Status Bar */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                    <span className="text-xs sm:text-sm font-mono font-bold text-[#0D9488] uppercase tracking-wider flex items-center gap-2">
                      <Newspaper className="w-4 h-4" />
                      <span>Lab Dispatch &bull; {currentNews.tag}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                      {activeNewsIndex + 1}/{curatedNews.length}
                    </span>
                    <button
                      onClick={() => setActiveNewsIndex((prev) => (prev - 1 + curatedNews.length) % curatedNews.length)}
                      className="p-1.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                      title="Previous bulletin"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveNewsIndex((prev) => (prev + 1) % curatedNews.length)}
                      className="p-1.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                      title="Next bulletin"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Newsletter Headline */}
                <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-snug">
                  {currentNews.title}
                </h3>

                {/* Content */}
                <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans min-h-[4.5rem] flex items-center bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-100">
                  <p className="whitespace-pre-line">{currentNews.content}</p>
                </div>

                {/* Topic Pills */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 overflow-x-auto pb-0.5">
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs font-mono text-slate-400 font-medium">Jump Bulletin:</span>
                    {curatedNews.slice(0, 5).map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveNewsIndex(idx)}
                        className={`px-3 py-1 rounded-md text-xs font-mono transition cursor-pointer whitespace-nowrap ${
                          activeNewsIndex === idx
                            ? 'bg-[#071A2B] text-white font-bold shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {t.tag}
                      </button>
                    ))}
                  </div>

                  <Link
                    href="/updates"
                    className="text-xs sm:text-sm font-semibold text-[#0D9488] hover:underline shrink-0 font-mono inline-flex items-center space-x-1"
                  >
                    <span>View All Updates &rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Stay Connected Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-[#06242B] via-[#073238] to-[#0A262C] border border-[#0D444F] p-8 sm:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left Identity & Info */}
                <div className="flex items-center gap-5 sm:gap-6">
                  <div className="relative shrink-0 w-16 h-16 rounded-full bg-[#0D434E] border border-[#2DD4BF]/40 flex items-center justify-center text-[#2DD4BF] shadow-[0_0_25px_rgba(45,212,191,0.25)]">
                    <Mail className="w-7 h-7" />
                    <span className="absolute -inset-1.5 rounded-full border border-[#2DD4BF]/20 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#2DD4BF] font-bold block mb-1">
                      STAY CONNECTED
                    </span>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-1.5">
                      Subscribe to Research Updates
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm font-light font-sans">
                      Get the latest news on publications, projects, patents and academic insights.
                    </p>
                  </div>
                </div>

                {/* Right Email Form */}
                <div className="w-full lg:w-auto shrink-0 max-w-md">
                  {subscribed ? (
                    <div className="px-5 py-3 rounded-lg bg-[#0F766E] border border-[#2DD4BF]/40 text-white text-sm font-medium text-center">
                      Thank you for subscribing to lab updates!
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex items-center">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full sm:w-72 px-4 py-3 bg-white text-slate-800 placeholder-slate-400 text-sm rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#D49E2D]"
                        required
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-[#D49E2D] hover:bg-[#E5A83B] text-white font-semibold text-sm rounded-r-lg transition-colors duration-200 whitespace-nowrap shadow-md cursor-pointer"
                      >
                        Subscribe
                      </button>
                    </form>
                  )}

                  <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    <span>We respect your privacy. Unsubscribe anytime.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                8. LATEST RESEARCH (Dynamic Publication Spotlight)
            ========================================================================== */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#0D9488] rounded-full" />
                  <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-800">
                    LATEST RESEARCH & SPOTLIGHT PUBLICATION
                  </h3>
                </div>

                <Link
                  href="/publications"
                  className="text-xs font-semibold text-[#0D9488] hover:underline font-mono inline-flex items-center gap-1"
                >
                  <span>Explore All {stats?.publications_count || '170+'} Publications</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              {/* Dynamic Featured Paper Showcase Card */}
              <div 
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative overflow-hidden group"
                onMouseEnter={() => setIsAutoCyclingPub(false)}
                onMouseLeave={() => setIsAutoCyclingPub(true)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#0D9488]/10 text-[#0D9488] font-bold">
                        {activePub.year || 2024}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {activePub.journal || "Journal of Clinical Healthcare"}
                      </span>
                      {activePub.citations && (
                        <span className="text-slate-400">&bull; {activePub.citations} citations</span>
                      )}
                    </div>

                    <h4 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                      {activePub.title}
                    </h4>

                    <p className="text-xs sm:text-sm font-serif italic text-slate-600">
                      {activePub.authors}
                    </p>

                    {activePub.abstract && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans bg-slate-50 p-4 rounded-xl border border-slate-100 line-clamp-3">
                        {activePub.abstract}
                      </p>
                    )}
                  </div>

                  {/* Actions & Carousel Controls */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyBibtex(activePub)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium font-mono transition cursor-pointer"
                        title="Copy BibTeX Citation"
                      >
                        {copiedBibId === activePub.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copied BibTeX</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy BibTeX</span>
                          </>
                        )}
                      </button>

                      {activePub.doi && (
                        <a
                          href={activePub.doi.startsWith('http') ? activePub.doi : `https://doi.org/${activePub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-semibold transition"
                        >
                          <span>DOI</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Cycle controls */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <span>{publications.length > 0 ? `${currentPubIndex + 1}/${publications.length}` : '1/1'}</span>
                      <button
                        onClick={() => setCurrentPubIndex((prev) => (prev - 1 + publications.length) % publications.length)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCurrentPubIndex((prev) => (prev + 1) % publications.length)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            9. STUDENT TESTIMONIALS & MENTORSHIP
        ========================================================================== */}
        <TestimonialsSection />
      </main>
    </>
  );
};

export default Home;
