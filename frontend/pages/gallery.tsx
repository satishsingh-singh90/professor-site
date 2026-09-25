import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function Gallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/gallery`)
      .then(res => { 
        setItems(res.data || []); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Lab Gallery & Field Moments — Dr. Prabh Deep Singh</title>
        <meta name="description" content="Photographs from academic conferences, lab workshops, student graduations, and research demos." />
      </Head>

      <main className="container mx-auto px-6 py-12 max-w-5xl space-y-8">
        {/* Header */}
        <div className="border-b border-academic-border pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-scholar-teal font-semibold uppercase tracking-wider">
            <Camera className="w-4 h-4" />
            <span>Visual Archive</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink-900">
            Conferences, Lab Life & Events
          </h1>
          <p className="text-sm text-ink-600 max-w-2xl font-sans">
            Snapshots of academic keynotes, clinical trial workshops, lab hackathons, and doctoral defenses.
          </p>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="space-y-4 py-8 text-center text-ink-500 font-mono text-xs">
            <span className="inline-block animate-spin mr-2">◓</span>
            Loading gallery archives...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center academic-card">
            <p className="text-sm text-ink-600">No gallery images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <div key={item.id || idx} className="academic-card overflow-hidden group hover:border-ink-300 transition">
                <div className="aspect-[4/3] bg-academic-subtle overflow-hidden relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-heading text-base font-bold text-ink-900 leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-ink-500 line-clamp-2 font-sans">
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
