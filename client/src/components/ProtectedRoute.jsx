import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

/**
 * Route wrapper that enforces authentication and role-based permissions.
 *
 * @param {React.ReactNode} children
 * @param {string[]} [allowedRoles] - Optional array of roles permitted to view this route (e.g. ['DRIVER', 'ADMIN'])
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, openAuthModal } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#008f87] animate-spin" />
          <p className="text-sm font-semibold text-[#475f6e]">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Not authenticated -> Prompt login & redirect to home
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#e6f6f5] text-[#008f87] mx-auto flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0b2b3d]">Authentication Required</h2>
          <p className="text-sm text-[#475f6e]">
            You need to be signed in to access this page. Please sign in or create an account to continue.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="flex-1 py-3 px-4 rounded-xl bg-[#008f87] text-white font-bold text-sm shadow-md hover:bg-[#00736c] transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-[#0b2b3d] font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Role check: User role is not permitted
  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());
    const userRole = (user.role || '').toUpperCase();

    if (!normalizedAllowed.includes(userRole)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] px-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-100 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0b2b3d]">Access Restricted</h2>
            <p className="text-sm text-[#475f6e]">
              This section requires a <span className="font-bold text-[#0b2b3d]">{allowedRoles.join(' or ')}</span> account.
              Your current account role is <span className="font-bold text-[#008f87]">{user.role}</span>.
            </p>
            <div className="pt-2">
              <a
                href="/dashboard"
                className="inline-block w-full py-3 px-4 rounded-xl bg-[#008f87] text-white font-bold text-sm shadow-md hover:bg-[#00736c] transition-all text-center"
              >
                Go to My Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
}
