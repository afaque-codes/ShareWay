import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Loader2, Compass } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function LocationSelector({
  label,
  value = '',
  onChange,
  placeholder = 'Search location, city, or landmark...',
  markerColor = '#008f87',
  required = false,
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Sync internal state when external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Fetch suggestions with debouncing
  const fetchSuggestions = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await apiFetch(
        `/api/rides/places?q=${encodeURIComponent(searchTerm || '')}`
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setSuggestions(data.data.places || []);
      }
    } catch (err) {
      console.warn('Failed to fetch location suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    setActiveIndex(-1);

    // Call onChange with text and null coords until user selects a place
    if (onChange) {
      onChange(val, null);
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 250);
  };

  const handleSelect = (place) => {
    const chosenAddress = place.fullAddress || place.name;
    setQuery(chosenAddress);
    setIsOpen(false);
    setActiveIndex(-1);

    if (onChange) {
      onChange(chosenAddress, place.coords);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    if (onChange) {
      onChange('', null);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
        fetchSuggestions(query);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative space-y-1" ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-gray-500 mb-1">
          {label}
        </label>
      )}

      {/* Input Field */}
      <div className="relative flex items-center border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-[#008f87] focus-within:ring-2 focus-within:ring-[#008f87]/15 transition-all">
        <div
          className="w-2.5 h-2.5 rounded-full mr-2.5 shrink-0"
          style={{ backgroundColor: markerColor }}
        />

        <input
          type="text"
          required={required}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            if (suggestions.length === 0) {
              fetchSuggestions(query);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full text-xs font-semibold text-[#0b2b3d] bg-transparent focus:outline-none placeholder-gray-400"
          autoComplete="off"
        />

        {/* Status Indicators / Buttons */}
        <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
          {loading && <Loader2 className="w-3.5 h-3.5 text-[#008f87] animate-spin" />}
          {query && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 space-y-1 z-50 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#008f87]" />
              <span>{query ? 'Matching Locations' : 'Popular Departure Hubs'}</span>
            </span>
            <span>{suggestions.length} places</span>
          </div>

          {suggestions.length > 0 ? (
            suggestions.map((place, index) => {
              const isSelected = index === activeIndex;

              return (
                <button
                  key={`${place.name}-${index}`}
                  type="button"
                  onClick={() => handleSelect(place)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#e6f6f5] text-[#008f87]'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5 text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-[#008f87]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#0b2b3d] truncate">
                        {place.name}
                      </span>
                      {place.city && (
                        <span className="text-[10px] font-semibold text-[#008f87] bg-white border border-[#008f87]/20 px-1.5 py-0.5 rounded-md shrink-0">
                          {place.city}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      {place.fullAddress.startsWith(place.name)
                        ? place.fullAddress.slice(place.name.length).replace(/^[,\s]+/, '') || place.city
                        : place.fullAddress}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-gray-400 space-y-1">
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-[#008f87] py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching locations...</span>
                </div>
              ) : (
                <p>No matching locations found for "{query}". You can continue with this custom address.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
