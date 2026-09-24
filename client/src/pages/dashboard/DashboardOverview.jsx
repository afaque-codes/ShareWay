import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  AlertTriangle,
  Megaphone,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function DashboardOverview() {
  const { user, driver } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0b2b3d] to-[#134e6f] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#008f87]/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-bold text-[#00a89d]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{user.role} PORTAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.firstName}!
            </h2>
            <p className="text-sm text-gray-300 max-w-xl">
              {user.role === 'DRIVER'
                ? 'Manage your routes, review booking requests from community members, and track your travel offsets.'
                : user.role === 'ADMIN'
                ? 'System overview, user verification queues, safety reports, and platform health metrics.'
                : 'Search affordable community rides, manage your upcoming trips, and connect with verified drivers.'}
            </p>
          </div>

          <div className="shrink-0">
            {user.role === 'DRIVER' ? (
              <Link
                to="/dashboard/create-ride"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create a Ride</span>
              </Link>
            ) : user.role === 'ADMIN' ? (
              <Link
                to="/dashboard/admin/reports"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Review Reports</span>
              </Link>
            ) : (
              <Link
                to="/rides"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Find a Ride</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* DRIVER STATS & VIEWS */}
      {/* ============================================================== */}
      {user.role === 'DRIVER' && (
        <>
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
                <span className="text-xs font-bold uppercase text-gray-400">Est. Fuel Offset</span>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">₹0</div>
              <div className="text-xs text-gray-400 mt-1">Total earned via shared rides</div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/dashboard/create-ride"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e6f6f5] text-[#008f87] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0b2b3d]">Publish a New Route</h4>
                  <p className="text-xs text-gray-400">Offer empty seats on your upcoming journey</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#008f87] group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/dashboard/requests"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f2faf3] text-[#40ab50] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0b2b3d]">Pending Passenger Requests</h4>
                  <p className="text-xs text-gray-400">Accept or decline co-traveler bookings</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#40ab50] group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* PASSENGER STATS & VIEWS */}
      {/* ============================================================== */}
      {user.role === 'PASSENGER' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between text-[#008f87]">
                <span className="text-xs font-bold uppercase text-gray-400">Upcoming Trips</span>
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">0</div>
              <div className="text-xs text-gray-400 mt-1">No confirmed trips scheduled</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between text-[#40ab50]">
                <span className="text-xs font-bold uppercase text-gray-400">CO₂ Saved</span>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">0 kg</div>
              <div className="text-xs text-gray-400 mt-1">Carpooling reduces carbon footprints</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between text-[#008f87]">
                <span className="text-xs font-bold uppercase text-gray-400">Passenger Rating</span>
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">
                {user.averageRating > 0 ? user.averageRating.toFixed(1) : '5.0'} ★
              </div>
              <div className="text-xs text-gray-400 mt-1">{user.totalRatings} ratings received</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/rides"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e6f6f5] text-[#008f87] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0b2b3d]">Find Rides</h4>
                  <p className="text-xs text-gray-400">Search marketplace & book seats</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#008f87] group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/dashboard/bookings"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0b2b3d]">My Bookings</h4>
                  <p className="text-xs text-gray-400">View confirmed and past journey tickets</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/dashboard/alerts"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#40ab50] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0b2b3d]">Route Alerts</h4>
                  <p className="text-xs text-gray-400">Automated alerts for your commute</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#40ab50] group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* ADMIN STATS & VIEWS */}
      {/* ============================================================== */}
      {user.role === 'ADMIN' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-[#0b2b3d]">
              <span className="text-xs font-bold uppercase text-gray-400">Platform Users</span>
              <Users className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">Active</div>
            <div className="text-xs text-gray-400 mt-1">Drivers & Passengers</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-[#008f87]">
              <span className="text-xs font-bold uppercase text-gray-400">Live Rides</span>
              <Car className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">Active</div>
            <div className="text-xs text-gray-400 mt-1">Real-time journeys scheduled</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-xs font-bold uppercase text-gray-400">Safety Reports</span>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold text-[#0b2b3d] mt-2">0</div>
            <div className="text-xs text-gray-400 mt-1">All reports resolved</div>
          </div>
        </div>
      )}

    </div>
  );
}
