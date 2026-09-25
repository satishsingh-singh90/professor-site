import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { Award, Trophy, Star, Medal } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function Awards() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/awards`)
      .then(res => { 
        setItems(res.data || []); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Honors, Fellowships & Awards — Dr. Prabh Deep Singh</title>
        <meta name="description" content="Academic honors, best paper awards, research fellowships, and distinctions." />
      </Head>

      <main className="container mx-auto px-6 py-12 max-w-5xl space-y-8">
        {/* Header */}
        <div className="border-b border-academic-border pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-scholar-teal font-semibold uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>Scholarly Distinctions</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink-900">
            Awards, Honors & Fellowships
          </h1>
          <p className="text-sm text-ink-600 max-w-2xl font-sans">
            Recognitions from national academies, international research societies, university teaching awards, and best paper commendations.
          </p>
        </div>

        {/* Awards List */}
        {loading ? (
          <div className="space-y-4 py-8 text-center text-ink-500 font-mono text-xs">
            <span className="inline-block animate-spin mr-2">◓</span>
            Loading honors & awards...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center academic-card">
            <p className="text-sm text-ink-600">No awards listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, idx) => (
              <div key={item.id || idx} className="academic-card p-6 flex items-start space-x-4 hover:border-ink-300 transition">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-1">
                  {idx % 2 === 0 ? <Award className="w-6 h-6" /> : <Medal className="w-6 h-6" />}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="badge-tag bg-amber-50 text-amber-900 border border-amber-200">
                      {item.year || 'Honor'}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-ink-900 leading-snug">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-ink-600 leading-relaxed font-sans pt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
