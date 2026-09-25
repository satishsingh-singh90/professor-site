import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { FileText, ExternalLink, Search, Copy, Check, Filter, BookOpen } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function Publications() {
  const [pubs, setPubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [copiedBibId, setCopiedBibId] = useState<number | null>(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/publications`)
      .then(res => {
        setPubs(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Extract unique years
  const years = ['All', ...Array.from(new Set(pubs.map(p => p.year?.toString()).filter(Boolean))).sort().reverse()];

  // Filtered publications
  const filteredPubs = pubs.filter(pub => {
    const matchesSearch = 
      (pub.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pub.authors || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pub.journal || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = selectedYear === 'All' || pub.year?.toString() === selectedYear;

    return matchesSearch && matchesYear;
  });

  const handleCopyBibtex = (pub: any) => {
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

  return (
    <>
      <Head>
        <title>Publications & Scholarly Papers — Dr. Prabh Deep Singh</title>
        <meta name="description" content="Peer-reviewed journal articles, conference proceedings, and book chapters." />
      </Head>

      <main className="container mx-auto px-6 py-12 max-w-5xl space-y-8">
        {/* Page Header */}
        <div className="border-b border-academic-border pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-scholar-teal font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Research Output</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink-900">
            Publications & Papers
          </h1>
          <p className="text-sm text-ink-600 max-w-2xl font-sans">
            Refereed journal papers, conference proceedings, and preprints spanning artificial intelligence, healthcare informatics, and clinical machine learning.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, author, journal..."
              className="w-full bg-white border border-academic-border rounded-lg pl-9 pr-4 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-scholar-teal"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-mono text-ink-400 shrink-0">Year:</span>
            {years.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition shrink-0 ${
                  selectedYear === yr
                    ? 'bg-scholar-navy text-white font-bold'
                    : 'bg-white border border-academic-border text-ink-600 hover:bg-academic-paper'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Publication Cards Stream */}
        {loading ? (
          <div className="space-y-4 py-8 text-center text-ink-500 font-mono text-xs">
            <span className="inline-block animate-spin mr-2">◓</span>
            Loading publication records...
          </div>
        ) : filteredPubs.length === 0 ? (
          <div className="p-12 text-center academic-card space-y-2">
            <FileText className="w-8 h-8 text-ink-300 mx-auto" />
            <p className="text-sm text-ink-600 font-medium">No matching publications found.</p>
            <p className="text-xs text-ink-400">Try adjusting your search query or year filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPubs.map((pub, idx) => (
              <article key={pub.id || idx} className="academic-card p-6 space-y-3 hover:border-ink-300 transition">
                {/* Year + Venue badge */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="badge-tag bg-scholar-navy/10 text-scholar-navy font-bold">
                      {pub.year || 'Recent'}
                    </span>
                    <span className="font-mono text-ink-500 text-xs">
                      {pub.journal}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg sm:text-xl font-bold text-ink-900 leading-snug">
                  {pub.title}
                </h3>

                {/* Authors */}
                <p className="text-xs sm:text-sm text-ink-600 font-sans">
                  <span className="font-semibold text-ink-800">Authors:</span> {pub.authors}
                </p>

                {/* Abstract snippet */}
                {pub.abstract && (
                  <p className="text-xs text-ink-500 line-clamp-3 leading-relaxed font-sans bg-academic-paper p-3 rounded-lg border border-academic-borderLight">
                    {pub.abstract}
                  </p>
                )}

                {/* Action links & Bibtex */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-scholar-teal/10 hover:bg-scholar-teal/20 text-scholar-teal font-semibold rounded-lg transition inline-flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Full Paper (PDF)</span>
                    </a>
                  )}

                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-academic-paper hover:bg-academic-subtle text-ink-600 font-mono rounded-lg border border-academic-border transition inline-flex items-center space-x-1"
                    >
                      <span>DOI: {pub.doi}</span>
                      <ExternalLink className="w-3 h-3 text-ink-400" />
                    </a>
                  )}

                  <button
                    onClick={() => handleCopyBibtex(pub)}
                    className="px-3 py-1.5 bg-white hover:bg-academic-paper text-ink-600 font-mono rounded-lg border border-academic-border transition inline-flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedBibId === pub.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">BibTeX Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Cite (BibTeX)</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}