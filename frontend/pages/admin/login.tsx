import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Lock, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const ADMIN_PASSWORD = 'admin123'; // 🔑 Admin password

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password === ADMIN_PASSWORD) {
      // Set cookie for Next.js middleware and localStorage
      document.cookie = 'admin_auth=true; path=/; max-age=86400; SameSite=Lax';
      localStorage.setItem('admin_authenticated', 'true');
      router.push('/admin');
    } else {
      setError('Incorrect faculty password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Faculty Administration Portal — Dr. Prabh Deep Singh</title>
      </Head>

      <div className="min-h-screen bg-academic-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full academic-card p-8 space-y-6 shadow-card">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-scholar-navy/10 text-scholar-navy flex items-center justify-center mx-auto border border-scholar-navy/20">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-ink-900">
              Faculty Admin Portal
            </h1>
            <p className="text-xs text-ink-500 font-sans">
              Enter authorized administrator credentials to manage papers, patents, and courses.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-ink-700 font-semibold mb-1.5 uppercase tracking-wider">
                Administrator Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-academic-paper border border-academic-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-scholar-teal focus:border-scholar-teal transition"
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-ink-400 absolute left-3 top-3" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-scholar-navy hover:bg-ink-900 text-white font-medium py-2.5 rounded-lg text-sm transition shadow-sm flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-academic-borderLight text-center">
            <Link
              href="/"
              className="text-xs text-ink-500 hover:text-scholar-teal transition inline-flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
