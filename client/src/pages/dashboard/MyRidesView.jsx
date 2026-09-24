import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import {
  Car,
  PlusCircle,
  Calendar,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Loader2,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

export default function MyRidesView() {
  const [tab, setTab] = useState('active'); // 'active' | 'drafts' | 'history'
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionRideId, setActionRideId] = useState(null);

  const fetchRides = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/api/rides/my-rides');
      const data = await res.json();
      if (res.ok && data.success) {
        setRides(data.data.rides || []);
      } else {
        setError(data.error?.message || 'Unable to fetch your rides.');
      }
    } catch (err) {
      setError('Network error loading rides.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handlePublishDraft = async (rideId) => {
    setActionRideId(rideId);
    try {
      const res = await apiFetch(`/api/rides/${rideId}/publish`, {
        method: 'PATCH',
      });
      if (res.ok) {
        fetchRides();
      }
    } catch (err) {
      alert('Failed to publish ride.');
    } finally {
      setActionRideId(null);
    }
  };

  const handleCancelOrDelete = async (rideId, isDraft) => {
    const confirmMsg = isDraft
      ? 'Are you sure you want to delete this draft ride?'
      : 'Are you sure you want to cancel this published ride?';

    if (!window.confirm(confirmMsg)) return;

    setActionRideId(rideId);
    try {
      const res = await apiFetch(`/api/rides/${rideId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchRides();
      }
    } catch (err) {
      alert('Action failed.');
    } finally {
      setActionRideId(null);
    }
  };

  // Group rides into tabs
  const activeRides = rides.filter(
    (r) => r.status === 'PUBLISHED' || r.status === 'IN_PROGRESS'
  );
  const draftRides = rides.filter((r) => r.status === 'DRAFT');
  const historyRides = rides.filter(
    (r) => r.status === 'COMPLETED' || r.status === 'CANCELLED'
  );

  const displayedRides =
    tab === 'active' ? activeRides : tab === 'drafts' ? draftRides : historyRides;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0b2b3d]">My Published Rides</h2>
          <p className="text-sm text-[#475f6e] mt-1">
            Manage your routes, departure times, and passenger seating.
          </p>
        </div>

        <Link
          to="/dashboard/create-ride"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-xs shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish a Ride</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'active'
              ? 'bg-[#008f87] text-white shadow-xs'
              : 'text-gray-500 hover:text-[#0b2b3d]'
          }`}
        >
          Active Rides ({activeRides.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('drafts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'drafts'
              ? 'bg-[#008f87] text-white shadow-xs'
              : 'text-gray-500 hover:text-[#0b2b3d]'
          }`}
        >
          Drafts ({draftRides.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'history'
              ? 'bg-[#008f87] text-white shadow-xs'
              : 'text-gray-500 hover:text-[#0b2b3d]'
          }`}
        >
          Past & Cancelled ({historyRides.length})
        </button>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="p-12 text-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#008f87] mb-2" />
          <p className="text-xs font-semibold">Loading your routes...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Rides List */}
      {!loading && !error && displayedRides.length > 0 && (
        <div className="space-y-4">
          {displayedRides.map((ride) => {
            const departure = new Date(ride.departureTime);
            const dateStr = departure.toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });
            const timeStr = departure.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={ride._id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        ride.status === 'PUBLISHED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ride.status === 'DRAFT'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {ride.status}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      {dateStr} at {timeStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-lg font-black text-[#008f87]">
                      ₹{ride.pricePerSeat}{' '}
                      <span className="text-[11px] font-medium text-gray-400">/ seat</span>
                    </div>
                  </div>
                </div>

                {/* Route Visualization */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#008f87]" />
                        <div className="w-0.5 h-6 bg-gray-200" />
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      </div>

                      <div className="space-y-2 flex-1 text-sm font-semibold text-[#0b2b3d]">
                        <div>{ride.originAddress}</div>
                        <div>{ride.destinationAddress}</div>
                      </div>
                    </div>

                    {/* Distance & Duration Badges */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                      {ride.distanceKm && (
                        <span className="flex items-center gap-1 font-semibold text-gray-600">
                          <Navigation className="w-3.5 h-3.5 text-[#008f87]" />
                          {ride.distanceKm} km
                        </span>
                      )}
                      {ride.durationMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {Math.floor(ride.durationMinutes / 60)}h {ride.durationMinutes % 60}m
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        {ride.availableSeats} of {ride.totalSeats} seats open
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="sm:col-span-4 flex sm:flex-col items-end justify-between gap-2 pt-2 sm:pt-0">
                    {ride.status === 'DRAFT' && (
                      <button
                        type="button"
                        disabled={actionRideId === ride._id}
                        onClick={() => handlePublishDraft(ride._id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        {actionRideId === ride._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Publish Now</span>
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={actionRideId === ride._id}
                      onClick={() => handleCancelOrDelete(ride._id, ride.status === 'DRAFT')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{ride.status === 'DRAFT' ? 'Delete Draft' : 'Cancel Ride'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && displayedRides.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#e6f6f5] text-[#008f87] mx-auto flex items-center justify-center">
            <Car className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#0b2b3d]">
              {tab === 'active'
                ? 'No Active Rides Published'
                : tab === 'drafts'
                ? 'No Draft Rides'
                : 'No Past Rides'}
            </h3>
            <p className="text-sm text-[#475f6e]">
              Publish your commute route to start receiving passenger requests and offsetting your travel expenses.
            </p>
          </div>
          {tab !== 'history' && (
            <div className="pt-2">
              <Link
                to="/dashboard/create-ride"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Publish a New Ride</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
