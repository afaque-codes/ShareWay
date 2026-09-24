import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  ExternalLink,
  Check,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react';

export default function Topbar({ onToggleMobileSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Sample placeholder notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to ShareWay! 🌱',
      message: 'Your account is ready. Explore rides or publish your route today.',
      time: 'Just now',
      unread: true,
    },
    {
      id: 2,
      title: 'Account Verified',
      message: 'Your email address has been successfully verified.',
      time: '1h ago',
      unread: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      navigate('/');
    }
  };

  // Derive current page title from pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/alerts')) return 'Route Alerts & Commutes';
    if (path.includes('/find')) return 'Find Community Rides';
    if (path.includes('/bookings')) return 'My Bookings';
    if (path.includes('/my-rides')) return 'My Published Rides';
    if (path.includes('/create-ride')) return 'Create a New Ride';
    if (path.includes('/requests')) return 'Passenger Requests';
    if (path.includes('/vehicle')) return 'Vehicle Management';
    if (path.includes('/messages')) return 'Chat & Messages';
    if (path.includes('/profile')) return 'My Profile & Settings';
    if (path.includes('/admin/users')) return 'User Management';
    if (path.includes('/admin/rides')) return 'Ride Management';
    if (path.includes('/admin/reports')) return 'Safety Reports';
    if (path.includes('/admin/announcements')) return 'Announcements';
    if (path.includes('/admin/analytics')) return 'System Analytics';
    return 'Dashboard Overview';
  };

  return (
    <header className="sticky top-0 z-40 h-20 bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      
      {/* Left: Mobile Hamburger & Page Title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#0b2b3d] leading-none">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-gray-400 mt-1 hidden sm:block">
            ShareWay Community Platform
          </p>
        </div>
      </div>

      {/* Right: Actions, Notification Bell, User Menu */}
      <div className="flex items-center gap-3">
        
        {/* Quick Action Button based on Role */}
        {user?.role === 'PASSENGER' && (
          <Link
            to="/rides"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#008f87] hover:bg-[#00736c] px-3.5 py-2 rounded-xl shadow-xs hover:shadow transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find a Ride</span>
          </Link>
        )}

        {user?.role === 'DRIVER' && (
          <Link
            to="/dashboard/create-ride"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#008f87] hover:bg-[#00736c] px-3.5 py-2 rounded-xl shadow-xs hover:shadow transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Offer a Ride</span>
          </Link>
        )}

        {/* Back to Public Site Link */}
        <Link
          to="/"
          className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-[#475f6e] hover:text-[#008f87] px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#008f87] transition-all"
        >
          <span>Homepage</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-xl text-gray-500 hover:text-[#008f87] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#008f87] text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#0b2b3d]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#e6f6f5] text-[#008f87]">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs text-[#008f87] hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border text-xs transition-colors ${
                      n.unread
                        ? 'bg-[#f4faf9] border-[#b2e5df] text-[#0b2b3d]'
                        : 'bg-white border-gray-100 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{n.title}</span>
                      <span className="text-[10px] text-gray-400">{n.time}</span>
                    </div>
                    <p className="mt-1 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center border-t border-gray-100">
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-bold text-[#008f87] hover:underline"
                >
                  View all notification history
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-full hover:bg-gray-50 border border-gray-200 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#008f87] text-white flex items-center justify-center font-bold text-xs uppercase">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </div>
            <div className="text-left text-xs hidden sm:block">
              <span className="block font-bold text-[#0b2b3d] leading-none">
                {user.firstName}
              </span>
              <span className="text-[10px] font-semibold text-[#008f87] leading-none">
                {user.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="text-xs font-bold text-[#0b2b3d]">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
              </div>

              <Link
                to="/dashboard/profile"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4 text-[#008f87]" />
                <span>My Profile & Settings</span>
              </Link>

              <div className="pt-1 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
