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

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings').then(({ data }) => setBookings(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading bookings…</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <Link to="/book" className="btn-primary">+ New booking</Link>
      </div>

      {bookings.length === 0 && (
        <div className="card text-center py-16">
          <p className="text-gray-500 mb-4">You have no bookings yet.</p>
          <Link to="/book" className="btn-primary">Book your first service</Link>
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <Link key={b.id} to={`/bookings/${b.id}`} className="card hover:shadow-md hover:border-brand-300 transition-all block">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`badge ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                  <span className="badge bg-gray-100 text-gray-700">{b.trade?.name}</span>
                  {b.paymentStatus === 'PAID' && <span className="badge bg-green-100 text-green-700">Paid</span>}
                </div>
                <p className="font-semibold">{b.description.substring(0, 80)}{b.description.length > 80 ? '…' : ''}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {b.provider?.user?.firstName} {b.provider?.user?.lastName} · {b.city}
                </p>
              </div>
              <div className="text-right text-sm shrink-0">
                <p className="font-bold text-brand-700">
                  ${b.finalPrice ?? `${b.estimatedMin}–${b.estimatedMax}`}
                </p>
                <p className="text-gray-500 mt-1">
                  {format(new Date(b.scheduledDate), 'MMM d, yyyy')}
                </p>
                <p className="text-gray-500">{b.scheduledTime}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
