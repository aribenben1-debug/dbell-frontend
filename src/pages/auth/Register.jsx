import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/api.js';
import { useAuthStore } from '../../store/auth.js';

const TRADES = [
  'plumber','electrician','handyman','painter','carpenter','hvac','locksmith','cleaner','gardener','pest-control',
];

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [role, setRole] = useState(params.get('role') === 'provider' ? 'PROVIDER' : null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '',
    city: '', baseHourlyRate: '', trades: [], bio: '',
  });

  function toggleTrade(slug) {
    setForm((f) => ({
      ...f,
      trades: f.trades.includes(slug) ? f.trades.filter((t) => t !== slug) : [...f.trades, slug],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!role) return toast.error('Please select your account type');
    setLoading(true);
    try {
      const payload = {
        ...form,
        role,
        baseHourlyRate: form.baseHourlyRate ? parseFloat(form.baseHourlyRate) : undefined,
      };
      const { data } = await api.post('/auth/register', payload);
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Account created! Welcome to D-Bell.');
      if (data.user.role === 'PROVIDER') navigate('/provider/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  if (!role) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <span className="text-4xl">🔔</span>
          <h1 className="text-2xl font-bold mt-4 mb-2">Join D-Bell</h1>
          <p className="text-gray-500 mb-10">How will you be using D-Bell?</p>
          <div className="grid sm:grid-cols-2 gap-6">
            <button
              onClick={() => setRole('CUSTOMER')}
              className="card hover:border-brand-400 hover:shadow-md transition-all p-8 text-left cursor-pointer"
            >
              <div className="text-4xl mb-4">🏠</div>
              <h2 className="text-lg font-bold mb-2">I need a service</h2>
              <p className="text-gray-500 text-sm">Book professionals for repairs, maintenance, or any home/office task.</p>
            </button>
            <button
              onClick={() => setRole('PROVIDER')}
              className="card hover:border-brand-400 hover:shadow-md transition-all p-8 text-left cursor-pointer"
            >
              <div className="text-4xl mb-4">🛠️</div>
              <h2 className="text-lg font-bold mb-2">I'm a professional</h2>
              <p className="text-gray-500 text-sm">Apply to offer your skills and grow your client base through D-Bell.</p>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-8">
            Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-lg">
        <button onClick={() => setRole(null)} className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
          ← Back
        </button>
        <div className="text-center mb-8">
          <span className="text-4xl">{role === 'CUSTOMER' ? '🏠' : '🛠️'}</span>
          <h1 className="text-2xl font-bold mt-3">
            {role === 'CUSTOMER' ? 'Create your account' : 'Apply as a Provider'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <input className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
              <input className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password (min 8 chars)</label>
            <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
            <input type="tel" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          {role === 'PROVIDER' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly rate (USD)</label>
                <input type="number" min="1" className="input" value={form.baseHourlyRate} onChange={(e) => setForm({ ...form, baseHourlyRate: e.target.value })} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your trades (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {TRADES.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => toggleTrade(t)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        form.trades.includes(t)
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio (optional)</label>
                <textarea className="input resize-none" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell customers about your experience…" />
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Creating account…' : role === 'PROVIDER' ? 'Submit application' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
