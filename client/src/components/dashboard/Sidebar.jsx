import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  CalendarCheck,
  MessageSquare,
  User,
  Bell,
  BellRing,
  Car,
  PlusCircle,
  Clock,
  Shield,
  Users,
  AlertTriangle,
  Megaphone,
  BarChart3,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const role = (user.role || 'PASSENGER').toUpperCase();

  // Navigation items defined per role
  const passengerNav = [
    { name: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
    { name: 'My Bookings', to: '/dashboard/bookings', icon: CalendarCheck },
    { name: 'Ride Alerts', to: '/dashboard/alerts', icon: BellRing },
    { name: 'Messages', to: '/dashboard/messages', icon: MessageSquare },
    { name: 'Notifications', to: '/dashboard/notifications', icon: Bell },
    { name: 'My Profile', to: '/dashboard/profile', icon: User },
  ];

  const driverNav = [
    { name: 'Driver Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
    { name: 'My Published Rides', to: '/dashboard/my-rides', icon: Car },
    { name: 'Create a Ride', to: '/dashboard/create-ride', icon: PlusCircle },
    { name: 'Ride Requests', to: '/dashboard/requests', icon: Clock },
    { name: 'Vehicle Details', to: '/dashboard/vehicle', icon: Shield },
    { name: 'Messages', to: '/dashboard/messages', icon: MessageSquare },
    { name: 'Driver Profile', to: '/dashboard/profile', icon: User },
  ];

  const adminNav = [
    { name: 'Admin Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
    { name: 'User Management', to: '/dashboard/admin/users', icon: Users },
    { name: 'Ride Management', to: '/dashboard/admin/rides', icon: Car },
    { name: 'Safety Reports', to: '/dashboard/admin/reports', icon: AlertTriangle },
    { name: 'Announcements', to: '/dashboard/admin/announcements', icon: Megaphone },
    { name: 'Analytics', to: '/dashboard/admin/analytics', icon: BarChart3 },
    { name: 'My Profile', to: '/dashboard/profile', icon: User },
  ];

  const navItems = role === 'ADMIN' ? adminNav : role === 'DRIVER' ? driverNav : passengerNav;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#061822]/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/shareway-logo.svg"
              alt="ShareWay"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Pill */}
        <div className="px-6 py-4 border-b border-gray-50">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f4faf9] border border-[#d0ece8]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#008f87] animate-pulse"></span>
              <span className="text-xs font-bold text-[#0b2b3d] tracking-wide">
                {role} WORKSPACE
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#008f87] px-2 py-0.5 rounded-md bg-white border border-[#b2e5df]">
              Active
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-[#008f87] text-white shadow-xs'
                      : 'text-[#475f6e] hover:bg-gray-50 hover:text-[#0b2b3d]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#008f87]'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer: User Profile & Logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#008f87] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-[#0b2b3d] truncate">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
