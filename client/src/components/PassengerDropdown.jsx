import React, { useState, useRef, useEffect } from 'react';
import { Users, ChevronDown, Check, User, Plus, Minus } from 'lucide-react';

const passengerOptions = [
  { value: 1, label: '1 Passenger', desc: 'Solo traveler (1 seat)' },
  { value: 2, label: '2 Passengers', desc: 'Two travelers (2 seats)' },
  { value: 3, label: '3 Passengers', desc: 'Small group (3 seats)' },
  { value: 4, label: '4+ Passengers', desc: 'Family or group (4+ seats)' },
];

export default function PassengerDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const selectedOption =
    passengerOptions.find((opt) => opt.label === value || opt.value === Number(value)) ||
    passengerOptions[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between border rounded-xl px-4 py-3.5 text-left transition-all cursor-pointer ${
          isOpen
            ? 'border-[#008f87] ring-2 ring-[#008f87]/15 bg-white shadow-xs'
            : 'border-gray-200 hover:border-gray-300 bg-[#fafbfb]'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#e6f6f5] text-[#008f87] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="block text-sm font-semibold text-[#0b2b3d]">
              {selectedOption.label}
            </span>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#008f87]' : ''
          }`}
        />
      </button>

      {/* Custom Popover Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-xl shadow-gray-300/50 border border-gray-100 p-2.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
            Number of Seats
          </div>

          {passengerOptions.map((opt) => {
            const isSelected = selectedOption.value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.label);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#e6f6f5] text-[#008f87]'
                    : 'hover:bg-gray-50 text-[#0b2b3d]'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-[#008f87] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {opt.value}
                  </div>
                  <div>
                    <div className="text-sm font-bold leading-tight">{opt.label}</div>
                    <div className="text-xs text-gray-500 leading-tight mt-0.5">{opt.desc}</div>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-[#008f87] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
