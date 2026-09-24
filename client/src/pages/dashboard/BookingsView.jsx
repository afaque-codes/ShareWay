import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Search, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function BookingsView() {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0b2b3d]">My Bookings</h2>
          <p className="text-sm text-[#475f6e] mt-1">
            Track and manage your upcoming journeys and booking history.
          </p>
        </div>

        <Link
          to="/dashboard/find"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-xs shadow-sm transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Book a Ride</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-[#008f87] text-white shadow-xs'
              : 'text-gray-500 hover:text-[#0b2b3d]'
          }`}
        >
          Upcoming Rides (0)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'past'
              ? 'bg-[#008f87] text-white shadow-xs'
              : 'text-gray-500 hover:text-[#0b2b3d]'
          }`}
        >
          Completed History
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'cancelled'
              ? 'bg-[#008f87] text-white shadow-xs'
              : 'text-gray-500 hover:text-[#0b2b3d]'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#e6f6f5] text-[#008f87] mx-auto flex items-center justify-center">
          <CalendarCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#0b2b3d]">No Upcoming Rides Booked</h3>
          <p className="text-sm text-[#475f6e]">
            You don't have any confirmed rides right now. Find a carpool route heading to your destination.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/dashboard/find"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-sm shadow-md transition-all"
          >
            <span>Explore Available Rides</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
