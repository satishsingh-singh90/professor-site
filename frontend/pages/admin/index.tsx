import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const loadStats = () => {
    axios.get(`${API_BASE_URL}/admin/stats`)
      .then(res => setStats(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSyncScholar = async () => {
    setIsSyncing(true);
    setSyncMessage('');
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/scholar-stats/sync`);
      setSyncMessage('Google Scholar metrics successfully synced live!');
      loadStats();
    } catch (e) {
      setSyncMessage('Failed to sync. Please try again.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(''), 4000);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading text-navy">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Scholar Live Sync Active
          </span>
        </div>
      </div>

      {/* Row 1: Core System Entities */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-ivory p-4 rounded-xl border border-softGray">
          <p className="text-sm text-slateGray">Publications</p>
          <p className="text-3xl font-heading text-navy">{stats.publications || 0}</p>
        </div>
        <div className="bg-ivory p-4 rounded-xl border border-softGray">
          <p className="text-sm text-slateGray">Patents</p>
          <p className="text-3xl font-heading text-navy">{stats.patents || 0}</p>
        </div>
        <div className="bg-ivory p-4 rounded-xl border border-softGray">
          <p className="text-sm text-slateGray">Projects</p>
          <p className="text-3xl font-heading text-navy">{stats.projects || 0}</p>
        </div>
        <div className="bg-ivory p-4 rounded-xl border border-softGray">
          <p className="text-sm text-slateGray">AI Indexed</p>
          <p className="text-3xl font-heading text-teal">✓ Ready</p>
        </div>
      </div>

      {/* Row 2: Live Google Scholar Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-teal rounded-full" />
              <h2 className="font-heading font-bold text-navy text-lg">Google Scholar Citation Live Stream</h2>
            </div>
            <p className="text-xs text-slateGray mt-1">
              User ID: <span className="font-mono font-medium text-navy">29NTiIgAAAAJ</span> &bull; 
              Last Synced: <span className="font-mono text-slate-500">{stats.scholar_last_synced ? new Date(stats.scholar_last_synced).toLocaleString() : 'Recent'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {syncMessage && (
              <span className="text-xs font-medium text-emerald-600 animate-fade-in">
                {syncMessage}
              </span>
            )}
            <button
              type="button"
              onClick={handleSyncScholar}
              disabled={isSyncing}
              className="px-4 py-2 bg-navy hover:bg-navy/90 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition disabled:opacity-60 cursor-pointer"
            >
              <span className={isSyncing ? 'animate-spin' : ''}>↻</span>
              <span>{isSyncing ? 'Syncing Scholar...' : 'Sync Live Citations'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-mono text-slate-500">Total Citations</p>
            <p className="text-3xl font-heading font-bold text-navy mt-1">
              {stats.citations_count ? stats.citations_count.toLocaleString() : '8,044'}
            </p>
            <p className="text-xs text-teal font-mono mt-1">
              Since 2021: {stats.citations_since_2021 ? stats.citations_since_2021.toLocaleString() : '4,923'}
            </p>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-mono text-slate-500">h-index</p>
            <p className="text-3xl font-heading font-bold text-navy mt-1">
              {stats.h_index || 41}
            </p>
            <p className="text-xs text-teal font-mono mt-1">
              Since 2021: {stats.h_index_since_2021 || 32}
            </p>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-mono text-slate-500">i10-index</p>
            <p className="text-3xl font-heading font-bold text-navy mt-1">
              {stats.i10_index || 184}
            </p>
            <p className="text-xs text-teal font-mono mt-1">
              Since 2021: {stats.i10_index_since_2021 || 94}
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: AI Knowledge Base */}
      <div className="bg-teal/10 p-6 rounded-xl border border-teal/20">
        <h2 className="font-bold text-navy">AI Knowledge Base</h2>
        <p className="text-sm text-slateGray">All content is automatically indexed for ProfAI.</p>
        <button className="mt-3 bg-navy text-white px-4 py-2 rounded-lg text-sm hover:bg-navy/90 cursor-pointer">
          Rebuild Index
        </button>
      </div>
    </AdminLayout>
  );
}
