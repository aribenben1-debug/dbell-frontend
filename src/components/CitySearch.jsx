import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ISRAELI_CITIES } from '../data/israeliCities.js';

export default function CitySearch({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef();

  const filtered = value.trim()
    ? ISRAELI_CITIES.filter((c) =>
        c.toLowerCase().includes(value.trim().toLowerCase())
      ).slice(0, 8)
    : ISRAELI_CITIES.slice(0, 8);

  useEffect(() => {
    function onDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setHighlighted(-1);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function handleKeyDown(e) {
    if (!open) { if (e.key === 'ArrowDown') setOpen(true); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      select(filtered[highlighted]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlighted(-1);
    }
  }

  function select(city) {
    onChange(city);
    setOpen(false);
    setHighlighted(-1);
  }

  async function handleGetLocation() {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.municipality ||
            data.address?.suburb;
          if (city) {
            onChange(city);
            setOpen(false);
            toast.success(`Location detected: ${city} 📍`);
          } else {
            toast.error('Could not detect your city');
          }
        } catch {
          toast.error('Location lookup failed');
        } finally {
          setLocating(false);
        }
      },
      () => {
        toast.error('Location permission denied');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Use my location — Wolt-style pill */}
      <button
        type="button"
        onClick={handleGetLocation}
        disabled={locating}
        className="w-full mb-3 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-brand-50 border-2 border-brand-200 hover:bg-brand-100 hover:border-brand-400 text-brand-700 font-semibold text-sm transition-all disabled:opacity-60 active:scale-[0.98]"
      >
        <span className="text-lg leading-none">{locating ? '⏳' : '📍'}</span>
        <span>{locating ? 'Detecting location…' : 'Use my current location'}</span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">or search manually</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Search input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base leading-none">
          🔍
        </span>
        <input
          className="input text-base pl-10"
          placeholder="Search city, town…"
          value={value}
          autoComplete="off"
          onChange={(e) => { onChange(e.target.value); setOpen(true); setHighlighted(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
          {filtered.map((city, i) => (
            <button
              key={city}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); select(city); }}
              onMouseEnter={() => setHighlighted(i)}
              className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2.5 transition-colors border-b border-gray-50 last:border-0 ${
                highlighted === i ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-50 text-gray-800'
              }`}
            >
              <span className="text-brand-400 shrink-0">📍</span>
              {city}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {open && value.trim() && filtered.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-4 text-center text-sm text-gray-500">
          No results for &quot;{value}&quot;
        </div>
      )}
    </div>
  );
}
