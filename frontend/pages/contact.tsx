import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink, Clock, Sparkles, MessageSquare, Building2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function Contact() {
  const [professor, setProfessor] = useState<any>(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/professor/1`)
      .then(res => setProfessor(res.data))
      .catch(() => {});
  }, []);

  return (
    <>
      <Head>
        <title>Contact & Office Hours — Dr. Prabh Deep Singh</title>
        <meta name="description" content="Contact details, academic advising office hours, and institutional location of Dr. Prabh Deep Singh." />
      </Head>

      <main className="container mx-auto px-6 py-12 max-w-4xl space-y-8">
        {/* Header */}
        <div className="border-b border-academic-border pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-scholar-teal font-semibold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Inquiries & Office</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink-900">
            Contact & Academic Advising
          </h1>
          <p className="text-sm text-ink-600 max-w-2xl font-sans">
            For prospective student advising, research collaboration proposals, media inquiries, or journal review requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Contact Card */}
          <div className="academic-card p-8 space-y-6">
            <h2 className="font-heading text-2xl font-bold text-ink-900">Office Coordinates</h2>

            <div className="space-y-4 text-sm font-sans">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-scholar-teal/10 flex items-center justify-center text-scholar-teal shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-ink-400 uppercase block">Institutional Email</span>
                  <a
                    href={`mailto:${professor?.email || 'prabdeep.singh@university.edu'}`}
                    className="font-medium text-ink-900 hover:text-scholar-teal transition"
                  >
                    {professor?.email || 'prabdeep.singh@university.edu'}
                  </a>
                </div>
              </div>

              {professor?.phone && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-scholar-navy/10 flex items-center justify-center text-scholar-navy shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-ink-400 uppercase block">Office Telephone</span>
                    <p className="font-medium text-ink-900">{professor.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-ink-400 uppercase block">Campus Location</span>
                  <p className="font-medium text-ink-900">
                    {professor?.office || 'Office 402, Engineering Block A'}
                  </p>
                  <p className="text-xs text-ink-500">
                    {professor?.location || 'Faculty of Engineering & Technology, Main Campus'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-ink-400 uppercase block">Student Office Hours</span>
                  <p className="font-medium text-ink-900">Tuesdays & Thursdays &bull; 2:00 PM – 4:00 PM</p>
                  <p className="text-xs text-ink-500">By prior appointment or drop-in during designated hours.</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Twin & Research Profiles Card */}
          <div className="space-y-6">
            {/* ProfAI Assistant Teaser */}
            <div className="academic-card p-6 bg-gradient-to-br from-scholar-navy to-ink-900 text-white space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-scholar-tealLight">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Instant Lab Answers</span>
              </div>
              <h3 className="font-heading text-xl font-bold">Have an immediate question?</h3>
              <p className="text-xs text-ink-200 leading-relaxed font-sans">
                You can converse with my AI Digital Twin right now. It can answer questions regarding paper citations, lab projects, and admissions.
              </p>
              <Link
                href="/ai-assistant"
                className="inline-flex items-center justify-center w-full py-2.5 bg-scholar-teal hover:bg-scholar-tealDark text-white text-xs font-semibold rounded-lg transition shadow-sm"
              >
                Chat with Professor Digital Twin &rarr;
              </Link>
            </div>

            {/* Scholarly Profiles */}
            <div className="academic-card p-6 space-y-3">
              <h3 className="font-heading text-base font-bold text-ink-900">Scholarly Repositories & Profiles</h3>
              <div className="space-y-2 text-xs">
                <a
                  href="https://scholar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-academic-paper hover:bg-academic-subtle border border-academic-borderLight flex items-center justify-between transition"
                >
                  <span className="font-medium text-ink-800">Google Scholar Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-400" />
                </a>

                <a
                  href="https://orcid.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-academic-paper hover:bg-academic-subtle border border-academic-borderLight flex items-center justify-between transition"
                >
                  <span className="font-medium text-ink-800">ORCID Permanent Record</span>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-400" />
                </a>

                <a
                  href="https://researchgate.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-academic-paper hover:bg-academic-subtle border border-academic-borderLight flex items-center justify-between transition"
                >
                  <span className="font-medium text-ink-800">ResearchGate Network</span>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
