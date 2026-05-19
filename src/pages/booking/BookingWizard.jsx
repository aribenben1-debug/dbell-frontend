import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/api.js';
import Survey from '../../components/Survey.jsx';
import CitySearch from '../../components/CitySearch.jsx';
import AddressSearch from '../../components/AddressSearch.jsx';
import { SURVEY, TRADES_LIST } from '../../data/surveyQuestions.js';

const STEPS = ['Service', 'Questions', 'Provider', 'Schedule', 'Confirm'];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function BookingWizard() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [step, setStep] = useState(0);
  const [trade, setTrade] = useState(null);
  const [answers, setAnswers] = useState({});
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const [urgencySurcharge, setUrgencySurcharge] = useState(0); // 0, 25, or 50
  const [problemPhotos, setProblemPhotos] = useState([]); // URLs uploaded by customer
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const photoInputRef = useRef();

  useEffect(() => {
    const t = params.get('trade');
    if (t) {
      const found = TRADES_LIST.find((tr) => tr.slug === t || tr.name.toLowerCase() === t);
      if (found) { setTrade(found); setStep(1); }
    }
  }, []);

  async function searchProviders() {
    if (!trade || !city) return;
    setLoading(true);
    try {
      const { data } = await api.get('/providers/search', {
        params: { tradeSlug: trade.slug, city, date: selectedDate || undefined },
      });
      setProviders(data);
    } catch {
      toast.error('Could not load providers');
    } finally {
      setLoading(false);
    }
  }

  async function loadSlots() {
    if (!selectedProvider || !selectedDate) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/providers/${selectedProvider.id}/slots`, {
        params: { date: selectedDate },
      });
      setSlots(data.slots);
    } catch {
      toast.error('Could not load availability');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (step === 2) searchProviders(); }, [step]);
  useEffect(() => { if (selectedProvider && selectedDate) loadSlots(); }, [selectedProvider, selectedDate]);

  function handleSurveyComplete(surveyAnswers) {
    setAnswers(surveyAnswers);

    // Detect urgency from answers — works for all trades
    const allValues = Object.values(surveyAnswers).flat().map(String);
    if (allValues.some((v) => ['emergency', 'now'].includes(v))) {
      setUrgencySurcharge(50);
    } else if (allValues.some((v) => ['today', 'urgent'].includes(v))) {
      setUrgencySurcharge(25);
    } else {
      setUrgencySurcharge(0);
    }

    setStep(2);
  }

  async function handleProblemPhotos(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingPhotos(true);
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append('photos', f));
      const { data } = await api.post('/upload/temp', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProblemPhotos((prev) => [...prev, ...data.urls].slice(0, 5));
      toast.success('Photos added!');
    } catch {
      toast.error('Could not upload photos');
    } finally {
      setUploadingPhotos(false);
    }
  }

  async function confirmBooking() {
    setLoading(true);
    try {
      const description = Object.entries(answers)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join(' | ');

      const { data } = await api.post('/bookings', {
        providerId: selectedProvider.id,
        tradeId: selectedProvider.trades[0]?.id,
        description,
        answers,
        scheduledDate: selectedDate,
        scheduledTime: selectedSlot,
        durationHours: duration,
        address,
        city,
        problemPhotos,
      });

      toast.success('Booking confirmed! 🎉');
      navigate(`/bookings/${data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  }

  const survey = SURVEY[trade?.slug];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-12">

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8 sm:mb-12">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 transition-all ${i === step ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                i < step
                  ? 'bg-brand-600 border-brand-600 text-white'
                  : i === step
                  ? 'border-brand-600 text-brand-600 bg-white'
                  : 'border-gray-300 text-gray-400 bg-white'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-brand-700' : 'text-gray-400'}`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-6 h-px mx-1 ${i < step ? 'bg-brand-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 0: Pick a service ── */}
      {step === 0 && (
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">What service do you need?</h1>
          <p className="text-gray-500 mb-8">Choose a category and we'll guide you from there.</p>

          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
            {TRADES_LIST.map((t) => (
              <button
                key={t.slug}
                onClick={() => { setTrade(t); setStep(1); }}
                className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-3 sm:p-6 text-left hover:border-brand-300 hover:shadow-lg transition-all duration-200 active:scale-95 touch-manipulation"
              >
                <div className="text-2xl sm:text-4xl mb-1 sm:mb-3">{t.icon}</div>
                <div className="font-bold text-gray-800 group-hover:text-brand-700 transition-colors text-xs sm:text-sm text-center leading-tight">
                  {t.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 1: Survey ── */}
      {step === 1 && survey && (
        <div>
          {/* Trade header */}
          <div className={`bg-gradient-to-r ${survey.color} text-white rounded-2xl p-4 sm:p-6 mb-6 sm:mb-10 flex items-center gap-3 sm:gap-4`}>
            <span className="text-3xl sm:text-5xl">{survey.icon}</span>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wide">You selected</p>
              <h2 className="text-lg sm:text-2xl font-bold">{survey.label}</h2>
            </div>
            <button
              onClick={() => setStep(0)}
              className="ml-auto text-white/70 hover:text-white text-sm underline"
            >
              Change
            </button>
          </div>

          <Survey
            questions={survey.questions}
            onComplete={(surveyAnswers) => {
              setAnswers(surveyAnswers);
              setStep(2);
            }}
            onUrgency={(level) => {
              setUrgencySurcharge(level === 'emergency' ? 50 : 25);
            }}
          />
        </div>
      )}

      {/* ── STEP 2: Location + Provider ── */}
      {step === 2 && (
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Find your provider</h2>
          <p className="text-gray-500 mb-8">Tell us where you are so we can match you with someone nearby.</p>

          {/* Location inputs */}
          <div className="card mb-8 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">City / Town</label>
              <CitySearch value={city} onChange={setCity} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full address</label>
              <AddressSearch value={address} onChange={setAddress} city={city} />
            </div>
            <button
              onClick={searchProviders}
              disabled={!city || !address || loading}
              className="btn-primary w-full"
            >
              {loading ? 'Searching…' : '🔍 Find providers'}
            </button>
          </div>

          {/* Results */}
          {providers.length === 0 && !loading && city && (
            <div className="card text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">😔</p>
              <p className="font-semibold">No providers found in "{city}" yet.</p>
              <p className="text-sm mt-1">Try a nearby city or check back soon.</p>
            </div>
          )}

          <div className="space-y-4">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => { setSelectedProvider(p); setStep(3); }}
                className="w-full card text-left hover:border-brand-400 hover:shadow-lg transition-all duration-200 active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-2xl font-bold text-white shrink-0">
                    {p.user.firstName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-lg text-gray-900">{p.user.firstName} {p.user.lastName}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                          <span>⭐ {p.rating > 0 ? p.rating.toFixed(1) : 'New'}</span>
                          {p.reviewCount > 0 && <span>({p.reviewCount})</span>}
                          <span>· {p.city}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-brand-700 text-lg">${p.baseHourlyRate}<span className="text-sm font-normal text-gray-400">/hr</span></p>
                        <p className="text-xs text-gray-400 mt-0.5">est. ±20%</p>
                      </div>
                    </div>
                    {p.bio && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-1">{p.bio}</p>
                    )}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {p.trades.map((t) => (
                        <span key={t.id} className="badge bg-brand-50 text-brand-700 border border-brand-100">
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-gray-300 shrink-0">›</div>
                </div>
              </button>
            ))}
          </div>

          <button onClick={() => setStep(1)} className="btn-secondary mt-6 w-full">← Back to questions</button>
        </div>
      )}

      {/* ── STEP 3: Schedule ── */}
      {step === 3 && (
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Pick a date & time</h2>
          <p className="text-gray-500 mb-8">
            Booking with <strong>{selectedProvider?.user.firstName} {selectedProvider?.user.lastName}</strong>
          </p>

          <div className="space-y-6">
            {/* Date */}
            <div className="card">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select a date
                {urgencySurcharge === 50 && (
                  <span className="ml-2 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    🚨 Emergency — today only
                  </span>
                )}
              </label>
              <input
                type="date"
                className="input text-base"
                min={new Date().toISOString().split('T')[0]}
                max={urgencySurcharge === 50 ? new Date().toISOString().split('T')[0] : undefined}
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(''); }}
              />
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div className="card">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Available time slots</label>
                {loading && <p className="text-gray-400 text-sm">Loading slots…</p>}
                {!loading && slots.length === 0 && (
                  <p className="text-gray-400 text-sm">No available slots on this date. Try another day.</p>
                )}
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      disabled={!s.available}
                      onClick={() => setSelectedSlot(s.time)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-150 ${
                        !s.available
                          ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through'
                          : selectedSlot === s.time
                          ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                          : 'bg-white border-gray-200 hover:border-brand-400 text-gray-700 hover:shadow-sm'
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price estimate */}
            {selectedSlot && (
              <div className={`rounded-2xl text-white p-6 ${urgencySurcharge > 0 ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-brand-600 to-brand-800'}`}>
                <p className="text-white/70 text-sm font-medium mb-1">💰 Price estimate</p>
                <p className="text-4xl font-extrabold">
                  ${(selectedProvider.baseHourlyRate * duration * 0.8 * (1 + urgencySurcharge / 100)).toFixed(0)}
                  <span className="text-2xl mx-2 opacity-60">–</span>
                  ${(selectedProvider.baseHourlyRate * duration * 1.2 * (1 + urgencySurcharge / 100)).toFixed(0)}
                </p>
                <p className="text-white/70 text-sm mt-2">
                  ${selectedProvider.baseHourlyRate}/hr × {duration}h · Final price within ±20%
                </p>
                {urgencySurcharge > 0 && (
                  <div className="mt-3 bg-white/20 rounded-xl px-3 py-2 text-sm font-semibold flex items-center gap-2">
                    {urgencySurcharge === 50 ? '🚨' : '⚡'} {urgencySurcharge === 50 ? 'Emergency' : 'Urgent'} call-out fee of +{urgencySurcharge}% included
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => setStep(2)} className="btn-secondary">← Back</button>
            <button
              onClick={() => setStep(4)}
              disabled={!selectedDate || !selectedSlot}
              className="btn-primary flex-1"
            >
              Review Booking →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Confirm ── */}
      {step === 4 && (
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Review & confirm</h2>

          <div className="space-y-4">
            {/* Service */}
            <div className="card">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Service</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{trade?.icon}</span>
                <span className="font-bold text-lg">{trade?.name}</span>
              </div>
            </div>

            {/* Answers summary */}
            <div className="card">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Your answers</p>
              <div className="space-y-2">
                {Object.entries(answers).map(([k, v]) => (
                  v && (
                    <div key={k} className="flex gap-2 text-sm">
                      <span className="text-gray-400 capitalize min-w-[100px]">{k.replace(/_/g, ' ')}:</span>
                      <span className="font-medium text-gray-800">{Array.isArray(v) ? v.join(', ') : v}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Provider */}
            <div className="card">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Provider</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                  {selectedProvider?.user.firstName[0]}
                </div>
                <div>
                  <p className="font-bold">{selectedProvider?.user.firstName} {selectedProvider?.user.lastName}</p>
                  <p className="text-sm text-gray-500">⭐ {selectedProvider?.rating > 0 ? selectedProvider.rating.toFixed(1) : 'New'} · {selectedProvider?.city}</p>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="card">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Schedule</p>
              <p className="font-bold text-lg">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-gray-500">{selectedSlot}</p>
              <p className="text-gray-500 mt-1">📍 {address}, {city}</p>
            </div>

            {/* Problem Photos */}
            <div className="card">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">📷 Photo of the problem <span className="text-gray-300 font-normal normal-case">(optional)</span></p>
              <p className="text-sm text-gray-500 mb-4">Help your provider understand the issue before they arrive — add up to 5 photos.</p>

              {problemPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {problemPhotos.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`Problem ${i + 1}`} className="w-full h-24 object-cover rounded-xl" />
                      <button
                        onClick={() => setProblemPhotos((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}

              {problemPhotos.length < 5 && (
                <>
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhotos}
                    className="w-full border-2 border-dashed border-gray-300 hover:border-brand-400 rounded-xl py-4 text-sm text-gray-500 hover:text-brand-600 transition-colors"
                  >
                    {uploadingPhotos ? '⏳ Uploading…' : '📷 Tap to add photos'}
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleProblemPhotos}
                  />
                </>
              )}
            </div>

            {/* Price */}
            <div className={`rounded-2xl text-white p-6 ${urgencySurcharge > 0 ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-brand-600 to-brand-800'}`}>
              <p className="text-white/70 text-sm font-medium mb-1">💰 Price estimate</p>
              <p className="text-4xl font-extrabold">
                ${(selectedProvider?.baseHourlyRate * duration * 0.8 * (1 + urgencySurcharge / 100)).toFixed(0)}
                <span className="text-2xl mx-2 opacity-60">–</span>
                ${(selectedProvider?.baseHourlyRate * duration * 1.2 * (1 + urgencySurcharge / 100)).toFixed(0)}
              </p>
              <p className="text-white/70 text-sm mt-2">Final price confirmed after the job · Payment on completion</p>
              {urgencySurcharge > 0 && (
                <div className="mt-3 bg-white/20 rounded-xl px-3 py-2 text-sm font-semibold flex items-center gap-2">
                  {urgencySurcharge === 50 ? '🚨' : '⚡'} Includes +{urgencySurcharge}% {urgencySurcharge === 50 ? 'emergency' : 'urgent'} call-out fee
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => setStep(3)} className="btn-secondary">← Back</button>
            <button onClick={confirmBooking} disabled={loading} className="btn-primary flex-1 text-base py-3">
              {loading ? 'Confirming…' : '✅  Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
