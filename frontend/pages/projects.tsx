import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { Layers, ExternalLink, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function Projects() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/projects`)
      .then(res => { 
        setItems(res.data || []); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Funded Projects & Initiatives — Dr. Prabh Deep Singh</title>
        <meta name="description" content="Funded research grants, industry collaborations, and active lab projects." />
      </Head>

      <main className="container mx-auto px-6 py-12 max-w-5xl space-y-8">
        {/* Header */}
        <div className="border-b border-academic-border pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-scholar-teal font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Funded Initiatives</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink-900">
            Research Projects & Grants
          </h1>
          <p className="text-sm text-ink-600 max-w-2xl font-sans">
            Extramural research grants, translational healthcare initiatives, and collaborative software projects led by the lab.
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="space-y-4 py-8 text-center text-ink-500 font-mono text-xs">
            <span className="inline-block animate-spin mr-2">◓</span>
            Loading project records...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center academic-card">
            <p className="text-sm text-ink-600">No projects added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, idx) => {
              const isOngoing = (item.status || '').toLowerCase().includes('active') || (item.status || '').toLowerCase().includes('ongoing');
              return (
                <div key={item.id || idx} className="academic-card p-6 flex flex-col justify-between space-y-4 hover:border-ink-300 transition">
                  <div className="space-y-3">
                    {/* Status & Year */}
                    <div className="flex items-center justify-between text-xs">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                        isOngoing
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-academic-paper text-ink-600 border border-academic-border'
                      }`}>
                        {isOngoing ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-ink-400" />}
                        <span>{item.status || 'Completed'}</span>
                      </span>

                      {item.year && (
                        <span className="text-xs font-mono text-ink-500 flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-ink-400" />
                          <span>{item.year}</span>
                        </span>
                      )}
                    </div>

                    {item.image_url && (
                      <div className="h-44 rounded-lg overflow-hidden bg-academic-subtle border border-academic-borderLight">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <h2 className="font-heading text-xl font-bold text-ink-900 leading-snug">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p className="text-sm text-ink-600 leading-relaxed font-sans line-clamp-4">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {item.link && (
                    <div className="pt-3 border-t border-academic-borderLight">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-scholar-teal hover:underline inline-flex items-center space-x-1"
                      >
                        <span>Project details & repository</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}