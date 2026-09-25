import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function Updates() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/blogs`)
      .then(res => { 
        setBlogs(res.data || []); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Lab News, Dispatches & Updates — Dr. Prabh Deep Singh</title>
        <meta name="description" content="Latest research announcements, media mentions, conference talks, and lab milestones." />
      </Head>

      <main className="container mx-auto px-6 py-12 max-w-5xl space-y-8">
        {/* Header */}
        <div className="border-b border-academic-border pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-scholar-teal font-semibold uppercase tracking-wider">
            <Newspaper className="w-4 h-4" />
            <span>Lab Dispatches</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink-900">
            News, Announcements & Insights
          </h1>
          <p className="text-sm text-ink-600 max-w-2xl font-sans">
            Recent findings, keynote talks, open research positions, and thought leadership articles from Dr. Prabh Deep Singh and the lab team.
          </p>
        </div>

        {/* Blog / News Grid */}
        {loading ? (
          <div className="space-y-4 py-8 text-center text-ink-500 font-mono text-xs">
            <span className="inline-block animate-spin mr-2">◓</span>
            Loading updates...
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center academic-card">
            <p className="text-sm text-ink-600 font-medium">No updates posted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <article key={blog.id} className="academic-card overflow-hidden flex flex-col justify-between hover:border-ink-300 transition">
                <div>
                  {blog.image_url && (
                    <div className="h-44 overflow-hidden bg-academic-subtle">
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}

                  <div className="p-5 space-y-2.5">
                    {blog.published_at && (
                      <span className="text-[11px] font-mono text-ink-500 flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-ink-400" />
                        <span>{new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                    )}

                    <h2 className="font-heading text-lg font-bold text-ink-900 leading-snug hover:text-scholar-teal transition">
                      <Link href={`/blog/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-ink-600 line-clamp-3 leading-relaxed font-sans">
                      {blog.content ? blog.content.replace(/<[^>]+>/g, '').slice(0, 150) + '...' : ''}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-xs font-semibold text-scholar-teal hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Read Full Dispatch</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
