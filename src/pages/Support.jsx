import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api.js';

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ subject: '', body: '', bookingId: '' });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('/support').then(({ data }) => setTickets(data));
  }, []);

  async function submitTicket(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/support', form);
      setTickets((t) => [data, ...t]);
      setForm({ subject: '', body: '', bookingId: '' });
      setShowForm(false);
      toast.success('Support ticket submitted. We\'ll be in touch soon.');
    } catch {
      toast.error('Could not submit ticket');
    } finally {
      setLoading(false);
    }
  }

  const STATUS_COLORS = {
    open: 'bg-red-100 text-red-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Customer Support</h1>
          <p className="text-gray-500 mt-1">We're here to help. Usually respond within a few hours.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New ticket'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="font-bold mb-4">Open a support ticket</h2>
          <form onSubmit={submitTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                className="input"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Brief description of your issue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Details</label>
              <textarea
                className="input resize-none"
                rows={5}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Please describe the issue in detail…"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Booking ID (optional)</label>
              <input
                className="input"
                value={form.bookingId}
                onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
                placeholder="If this is about a specific booking"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Submitting…' : 'Submit ticket'}
            </button>
          </form>
        </div>
      )}

      {tickets.length === 0 && !showForm && (
        <div className="card text-center py-12 text-gray-500">
          <p className="text-4xl mb-4">🎉</p>
          <p>No support tickets. Everything running smoothly!</p>
        </div>
      )}

      <div className="space-y-4">
        {tickets.map((t) => (
          <div key={t.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{t.subject}</p>
                <p className="text-sm text-gray-600 mt-1">{t.body.substring(0, 120)}{t.body.length > 120 ? '…' : ''}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`badge shrink-0 ${STATUS_COLORS[t.status] || 'bg-gray-100 text-gray-600'}`}>
                {t.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
