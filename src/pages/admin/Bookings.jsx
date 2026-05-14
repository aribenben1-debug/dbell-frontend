import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../../lib/api.js';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  DISPUTED: 'bg-orange-100 text-orange-800',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/admin/bookings', { params: filter ? { status: filter } : {} })
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {['', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === s ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-gray-300 text-gray-600'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500 text-left">
              <th className="pb-3 pr-4">Customer</th>
              <th className="pb-3 pr-4">Provider</th>
              <th className="pb-3 pr-4">Trade</th>
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="py-3 pr-4">
                  <p className="font-medium">{b.customer?.firstName} {b.customer?.lastName}</p>
                  <p className="text-gray-400 text-xs">{b.customer?.email}</p>
                </td>
                <td className="py-3 pr-4">{b.provider?.user?.firstName} {b.provider?.user?.lastName}</td>
                <td className="py-3 pr-4">{b.trade?.name}</td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  {format(new Date(b.scheduledDate), 'MMM d, yyyy')}
                  <br /><span className="text-gray-400">{b.scheduledTime}</span>
                </td>
                <td className="py-3 pr-4">
                  <span className={`badge ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                </td>
                <td className="py-3 pr-4 font-semibold">
                  {b.finalPrice ? `$${b.finalPrice}` : `$${b.estimatedMin}–$${b.estimatedMax}`}
                </td>
                <td className="py-3">
                  <Link to={`/bookings/${b.id}`} className="text-brand-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {bookings.map((b) => (
          <Link key={b.id} to={`/bookings/${b.id}`} className="card block">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className={`badge ${STATUS_COLORS[b.status]}`}>{b.status}</span>
              <span className="text-sm font-bold text-brand-700">
                {b.finalPrice ? `$${b.finalPrice}` : `$${b.estimatedMin}–$${b.estimatedMax}`}
              </span>
            </div>
            <p className="font-semibold text-sm">{b.customer?.firstName} {b.customer?.lastName}</p>
            <p className="text-xs text-gray-500">Provider: {b.provider?.user?.firstName} {b.provider?.user?.lastName}</p>
            <p className="text-xs text-gray-500 mt-1">
              {b.trade?.name} · {format(new Date(b.scheduledDate), 'MMM d')} at {b.scheduledTime}
            </p>
          </Link>
        ))}
      </div>

      {!loading && bookings.length === 0 && (
        <p className="text-center text-gray-500 py-12">No bookings found.</p>
      )}
    </div>
  );
}
