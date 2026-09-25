import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  GraduationCap,
  MapPin,
  ExternalLink,
  Sparkles,
  Building2,
  Brain,
  FileText,
  Lightbulb,
  Layers,
  Award,
  BookOpen,
  ChevronRight
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#071A2B] via-[#061524] to-[#040E18] border-t border-white/[0.08] text-slate-300 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Bio / Academic Identity */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-scholar-teal/20 border border-scholar-teal/40 flex items-center justify-center text-teal-300">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-heading text-xl font-bold text-white">Dr. Prabh Deep Singh</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Associate Professor & AI Healthcare Researcher. Advancing trustworthy machine learning, computational diagnostics, and intelligent clinical systems.
            </p>
            <div className="space-y-1 pt-1 text-xs font-mono text-slate-300">
              <div className="flex items-center space-x-2 text-teal-300">
                <Building2 className="w-3.5 h-3.5" />
                <span>Graphic Era Deemed to Be University</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Dehradun, Uttarakhand, India</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links - Scholarly Work */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-2 pb-1 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-scholar-teal animate-pulse"></span>
              <span>Scholarly Work</span>
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm font-sans">
              <li>
                <Link
                  href="/research"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-md bg-scholar-teal/15 border border-scholar-teal/30 flex items-center justify-center text-teal-300 group-hover:bg-scholar-teal group-hover:text-white transition">
                      <Brain className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">Research Areas</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>

              <li>
                <Link
                  href="/publications"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-md bg-scholar-teal/15 border border-scholar-teal/30 flex items-center justify-center text-teal-300 group-hover:bg-scholar-teal group-hover:text-white transition">
                      <FileText className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">Publications & Papers</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>

              <li>
                <Link
                  href="/patents"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-md bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:bg-amber-500 group-hover:text-white transition">
                      <Lightbulb className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">Patents & Inventions</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>

              <li>
                <Link
                  href="/projects"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-md bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-500 group-hover:text-white transition">
                      <Layers className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">Funded Projects</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>

              <li>
                <Link
                  href="/awards"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-md bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:bg-amber-500 group-hover:text-white transition">
                      <Award className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">Honors & Awards</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-2 pb-1 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span>Academic & Teaching</span>
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm font-sans">
              <li>
                <Link
                  href="/about"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-md bg-scholar-teal/15 border border-scholar-teal/30 flex items-center justify-center text-teal-300 group-hover:bg-scholar-teal group-hover:text-white transition">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">Curriculum Vitae & Bio</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>

              <li>
                <Link
                  href="/teaching"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-md bg-scholar-teal/15 border border-scholar-teal/30 flex items-center justify-center text-teal-300 group-hover:bg-scholar-teal group-hover:text-white transition">
                      <BookOpen className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">Courses & Syllabi</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>

              <li>
                <Link
                  href="/blog"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-md bg-scholar-teal/15 border border-scholar-teal/30 flex items-center justify-center text-teal-300 group-hover:bg-scholar-teal group-hover:text-white transition">
                      <BookOpen className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">Blogs & Articles</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>

              <li>
                <Link
                  href="/updates"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-md bg-scholar-teal/15 border border-scholar-teal/30 flex items-center justify-center text-teal-300 group-hover:bg-scholar-teal group-hover:text-white transition">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">Lab News & Openings</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>

              <li>
                <Link
                  href="/gallery"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-md bg-scholar-teal/15 border border-scholar-teal/30 flex items-center justify-center text-teal-300 group-hover:bg-scholar-teal group-hover:text-white transition">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">Lab & Conferences</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-md bg-scholar-teal/15 border border-scholar-teal/30 flex items-center justify-center text-teal-300 group-hover:bg-scholar-teal group-hover:text-white transition">
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium">Contact & Office Hours</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: AI & Profiles */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Interactive & Profiles
            </h4>
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-medium text-teal-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>ProfAI Digital Twin</span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Engage in an intellectual conversation about research papers and lab openings.
              </p>
              <Link
                href="/ai-assistant"
                className="inline-flex items-center text-xs font-semibold text-teal-300 hover:text-white hover:underline pt-1"
              >
                <span>Chat with Professor Twin</span>
                <span className="ml-1">→</span>
              </Link>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <a
                href="https://scholar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-slate-200 hover:text-white transition inline-flex items-center space-x-1 font-mono text-[11px]"
              >
                <span>Google Scholar</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href="https://orcid.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-slate-200 hover:text-white transition inline-flex items-center space-x-1 font-mono text-[11px]"
              >
                <span>ORCID</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© {currentYear} Dr. Prabh Deep Singh &bull; Graphic Era Deemed to Be University. Academic Portfolio.</p>
          <div className="flex items-center space-x-4 font-mono text-xs">
            <Link href="/admin" className="text-slate-400 hover:text-white transition">Faculty Admin</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-teal-300 transition">Office & Lab</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
