import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { GraduationCap, Briefcase, Mail, Phone, MapPin, Download, BookOpen, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function About() {
  const [professor, setProfessor] = useState<any>(null);
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/professor/1`)
      .then(res => setProfessor(res.data))
      .catch(() => {});

    axios.get(`${API_BASE_URL}/admin/education`)
      .then(res => setEducation(res.data || []))
      .catch(() => {});

    axios.get(`${API_BASE_URL}/admin/experience`)
      .then(res => {
        setExperience(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Academic Biography & Background — Dr. Prabh Deep Singh</title>
        <meta name="description" content="Biography, education, academic appointments, and curriculum vitae of Dr. Prabh Deep Singh." />
      </Head>

      <main className="container mx-auto px-6 py-12 max-w-5xl space-y-12">
        {/* Header */}
        <div className="border-b border-academic-border pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-scholar-teal font-semibold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Background</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink-900">
            Biography & Curriculum Vitae
          </h1>
          <p className="text-sm text-ink-600 max-w-2xl font-sans">
            Overview of academic appointments, research trajectory, degrees earned, and laboratory leadership.
          </p>
        </div>

        {/* Bio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Bio Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="academic-card p-8 space-y-4">
              <h2 className="font-heading text-2xl font-bold text-ink-900">Academic Overview</h2>
              <div className="text-sm sm:text-base text-ink-700 leading-relaxed space-y-4 font-sans">
                <p>
                  {professor?.bio || "Dr. Prabh Deep Singh is an Associate Professor researching the convergence of Artificial Intelligence, Clinical Informatics, and Trustworthy Medical Systems. His laboratory investigates multimodal neural architectures for early disease detection, wearable non-invasive sensor algorithms, and interpretable clinical decision-support systems."}
                </p>
                <p>
                  Prior to his current appointment, he has led multiple funded research initiatives supported by national science foundations and international health consortia. His work has appeared in leading journals such as IEEE Transactions on Medical Informatics, Nature Digital Medicine, and top AI conferences.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                {professor?.cv_url && (
                  <a
                    href={professor.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-scholar-navy hover:bg-ink-900 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Full Curriculum Vitae (PDF)</span>
                  </a>
                )}

                <Link
                  href="/ai-assistant"
                  className="inline-flex items-center space-x-1.5 bg-scholar-teal/10 hover:bg-scholar-teal/20 text-scholar-teal px-4 py-2 rounded-lg text-xs font-semibold transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask ProfAI about my background</span>
                </Link>
              </div>
            </div>

            {/* Education Timeline */}
            <div className="academic-card p-8 space-y-6">
              <div className="flex items-center space-x-2 border-b border-academic-borderLight pb-3">
                <GraduationCap className="w-5 h-5 text-scholar-teal" />
                <h3 className="font-heading text-xl font-bold text-ink-900">Education & Degrees</h3>
              </div>

              <div className="space-y-4">
                {education.length > 0 ? (
                  education.map((edu, idx) => (
                    <div key={edu.id || idx} className="flex items-start space-x-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-scholar-teal mt-2 shrink-0"></div>
                      <div className="space-y-1">
                        <h4 className="font-heading text-base font-bold text-ink-900">{edu.degree} in {edu.field || 'Computer Science'}</h4>
                        <p className="text-xs text-ink-600 font-sans">{edu.institution} &bull; {edu.year}</p>
                        {edu.description && <p className="text-xs text-ink-500">{edu.description}</p>}
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start space-x-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-scholar-teal mt-2 shrink-0"></div>
                      <div className="space-y-0.5">
                        <h4 className="font-heading text-base font-bold text-ink-900">Ph.D. in Computer Science & Artificial Intelligence</h4>
                        <p className="text-xs text-ink-600 font-sans">Specialization in Biomedical Machine Learning</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-scholar-navy mt-2 shrink-0"></div>
                      <div className="space-y-0.5">
                        <h4 className="font-heading text-base font-bold text-ink-900">M.S. in Computer Engineering</h4>
                        <p className="text-xs text-ink-600 font-sans">Focus on Embedded Systems & Signal Processing</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-ink-400 mt-2 shrink-0"></div>
                      <div className="space-y-0.5">
                        <h4 className="font-heading text-base font-bold text-ink-900">B.Tech. in Information Technology</h4>
                        <p className="text-xs text-ink-600 font-sans">First Class with Academic Distinction</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Academic Experience */}
            <div className="academic-card p-8 space-y-6">
              <div className="flex items-center space-x-2 border-b border-academic-borderLight pb-3">
                <Briefcase className="w-5 h-5 text-scholar-navy" />
                <h3 className="font-heading text-xl font-bold text-ink-900">Academic & Professional Positions</h3>
              </div>

              <div className="space-y-4">
                {experience.length > 0 ? (
                  experience.map((exp, idx) => (
                    <div key={exp.id || idx} className="space-y-1">
                      <h4 className="font-heading text-base font-bold text-ink-900">{exp.role}</h4>
                      <p className="text-xs text-scholar-teal font-mono">{exp.organization} &bull; {exp.start_date} – {exp.end_date || 'Present'}</p>
                      {exp.description && <p className="text-xs text-ink-500">{exp.description}</p>}
                    </div>
                  ))
                ) : (
                  <>
                    <div className="space-y-1">
                      <h4 className="font-heading text-base font-bold text-ink-900">Associate Professor</h4>
                      <p className="text-xs text-scholar-teal font-mono">Department of Computer Science & Engineering &bull; 2021 – Present</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading text-base font-bold text-ink-900">Director, Healthcare AI & Sensor Informatics Lab</h4>
                      <p className="text-xs text-scholar-teal font-mono">Faculty of Engineering &bull; 2019 – Present</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Academic Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="academic-card p-6 space-y-5">
              {/* Portrait */}
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-academic-subtle relative border border-academic-border shadow-sm">
                <img
                  src="/professor-photo.jpg"
                  alt={professor?.name || 'Dr. Prabh Deep Singh'}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <h3 className="font-heading text-lg font-bold text-ink-900 border-b border-academic-borderLight pb-2">
                Faculty Coordinates
              </h3>


              <div className="space-y-3 text-xs font-sans">
                <div>
                  <span className="text-ink-400 font-mono block text-[10px] uppercase">Title</span>
                  <p className="font-semibold text-ink-900 text-sm">{professor?.title || 'Associate Professor'}</p>
                </div>

                <div>
                  <span className="text-ink-400 font-mono block text-[10px] uppercase">Department</span>
                  <p className="text-ink-800">{professor?.department || 'Computer Science & Engineering'}</p>
                </div>

                <div>
                  <span className="text-ink-400 font-mono block text-[10px] uppercase">Institution</span>
                  <p className="text-ink-800">{professor?.university || 'University'}</p>
                </div>

                <div className="pt-2 border-t border-academic-borderLight space-y-2">
                  <div className="flex items-center space-x-2 text-ink-600">
                    <Mail className="w-3.5 h-3.5 text-scholar-teal shrink-0" />
                    <a href={`mailto:${professor?.email || 'professor@university.edu'}`} className="hover:text-scholar-teal truncate">
                      {professor?.email || 'professor@university.edu'}
                    </a>
                  </div>

                  {professor?.phone && (
                    <div className="flex items-center space-x-2 text-ink-600">
                      <Phone className="w-3.5 h-3.5 text-scholar-teal shrink-0" />
                      <span>{professor.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-ink-600">
                    <MapPin className="w-3.5 h-3.5 text-scholar-teal shrink-0" />
                    <span>{professor?.office || 'Office 402, Engineering Block'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
