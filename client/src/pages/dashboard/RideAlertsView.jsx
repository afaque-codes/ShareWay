import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  MapPin,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const INITIAL_ALERTS = [
  {
    id: 'alert-1',
    from: 'Connaught Place, Delhi',
    to: 'Clock Tower, Dehradun',
    maxPrice: 400,
    preferredTime: 'Morning (Before 10 AM)',
    isActive: true,
    lastTriggered: 'Yesterday (2 new rides found)',
    matchesCount: 2,
  },
  {
    id: 'alert-2',
    from: 'Bandra West, Mumbai',
    to: 'Shivajinagar, Pune',
    maxPrice: 300,
    preferredTime: 'Friday Evening (After 5 PM)',
    isActive: true,
    lastTriggered: '3 days ago',
    matchesCount: 5,
  },
];

export default function RideAlertsView() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [maxPrice, setMaxPrice] = useState('400');
  const [preferredTime, setPreferredTime] = useState('Anytime');

  const handleToggle = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const handleDelete = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreateAlert = (e) => {
    e.preventDefault();
    if (!from || !to) return;

    const newAlert = {
      id: `alert-${Date.now()}`,
      from,
      to,
      maxPrice: Number(maxPrice) || 400,
      preferredTime,
      isActive: true,
      lastTriggered: 'Just created',
      matchesCount: 0,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setFrom('');
    setTo('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0b2b3d]">Route Alerts & Commutes</h2>
          <p className="text-sm text-[#475f6e] mt-1">
            Get instant notifications when drivers publish rides matching your routine commute.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Route Alert</span>
        </button>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-2xl bg-[#e6f6f5] border border-[#008f87]/20 flex items-start gap-3">
        <BellRing className="w-5 h-5 text-[#008f87] shrink-0 mt-0.5" />
        <div className="text-xs text-[#0b2b3d] leading-relaxed">
          <span className="font-bold">How Route Alerts Work:</span> We continuously match new published rides against your saved preferences. If a driver offers seats within your price limit, you'll receive a real-time notification with a direct booking shortcut.
        </div>
      </div>

      {/* Create Alert Modal / Popover */}
      {showCreateModal && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-base font-extrabold text-[#0b2b3d]">Set Up a New Route Alert</h3>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateAlert} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Leaving From *</label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:border-[#008f87]">
                <MapPin className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Connaught Place, Delhi"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full text-xs font-semibold text-[#0b2b3d] bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Going To *</label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:border-[#008f87]">
                <MapPin className="w-4 h-4 text-[#008f87] mr-2 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Clock Tower, Dehradun"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full text-xs font-semibold text-[#0b2b3d] bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Max Budget (₹)</label>
              <input
                type="number"
                min="50"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#0b2b3d] bg-gray-50 focus:bg-white focus:border-[#008f87] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Preferred Time</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#0b2b3d] bg-gray-50 focus:bg-white focus:border-[#008f87] focus:outline-none cursor-pointer"
              >
                <option value="Anytime">Anytime</option>
                <option value="Morning (Before 12 PM)">Morning (Before 12 PM)</option>
                <option value="Afternoon (12 PM - 6 PM)">Afternoon (12 PM - 6 PM)</option>
                <option value="Evening (After 6 PM)">Evening (After 6 PM)</option>
              </select>
            </div>

            <div className="sm:col-span-2 pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#008f87] hover:bg-[#00736c] shadow-xs transition-all cursor-pointer"
              >
                Save Route Alert
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Alerts Listing */}
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-3xl p-5 border transition-all space-y-3 ${
                alert.isActive
                  ? 'border-gray-100 shadow-sm'
                  : 'border-gray-200 bg-gray-50/50 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#e6f6f5] text-[#008f87] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#0b2b3d] text-sm">
                        {alert.from}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-extrabold text-[#0b2b3d] text-sm">
                        {alert.to}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span>Max ₹{alert.maxPrice}</span>
                      <span>•</span>
                      <span>{alert.preferredTime}</span>
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  {/* Status Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggle(alert.id)}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    {alert.isActive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-emerald-700">Active</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                        <span className="text-gray-500">Paused</span>
                      </>
                    )}
                  </button>

                  {/* Search Live Route */}
                  <Link
                    to={`/rides?origin=${encodeURIComponent(alert.from)}&destination=${encodeURIComponent(alert.to)}`}
                    className="p-2 rounded-xl text-[#008f87] hover:bg-[#e6f6f5] transition-colors"
                    title="View matching rides now"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(alert.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span>Last updated: {alert.lastTriggered}</span>
                {alert.matchesCount > 0 && (
                  <Link
                    to={`/rides?origin=${encodeURIComponent(alert.from)}&destination=${encodeURIComponent(alert.to)}`}
                    className="font-bold text-[#008f87] hover:underline"
                  >
                    View {alert.matchesCount} matching rides available ➔
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-[#0b2b3d] text-base">No Route Alerts Active</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Create an alert for your frequent commute. We'll automatically notify you as soon as a driver offers a ride.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008f87] text-white text-xs font-bold hover:bg-[#00736c] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Route Alert</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
