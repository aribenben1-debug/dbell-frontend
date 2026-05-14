import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data));
  }, []);

  const cards = stats
    ? [
        { label: 'Total users', value: stats.totalUsers, icon: '👤', color: 'bg-blue-50 text-blue-700' },
        { label: 'Active providers', value: stats.approvedProviders, icon: '🛠️', color: 'bg-purple-50 text-purple-700' },
        { label: 'Total bookings', value: stats.totalBookings, icon: '📅', color: 'bg-green-50 text-green-700' },
        { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(0)}`, icon: '💰', color: 'bg-yellow-50 text-yellow-700' },
      ]
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className={`card ${c.color}`}>
            <div className="text-3xl mb-2">{c.icon}</div>
            <p className="text-3xl font-extrabold">{c.value ?? '—'}</p>
            <p className="text-sm font-medium mt-1 opacity-80">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Link to="/admin/providers" className="card hover:shadow-md hover:border-brand-300 transition-all">
          <div className="text-3xl mb-3">🛠️</div>
          <h2 className="font-bold text-lg">Provider Management</h2>
          <p className="text-gray-500 text-sm mt-1">Review applications, approve or suspend providers.</p>
        </Link>
        <Link to="/admin/bookings" className="card hover:shadow-md hover:border-brand-300 transition-all">
          <div className="text-3xl mb-3">📅</div>
          <h2 className="font-bold text-lg">Bookings</h2>
          <p className="text-gray-500 text-sm mt-1">View all bookings, resolve disputes, monitor payments.</p>
        </Link>
      </div>
    </div>
  );
}
