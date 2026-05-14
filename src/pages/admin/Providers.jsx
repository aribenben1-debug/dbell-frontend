import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api.js';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  SUSPENDED: 'bg-orange-100 text-orange-800',
};

export default function AdminProviders() {
  const [providers, setProviders] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/admin/providers', { params: { status: filter } })
      .then(({ data }) => setProviders(data))
      .finally(() => setLoading(false));
  }, [filter]);

  async function updateStatus(id, status) {
    try {
      await api.patch(`/admin/providers/${id}`, { status });
      setProviders((ps) => ps.filter((p) => p.id !== id));
      toast.success(`Provider ${status.toLowerCase()}`);
    } catch {
      toast.error('Update failed');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Provider Management</h1>

      <div className="flex gap-2 mb-6">
        {['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === s ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-gray-300 text-gray-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}

      {!loading && providers.length === 0 && (
        <div className="card text-center py-12 text-gray-500">No {filter.toLowerCase()} providers.</div>
      )}

      <div className="space-y-4">
        {providers.map((p) => (
          <div key={p.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                  {p.trades?.map((t) => (
                    <span key={t.id} className="badge bg-gray-100 text-gray-700">{t.name}</span>
                  ))}
                </div>
                <p className="font-bold">{p.user?.firstName} {p.user?.lastName}</p>
                <p className="text-sm text-gray-500">{p.user?.email} · {p.user?.phone || 'No phone'}</p>
                <p className="text-sm text-gray-500">{p.city} · ${p.baseHourlyRate}/hr</p>
                {p.bio && <p className="text-sm text-gray-600 mt-2">{p.bio}</p>}
                <p className="text-xs text-gray-400 mt-2">Applied {new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              {p.status !== 'APPROVED' && (
                <button onClick={() => updateStatus(p.id, 'APPROVED')} className="btn-primary text-sm py-2">Approve</button>
              )}
              {p.status !== 'REJECTED' && (
                <button onClick={() => updateStatus(p.id, 'REJECTED')} className="btn-danger text-sm py-2">Reject</button>
              )}
              {p.status === 'APPROVED' && (
                <button onClick={() => updateStatus(p.id, 'SUSPENDED')} className="btn-secondary text-sm py-2">Suspend</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
