import React, { useState } from 'react';
import { Users, Car, AlertTriangle, Megaphone, BarChart3, ShieldCheck, Check, Ban } from 'lucide-react';

export default function AdminView({ section = 'users' }) {
  const [activeTab, setActiveTab] = useState(section);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-extrabold text-[#0b2b3d]">Admin Control Panel</h2>
        <p className="text-sm text-[#475f6e] mt-1">
          Manage system users, published rides, safety reports, and platform health.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { key: 'users', label: 'User Moderation', icon: Users },
          { key: 'rides', label: 'Ride Listings', icon: Car },
          { key: 'reports', label: 'Safety Reports (0)', icon: AlertTriangle },
          { key: 'announcements', label: 'Broadcasts', icon: Megaphone },
          { key: 'analytics', label: 'Platform Stats', icon: BarChart3 },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#008f87] text-white shadow-xs'
                  : 'text-gray-500 hover:text-[#0b2b3d] hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* User Management Table */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0b2b3d]">Registered Platform Members</h3>
            <span className="text-xs text-gray-400">Total: 3 accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Member</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                <tr>
                  <td className="px-6 py-4 font-bold text-[#0b2b3d]">John Driver</td>
                  <td className="px-6 py-4">driver@shareway.com</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">DRIVER</span></td>
                  <td className="px-6 py-4"><span className="text-emerald-600 font-bold">Active</span></td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-red-500 hover:underline font-bold">Suspend</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-[#0b2b3d]">Jane Passenger</td>
                  <td className="px-6 py-4">passenger@shareway.com</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">PASSENGER</span></td>
                  <td className="px-6 py-4"><span className="text-emerald-600 font-bold">Active</span></td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-red-500 hover:underline font-bold">Suspend</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports View */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#0b2b3d]">All Reports Clear</h3>
          <p className="text-xs text-gray-500">There are no pending user safety flags or route violations to review.</p>
        </div>
      )}

      {/* Platform Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="text-xs font-bold text-gray-400 uppercase">Registered Users</div>
            <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">10,480</div>
            <div className="text-xs text-emerald-600 mt-1">↑ 12% this month</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="text-xs font-bold text-gray-400 uppercase">Completed Rides</div>
            <div className="text-3xl font-extrabold text-[#008f87] mt-2">25,820</div>
            <div className="text-xs text-emerald-600 mt-1">↑ 18% this month</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="text-xs font-bold text-gray-400 uppercase">Total CO₂ Saved</div>
            <div className="text-3xl font-extrabold text-[#40ab50] mt-2">154.2 Tons</div>
            <div className="text-xs text-gray-400 mt-1">Environmental impact</div>
          </div>
        </div>
      )}
    </div>
  );
}
