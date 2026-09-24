import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Car,
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRight,
  ArrowUpDown,
  Leaf,
  Circle,
  ShieldCheck,
} from 'lucide-react';
import PassengerDropdown from './PassengerDropdown';
import LocationSelector from './LocationSelector';

export default function Hero() {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('find'); // 'find' | 'offer'
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  
  // Default to today's date formatted YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  const [travelDate, setTravelDate] = useState(today);
  const [passengers, setPassengers] = useState('1 Passenger');

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleCtaClick = (targetRole) => {
    if (!user) {
      openAuthModal('login', targetRole);
      return;
    }
    if (targetRole === 'DRIVER') {
      if (user.role === 'DRIVER') {
        navigate('/driver/create-ride');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/rides');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#eaf6f4] via-[#f4faf9] to-[#ffffff] pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Scenic Mountain Highway Backdrop (Matching Reference) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
          alt="Scenic Mountain Road"
          className="w-full h-full object-cover object-right opacity-20 filter saturate-150 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4faf9] via-[#f4faf9]/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-[#d0ece8] text-xs font-bold text-[#008f87] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#40ab50] animate-pulse"></span>
              <span>Trusted by thousands • Safe • Affordable • Greener Planet</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0b2b3d] tracking-tight leading-[1.12]">
              Rides Together <br />
              For a Better{' '}
              <span className="text-[#008f87] relative inline-block">
                Tomorrow
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3 text-[#40ab50]/40 -z-10"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="6" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#475f6e] leading-relaxed max-w-xl">
              ShareWay connects drivers and passengers for affordable, safe, and comfortable rides.
              Save money, meet new people, and make a positive impact on the environment.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleCtaClick('PASSENGER')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Find a Ride</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleCtaClick('DRIVER')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/90 backdrop-blur-xs hover:bg-white text-[#008f87] border border-[#008f87] font-bold text-sm shadow-xs transition-all cursor-pointer"
              >
                Offer a Ride
              </button>
            </div>

            {/* Impact Metric Counters */}
            <div className="pt-6 border-t border-gray-200/80 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#008f87]/10 flex items-center justify-center text-[#008f87]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-extrabold text-[#0b2b3d]">10K+</div>
                  <div className="text-xs font-semibold text-[#475f6e]">Active Users</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#40ab50]/10 flex items-center justify-center text-[#40ab50]">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-extrabold text-[#0b2b3d]">25K+</div>
                  <div className="text-xs font-semibold text-[#475f6e]">Rides Shared</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00a89d]/10 flex items-center justify-center text-[#008f87]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-extrabold text-[#0b2b3d]">150+ Tons</div>
                  <div className="text-xs font-semibold text-[#475f6e]">CO₂ Saved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Search Ride Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-[#0b2b3d]/10 border border-white p-6 sm:p-8 relative">
              
              {/* Tab Selector */}
              <div className="grid grid-cols-2 border-b border-gray-100 pb-2 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('find')}
                  className={`flex items-center justify-center gap-2 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'find'
                      ? 'border-[#008f87] text-[#008f87]'
                      : 'border-transparent text-[#475f6e] hover:text-[#0b2b3d]'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Find a Ride</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('offer')}
                  className={`flex items-center justify-center gap-2 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'offer'
                      ? 'border-[#008f87] text-[#008f87]'
                      : 'border-transparent text-[#475f6e] hover:text-[#0b2b3d]'
                  }`}
                >
                  <Leaf className="w-4 h-4" />
                  <span>Offer a Ride</span>
                </button>
              </div>

              {/* Search Form Fields */}
              <div className="space-y-4">
                {/* Origin Field */}
                <div className="relative">
                  <LocationSelector
                    label="From"
                    value={fromLocation}
                    onChange={(val) => setFromLocation(val)}
                    placeholder="Leaving from..."
                    markerColor="#0b2b3d"
                  />

                  {/* Swap Button */}
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="absolute right-3 -bottom-3 z-20 p-1.5 bg-white border border-gray-200 rounded-full shadow-md text-[#008f87] hover:bg-[#e6f6f5] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    title="Swap locations"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Destination Field */}
                <div>
                  <LocationSelector
                    label="To"
                    value={toLocation}
                    onChange={(val) => setToLocation(val)}
                    placeholder="Going to..."
                    markerColor="#ef4444"
                  />
                </div>

                {/* Date & Custom Passengers Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Styled Date Input */}
                  <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3.5 focus-within:border-[#008f87] focus-within:ring-2 focus-within:ring-[#008f87]/15 transition-all bg-[#fafbfb] focus-within:bg-white">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center mr-3 shrink-0">
                      <Calendar className="w-4 h-4 text-[#475f6e]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Date</label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full text-sm font-semibold text-[#0b2b3d] bg-transparent focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Modern Custom Passenger Dropdown */}
                  <div>
                    <PassengerDropdown
                      value={passengers}
                      onChange={(val) => setPassengers(val)}
                    />
                  </div>
                </div>

                {/* Search / Publish Action Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'offer') {
                      if (!user) {
                        openAuthModal('login', 'DRIVER');
                      } else if (user.role === 'DRIVER') {
                        navigate('/driver/create-ride');
                      } else {
                        navigate('/dashboard');
                      }
                    } else {
                      navigate(`/rides?origin=${encodeURIComponent(fromLocation)}&destination=${encodeURIComponent(toLocation)}&date=${travelDate}`);
                    }
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-[#008f87] hover:bg-[#00736c] active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-[#008f87]/25 hover:shadow-xl transition-all cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                  <span>{activeTab === 'find' ? 'Search Rides' : 'Publish Ride'}</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
