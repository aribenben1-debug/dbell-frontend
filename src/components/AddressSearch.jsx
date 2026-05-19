import { useState, useEffect, useRef } from 'react';

export default function AddressSearch({ value, onChange, city }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
  const debounceRef = useRef();

  useEffect(() => {
    function onDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (value.trim().length < 3) { setSuggestions([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const q = city ? `${value}, ${city}, Israel` : `${value}, Israel`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=il&limit=6&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [value, city]);

  function select(item) {
    const { road, house_number } = item.address || {};
    const street = road
      ? house_number ? `${road} ${house_number}` : road
      : item.display_name.split(',')[0];
    onChange(street);
    setOpen(false);
  }

  function formatLabel(item) {
    const { road, house_number } = item.address || {};
    return road
      ? house_number ? `${road} ${house_number}` : road
      : item.display_name.split(',')[0];
  }

  function formatSub(item) {
    const { city: c, town, village, municipality, suburb } = item.address || {};
    return c || town || village || municipality || suburb || '';
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          className="input text-base"
          placeholder="Street, number, apartment…"
          value={value}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs animate-pulse">
            ⏳
          </span>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
          {suggestions.map((s) => (
            <button
              key={s.place_id}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); select(s); }}
              className="w-full text-left px-4 py-3 hover:bg-brand-50 hover:text-brand-700 transition-colors border-b border-gray-50 last:border-0"
            >
              <p className="text-sm font-medium">{formatLabel(s)}</p>
              {formatSub(s) && (
                <p className="text-xs text-gray-400 mt-0.5">{formatSub(s)}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
