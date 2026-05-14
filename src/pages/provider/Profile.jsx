import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api.js';
import { useAuthStore } from '../../store/auth.js';
import AvatarUpload from '../../components/AvatarUpload.jsx';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ALL_TRADES = ['plumber','electrician','handyman','painter','carpenter','hvac','locksmith','cleaner','gardener','pest-control'];

const DEFAULT_AVAIL = DAYS.map((_, i) => ({
  dayOfWeek: i,
  startTime: '08:00',
  endTime: '18:00',
  isActive: i >= 1 && i <= 5, // Mon–Fri
}));

export default function ProviderProfile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ bio: '', baseHourlyRate: '', city: '', serviceRadius: 20 });
  const [availability, setAvailability] = useState(DEFAULT_AVAIL);
  const [selectedTrades, setSelectedTrades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => {
      const p = data.provider;
      if (!p) return;
      setProfile(p);
      setForm({
        bio: p.bio || '',
        baseHourlyRate: p.baseHourlyRate || '',
        city: p.city || '',
        serviceRadius: p.serviceRadius || 20,
      });
      setSelectedTrades(p.trades?.map((t) => t.slug) || []);
      if (p.availability?.length) {
        setAvailability(
          DEFAULT_AVAIL.map((def) => {
            const existing = p.availability.find((a) => a.dayOfWeek === def.dayOfWeek);
            return existing ? { ...def, ...existing } : def;
          })
        );
      }
    });
  }, []);

  function toggleTrade(slug) {
    setSelectedTrades((prev) => prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]);
  }

  function updateAvail(dayOfWeek, field, value) {
    setAvailability((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d))
    );
  }

  async function handleSave() {
    setLoading(true);
    try {
      await api.put('/providers/me', {
        ...form,
        baseHourlyRate: parseFloat(form.baseHourlyRate),
        trades: selectedTrades,
        availability,
      });
      toast.success('Profile updated!');
    } catch {
      toast.error('Could not save profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-5">
        <AvatarUpload size="lg" />
        <div>
          <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
          <p className="text-gray-500 text-sm mt-1">Click the camera icon to update your photo</p>
        </div>
      </div>

      {profile?.status && (
        <div className={`card border-l-4 ${
          profile.status === 'APPROVED' ? 'border-green-500 bg-green-50' :
          profile.status === 'PENDING' ? 'border-yellow-500 bg-yellow-50' :
          'border-red-500 bg-red-50'
        }`}>
          <p className="font-semibold">Account status: <span className="capitalize">{profile.status.toLowerCase()}</span></p>
          {profile.status === 'PENDING' && (
            <p className="text-sm text-gray-600 mt-1">Your application is under review. You'll be notified once approved.</p>
          )}
        </div>
      )}

      {/* Basic info */}
      <div className="card space-y-4">
        <h2 className="font-bold text-lg">Basic Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hourly rate (USD)</label>
            <input type="number" className="input" value={form.baseHourlyRate} onChange={(e) => setForm({ ...form, baseHourlyRate: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Service radius (km)</label>
          <input type="number" className="input" value={form.serviceRadius} onChange={(e) => setForm({ ...form, serviceRadius: parseInt(e.target.value) })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea className="input resize-none" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell customers about your experience and skills…" />
        </div>
      </div>

      {/* Trades */}
      <div className="card">
        <h2 className="font-bold text-lg mb-4">My Trades</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_TRADES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTrade(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedTrades.includes(t)
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="card">
        <h2 className="font-bold text-lg mb-4">Weekly Availability</h2>
        <div className="space-y-3">
          {availability.map((day) => (
            <div key={day.dayOfWeek} className="flex items-center gap-4">
              <label className="flex items-center gap-2 w-32 shrink-0">
                <input
                  type="checkbox"
                  checked={day.isActive}
                  onChange={(e) => updateAvail(day.dayOfWeek, 'isActive', e.target.checked)}
                  className="rounded text-brand-600"
                />
                <span className={`text-sm font-medium ${day.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {DAYS[day.dayOfWeek]}
                </span>
              </label>
              {day.isActive ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    className="input py-1.5 w-32 text-sm"
                    value={day.startTime}
                    onChange={(e) => updateAvail(day.dayOfWeek, 'startTime', e.target.value)}
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="time"
                    className="input py-1.5 w-32 text-sm"
                    value={day.endTime}
                    onChange={(e) => updateAvail(day.dayOfWeek, 'endTime', e.target.value)}
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-400">Not available</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={loading} className="btn-primary w-full">
        {loading ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}
