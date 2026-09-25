import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api';

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    axios.get(`${API_BASE_URL}/admin/blogs`)
      .then(res => {
        const found = res.data.find((b: any) => b.slug === slug);
        setBlog(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-16">
        <p>Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-6 py-16">
        <p>Blog post not found.</p>
        <Link href="/updates" className="text-teal hover:underline">← Back to Updates</Link>
      </div>
    );
  }

  return (
    <>
      <Head><title>{blog.title} - Professor</title></Head>
      <article className="container mx-auto px-6 py-16 max-w-3xl">
        <Link href="/updates" className="text-teal hover:underline inline-block mb-6">
          ← Back to Updates
        </Link>
        {blog.image_url && (
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-xl mb-8"
          />
        )}
        <h1 className="text-4xl font-heading text-navy mb-4">{blog.title}</h1>
        <p className="text-sm text-slateGray mb-8">
          {new Date(blog.published_at).toDateString()}
        </p>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </>
  );
}