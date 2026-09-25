import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { Brain, Stethoscope, Activity, Sparkles, ArrowRight, BookOpen, Layers, ShieldCheck, Microscope } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function Research() {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/research-areas`)
      .then(res => { 
        setAreas(res.data || []); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Research Thrusts & Lab Focus — Dr. Prabh Deep Singh</title>
        <meta name="description" content="Research thrusts in Artificial Intelligence, Healthcare Diagnostics, and Biomedical Sensor Systems." />
      </Head>

      <main className="container mx-auto px-6 py-12 max-w-5xl space-y-12">
        {/* Header */}
        <div className="border-b border-academic-border pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-scholar-teal font-semibold uppercase tracking-wider">
            <Microscope className="w-4 h-4" />
            <span>Scientific Agenda</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink-900">
            Research Pillars & Thrusts
          </h1>
          <p className="text-sm text-ink-600 max-w-2xl font-sans">
            Our lab focuses on the intersection of deep learning, clinical informatics, and hardware-software co-design to create robust, interpretable diagnostic systems for modern healthcare.
          </p>
        </div>

        {/* Research Areas Grid */}
        {loading ? (
          <div className="space-y-4 py-8 text-center text-ink-500 font-mono text-xs">
            <span className="inline-block animate-spin mr-2">◓</span>
            Loading research areas...
          </div>
        ) : areas.length === 0 ? (
          <div className="p-12 text-center academic-card">
            <p className="text-sm text-ink-600">No research areas published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {areas.map((area, idx) => (
              <div key={area.id || idx} className="academic-card p-8 flex flex-col justify-between space-y-6 hover:border-ink-300 transition">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-scholar-teal/10 flex items-center justify-center text-scholar-teal">
                      {idx % 3 === 0 ? <Brain className="w-6 h-6" /> : idx % 3 === 1 ? <Stethoscope className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                    </div>
                    <span className="text-xs font-mono text-ink-400 font-bold">Thrust 0{idx + 1}</span>
                  </div>

                  <h2 className="font-heading text-2xl font-bold text-ink-900 leading-snug">
                    {area.name}
                  </h2>

                  <p className="text-sm text-ink-600 leading-relaxed font-sans">
                    {area.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-academic-borderLight flex items-center justify-between">
                  <Link
                    href={`/ai-assistant?q=${encodeURIComponent(`Explain your research focus on ${area.name}`)}`}
                    className="text-xs font-semibold text-scholar-teal hover:underline inline-flex items-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask ProfAI about this thrust</span>
                  </Link>

                  <Link
                    href="/publications"
                    className="text-xs text-ink-500 hover:text-ink-900 inline-flex items-center space-x-1 font-mono"
                  >
                    <span>Related Papers</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Methodology & Ethics Banner */}
        <section className="bg-academic-paper border border-academic-border rounded-2xl p-8 space-y-4">
          <div className="flex items-center space-x-2 text-scholar-navy font-semibold text-sm">
            <ShieldCheck className="w-5 h-5 text-scholar-teal" />
            <h3 className="font-heading text-xl text-ink-900 font-bold">Research Philosophy & Clinical Rigor</h3>
          </div>
          <p className="text-xs sm:text-sm text-ink-600 leading-relaxed max-w-3xl font-sans">
            We believe clinical AI must be held to the highest standards of safety, fairness, and reproducibility. All algorithms developed in our lab undergo extensive cross-site validation, uncertainty quantification, and interpretability audits before translational deployment.
          </p>
        </section>
      </main>
    </>
  );
}
