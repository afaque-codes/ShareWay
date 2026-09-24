import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Menu, X, User, LogOut, ChevronDown, Car, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isHome = location.pathname === '/';
  const isFindRides = location.pathname.startsWith('/rides');
  const isDashboard = location.pathname.startsWith('/dashboard');

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/shareway-logo.svg"
              alt="ShareWay"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-[#475f6e]">
            <Link
              to="/"
              className={`py-1 transition-colors ${
                isHome
                  ? 'text-[#008f87] relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#008f87] after:rounded-full font-bold'
                  : 'text-[#475f6e] hover:text-[#008f87]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/rides"
              className={`py-1 transition-colors ${
                isFindRides
                  ? 'text-[#008f87] relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#008f87] after:rounded-full font-bold'
                  : 'text-[#475f6e] hover:text-[#008f87]'
              }`}
            >
              Find Rides
            </Link>
            <a href="#how-it-works" className="hover:text-[#008f87] transition-colors py-1">
              How It Works
            </a>
            <a href="#safety" className="hover:text-[#008f87] transition-colors py-1">
              Safety
            </a>
            {user && (
              <Link
                to="/dashboard"
                className={`py-1 transition-colors font-bold flex items-center gap-1.5 ${
                  isDashboard
                    ? 'text-[#008f87] relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#008f87] after:rounded-full'
                    : 'text-[#008f87] hover:text-[#00736c]'
                }`}
              >
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              type="button"
              className="p-2 text-[#475f6e] hover:text-[#008f87] hover:bg-gray-50 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              /* Authenticated User Menu */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-gray-50 border border-gray-200 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#008f87] text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <div className="text-left text-xs">
                    <span className="block font-bold text-[#0b2b3d] leading-none">
                      {user.firstName}
                    </span>
                    <span className="text-[10px] font-semibold text-[#008f87] leading-none">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <div className="text-xs font-bold text-[#0b2b3d]">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-[#008f87]" />
                      <span>My Profile & Dashboard</span>
                    </Link>

                    {user.role === 'DRIVER' && (
                      <Link
                        to="/driver"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Car className="w-4 h-4 text-[#40ab50]" />
                        <span>Driver Workspace</span>
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span>Admin Control Panel</span>
                      </Link>
                    )}

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
            ) : (
              /* Guest Actions */
              <>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-sm font-bold text-[#0b2b3d] px-4 py-2 hover:text-[#008f87] transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="text-sm font-bold text-white bg-[#008f87] hover:bg-[#00736c] px-5 py-2.5 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#0b2b3d] hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md font-semibold transition-colors ${
              isHome
                ? 'text-[#008f87] bg-[#f0fdf9]'
                : 'text-[#475f6e] hover:bg-gray-50'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/rides"
            className={`block px-3 py-2 rounded-md font-semibold transition-colors ${
              isFindRides
                ? 'text-[#008f87] bg-[#f0fdf9]'
                : 'text-[#475f6e] hover:bg-gray-50'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Find Rides
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md font-semibold text-[#008f87] hover:bg-[#e6f6f5]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-2 bg-gray-50 rounded-xl text-xs">
                  <div className="font-bold text-[#0b2b3d]">Signed in as {user.firstName}</div>
                  <div className="text-gray-500">{user.role}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center font-bold text-red-600 py-2.5 rounded-lg border border-red-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full text-center font-bold text-[#0b2b3d] py-2 rounded-lg border border-gray-200"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('register');
                  }}
                  className="w-full text-center font-bold text-white bg-[#008f87] py-2.5 rounded-lg"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
