import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, User, Car } from 'lucide-react';

export default function RequestsView() {
  const [tab, setTab] = useState('pending');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-extrabold text-[#0b2b3d]">Passenger Requests</h2>
        <p className="text-sm text-[#475f6e] mt-1">
          Review incoming seat booking requests from passengers for your published rides.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'pending'
              ? 'bg-[#008f87] text-white shadow-xs'
              : 'text-gray-500 hover:text-[#0b2b3d]'
          }`}
        >
          Pending (0)
        </button>
        <button
          type="button"
          onClick={() => setTab('accepted')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'accepted'
              ? 'bg-[#008f87] text-white shadow-xs'
              : 'text-gray-500 hover:text-[#0b2b3d]'
          }`}
        >
          Accepted History
        </button>
        <button
          type="button"
          onClick={() => setTab('declined')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'declined'
              ? 'bg-[#008f87] text-white shadow-xs'
              : 'text-gray-500 hover:text-[#0b2b3d]'
          }`}
        >
          Declined
        </button>
      </div>

      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs space-y-4 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#e6f6f5] text-[#008f87] mx-auto flex items-center justify-center">
          <Clock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#0b2b3d]">No Pending Requests</h3>
          <p className="text-sm text-[#475f6e]">
            When passengers request to join your upcoming rides, you'll be able to review their profiles and accept them here.
          </p>
        </div>
      </div>
    </div>
  );
}
