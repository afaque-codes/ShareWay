import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Car,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  PlusCircle,
  Search,
  CheckCircle,
  TrendingUp,
  Settings,
  AlertTriangle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, driver } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#008f87] text-white flex items-center justify-center font-extrabold text-2xl uppercase shadow-md shadow-[#008f87]/20">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2b3d]">
                  Welcome back, {user.firstName}!
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e6f6f5] text-[#008f87] border border-[#b2e5df]">
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-[#475f6e] mt-1">{user.email}</p>
            </div>
          </div>

          {/* Role-Specific Quick Action */}
          <div>
            {user.role === 'DRIVER' ? (
              <a
                href="#offer-ride"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-sm shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish New Ride</span>
              </a>
            ) : user.role === 'ADMIN' ? (
              <a
                href="#admin-settings"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0b2b3d] hover:bg-[#153a50] text-white font-bold text-sm shadow-md transition-all"
              >
                <Settings className="w-4 h-4" />
                <span>Admin Settings</span>
              </a>
            ) : (
              <a
                href="#find-rides"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-sm shadow-md transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Search Rides</span>
              </a>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* DRIVER DASHBOARD VIEW */}
        {/* ============================================================== */}
        {user.role === 'DRIVER' && (
          <div className="space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between text-[#008f87]">
                  <span className="text-xs font-bold uppercase text-gray-400">Total Rides</span>
                  <Car className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">0</div>
                <div className="text-xs text-gray-400 mt-1">Ready to create your first ride</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between text-[#40ab50]">
                  <span className="text-xs font-bold uppercase text-gray-400">Driver Rating</span>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">
                  {user.averageRating > 0 ? user.averageRating.toFixed(1) : '5.0'} ★
                </div>
                <div className="text-xs text-gray-400 mt-1">{user.totalRatings} ratings received</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between text-[#008f87]">
                  <span className="text-xs font-bold uppercase text-gray-400">Verification</span>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="text-lg font-bold text-[#0b2b3d] mt-2">
                  {driver?.isVerified ? (
                    <span className="text-green-600">Verified Driver</span>
                  ) : (
                    <span className="text-amber-600">Verification Pending</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">License: {driver?.licenseNumber || 'Active'}</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between text-purple-600">
                  <span className="text-xs font-bold uppercase text-gray-400">Earnings (est.)</span>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">₹0</div>
                <div className="text-xs text-gray-400 mt-1">Offset your travel costs</div>
              </div>
            </div>

            {/* Empty state prompt */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#e6f6f5] text-[#008f87] mx-auto flex items-center justify-center">
                <Car className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0b2b3d]">No Active Rides Scheduled</h3>
              <p className="text-sm text-[#475f6e] max-w-md mx-auto">
                You haven't published any rides yet. Share your daily commute or road trip route to start receiving requests from passengers.
              </p>
              <a
                href="#offer-ride"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Publish a Ride Now</span>
              </a>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PASSENGER DASHBOARD VIEW */}
        {/* ============================================================== */}
        {user.role === 'PASSENGER' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between text-[#008f87]">
                  <span className="text-xs font-bold uppercase text-gray-400">Upcoming Trips</span>
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">0</div>
                <div className="text-xs text-gray-400 mt-1">No confirmed trips yet</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between text-[#40ab50]">
                  <span className="text-xs font-bold uppercase text-gray-400">CO₂ Saved</span>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">0 kg</div>
                <div className="text-xs text-gray-400 mt-1">Carpooling cuts emissions</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between text-[#008f87]">
                  <span className="text-xs font-bold uppercase text-gray-400">Rider Rating</span>
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">
                  {user.averageRating > 0 ? user.averageRating.toFixed(1) : '5.0'} ★
                </div>
                <div className="text-xs text-gray-400 mt-1">{user.totalRatings} ratings</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#e6f6f5] text-[#008f87] mx-auto flex items-center justify-center">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0b2b3d]">Where are you heading next?</h3>
              <p className="text-sm text-[#475f6e] max-w-md mx-auto">
                Search available community rides on popular routes and travel affordably while making friends.
              </p>
              <a
                href="#find-rides"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Search Available Rides</span>
              </a>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ADMIN DASHBOARD VIEW */}
        {/* ============================================================== */}
        {user.role === 'ADMIN' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between text-[#0b2b3d]">
                  <span className="text-xs font-bold uppercase text-gray-400">System Users</span>
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">Platform Active</div>
                <div className="text-xs text-gray-400 mt-1">Passengers & Drivers</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between text-[#008f87]">
                  <span className="text-xs font-bold uppercase text-gray-400">Total Rides</span>
                  <Car className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">Active</div>
                <div className="text-xs text-gray-400 mt-1">Platform-wide listings</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between text-amber-500">
                  <span className="text-xs font-bold uppercase text-gray-400">Reports</span>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">0</div>
                <div className="text-xs text-gray-400 mt-1">No pending safety flags</div>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
