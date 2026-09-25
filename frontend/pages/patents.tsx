import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { Lightbulb, ExternalLink, ShieldCheck, Tag } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function Patents() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/patents`)
      .then(res => { 
        setItems(res.data || []); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Patents & Inventions — Dr. Prabh Deep Singh</title>
        <meta name="description" content="Granted and filed patents in biomedical sensors, healthcare diagnostics, and machine learning." />
      </Head>

      <main className="container mx-auto px-6 py-12 max-w-5xl space-y-8">
        {/* Header */}
        <div className="border-b border-academic-border pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-scholar-teal font-semibold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>Intellectual Property</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink-900">
            Patents & Inventions
          </h1>
          <p className="text-sm text-ink-600 max-w-2xl font-sans">
            Formal patent disclosures and granted intellectual property covering medical device architectures, diagnostic algorithms, and non-invasive sensors.
          </p>
        </div>

        {/* Patents List */}
        {loading ? (
          <div className="space-y-4 py-8 text-center text-ink-500 font-mono text-xs">
            <span className="inline-block animate-spin mr-2">◓</span>
            Loading patent records...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center academic-card">
            <p className="text-sm text-ink-600">No patent filings recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={item.id || idx} className="academic-card p-6 space-y-3 hover:border-ink-300 transition">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="badge-tag bg-amber-50 text-amber-800 border border-amber-200">
                      <ShieldCheck className="w-3 h-3 mr-1 text-amber-600" />
                      Patent
                    </span>
                    {item.patent_number && (
                      <span className="font-mono text-xs font-bold text-ink-700 bg-academic-paper px-2 py-0.5 rounded border border-academic-border">
                        #{item.patent_number}
                      </span>
                    )}
                  </div>
                  {item.year && (
                    <span className="font-mono text-ink-500 text-xs">Filing / Grant: {item.year}</span>
                  )}
                </div>

                <h2 className="font-heading text-xl font-bold text-ink-900 leading-snug">
                  {item.title}
                </h2>

                <p className="text-xs sm:text-sm text-ink-600 font-sans">
                  <span className="font-semibold text-ink-800">Inventors:</span> {item.inventors}
                </p>

                {item.description && (
                  <p className="text-xs text-ink-600 leading-relaxed font-sans bg-academic-paper p-3 rounded-lg border border-academic-borderLight">
                    {item.description}
                  </p>
                )}

                {item.link && (
                  <div className="pt-2">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-scholar-teal hover:underline inline-flex items-center space-x-1"
                    >
                      <span>View Official Patent Office Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
