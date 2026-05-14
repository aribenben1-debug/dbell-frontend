import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../lib/api.js';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function ProviderDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    api.get('/bookings').then(({ data }) => setBookings(data)).finally(() => setLoading(false));
  }, []);

  async function updateStatus(bookingId, status) {
    try {
      const { data } = await api.patch(`/bookings/${bookingId}/status`, { status });
      setBookings((bs) => bs.map((b) => (b.id === bookingId ? { ...b, status: data.status } : b)));
      toast.success(`Booking ${status.toLowerCase()}`);
    } catch {
      toast.error('Update failed');
    }
  }

  const now = new Date();
  const upcoming = bookings.filter((b) => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status));
  const past = bookings.filter((b) => ['COMPLETED', 'CANCELLED'].includes(b.status));
  const shown = tab === 'upcoming' ? upcoming : past;

  const earned = bookings
    .filter((b) => b.status === 'COMPLETED' && b.paymentStatus === 'PAID')
    .reduce((s, b) => s + (b.finalPrice || 0), 0);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Provider Dashboard</h1>
        <Link to="/provider/profile" className="btn-secondary">Edit profile & availability</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {[
          { label: 'Total bookings', value: bookings.length },
          { label: 'Upcoming', value: upcoming.length },
          { label: 'Completed', value: past.filter((b) => b.status === 'COMPLETED').length },
          { label: 'Earned', value: `$${earned.toFixed(0)}` },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className="text-3xl font-extrabold text-brand-700">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {['upcoming', 'past'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 font-medium capitalize text-sm border-b-2 -mb-px transition-colors ${
              tab === t ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t} ({t === 'upcoming' ? upcoming.length : past.length})
          </button>
        ))}
      </div>

      {shown.length === 0 && (
        <div className="card text-center py-12 text-gray-500">No {tab} bookings.</div>
      )}

      <div className="space-y-4">
        {shown.map((b) => (
          <div key={b.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                  <span className="badge bg-gray-100 text-gray-700">{b.trade?.name}</span>
                </div>
                <p className="font-semibold">
                  {b.customer?.firstName} {b.customer?.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(b.scheduledDate), 'EEE, MMM d')} at {b.scheduledTime} · {b.city}
                </p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">{b.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-brand-700">
                  {b.finalPrice ? `$${b.finalPrice}` : `$${b.estimatedMin}–$${b.estimatedMax}`}
                </p>
                <Link to={`/bookings/${b.id}`} className="text-sm text-brand-600 hover:underline block mt-1">
                  View →
                </Link>
              </div>
            </div>

            {b.status === 'PENDING' && (
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button onClick={() => updateStatus(b.id, 'CONFIRMED')} className="btn-primary text-sm py-2">Accept</button>
                <button onClick={() => updateStatus(b.id, 'CANCELLED')} className="btn-danger text-sm py-2">Decline</button>
              </div>
            )}
            {b.status === 'CONFIRMED' && (
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button onClick={() => updateStatus(b.id, 'IN_PROGRESS')} className="btn-primary text-sm py-2">Start job</button>
              </div>
            )}
            {b.status === 'IN_PROGRESS' && (
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button onClick={() => updateStatus(b.id, 'COMPLETED')} className="btn-primary text-sm py-2">Mark complete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
