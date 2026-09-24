import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  User,
  Car,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';

const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  licenseNumber: '',
};

export default function AuthModal() {
  const { authModal, closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState(authModal.mode || 'login'); // 'login' | 'register'
  const [role, setRole] = useState(authModal.defaultRole || 'PASSENGER');
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Whenever modal opens or closes, completely reset form data and errors
  useEffect(() => {
    if (authModal.isOpen) {
      setMode(authModal.mode || 'login');
      setRole(authModal.defaultRole || 'PASSENGER');
      setError(null);
      setShowPassword(false);
      setFormData(INITIAL_FORM_DATA);
    } else {
      setFormData(INITIAL_FORM_DATA);
      setError(null);
    }
  }, [authModal.isOpen, authModal.mode, authModal.defaultRole]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && authModal.isOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModal.isOpen, closeAuthModal]);

  if (!authModal.isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setError(null);
    setFormData((prev) => ({ ...prev, password: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login({
          email: formData.email,
          password: formData.password,
          expectedRole: role,
        });
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role,
          phone: formData.phone || undefined,
          licenseNumber: role === 'DRIVER' ? formData.licenseNumber || undefined : undefined,
        });
      }
      setFormData(INITIAL_FORM_DATA);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dim Backdrop */}
      <div
        className="fixed inset-0 bg-[#061822]/60 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="ShareWay" className="w-7 h-7" />
            <span className="font-extrabold text-lg tracking-tight text-[#0b2b3d]">
              Share<span className="text-[#008f87]">Way</span>
            </span>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="px-6 pt-2">
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl text-sm font-bold">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#008f87] shadow-xs'
                  : 'text-gray-500 hover:text-[#0b2b3d]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('register')}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#008f87] shadow-xs'
                  : 'text-gray-500 hover:text-[#0b2b3d]'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4" autoComplete="off">
          
          {/* Error Alert Banner with smart switch action */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1 leading-snug">{error}</div>
              </div>

              {/* One-click role mismatch switcher */}
              {error.includes('registered as a driver') && (
                <button
                  type="button"
                  onClick={() => {
                    setRole('DRIVER');
                    setError(null);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#008f87] hover:underline pt-1"
                >
                  <span>Switch to Driver sign in</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {error.includes('registered as a passenger') && (
                <button
                  type="button"
                  onClick={() => {
                    setRole('PASSENGER');
                    setError(null);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#008f87] hover:underline pt-1"
                >
                  <span>Switch to Passenger sign in</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Role Selector: Active in both Login & Register modes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
              {mode === 'login' ? 'Sign in as:' : 'I want to join as:'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRole('PASSENGER');
                  setError(null);
                }}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  role === 'PASSENGER'
                    ? 'border-[#008f87] bg-[#f0fdf9] text-[#008f87] ring-1 ring-[#008f87]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <User className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#0b2b3d]">Passenger</div>
                  <div className="text-[10px] text-gray-500 leading-tight">
                    {mode === 'login' ? 'Rider account' : 'Find rides'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('DRIVER');
                  setError(null);
                }}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  role === 'DRIVER'
                    ? 'border-[#40ab50] bg-[#f2faf3] text-[#40ab50] ring-1 ring-[#40ab50]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Car className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#0b2b3d]">Driver</div>
                  <div className="text-[10px] text-gray-500 leading-tight">
                    {mode === 'login' ? 'Driver account' : 'Offer rides'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Mode: Register -> First & Last Name */}
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0b2b3d] mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008f87] focus:ring-2 focus:ring-[#008f87]/15 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b2b3d] mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008f87] focus:ring-2 focus:ring-[#008f87]/15 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-[#0b2b3d] mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008f87] focus:ring-2 focus:ring-[#008f87]/15 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#0b2b3d]">Password</label>
              {mode === 'login' && (
                <a href="#forgot" className="text-[11px] font-semibold text-[#008f87] hover:underline">
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008f87] focus:ring-2 focus:ring-[#008f87]/15 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === 'register' && (
              <p className="text-[10px] text-gray-400 mt-1">
                At least 8 characters with at least one letter and number.
              </p>
            )}
          </div>

          {/* Optional Driver License if registering as Driver */}
          {mode === 'register' && role === 'DRIVER' && (
            <div>
              <label className="block text-xs font-bold text-[#0b2b3d] mb-1">
                Driving License Number <span className="text-gray-400 font-normal">(Optional now)</span>
              </label>
              <input
                type="text"
                name="licenseNumber"
                placeholder="DL-XXXXXXXX"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008f87] focus:ring-2 focus:ring-[#008f87]/15 focus:outline-none uppercase"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#008f87] hover:bg-[#00736c] active:scale-[0.99] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Please wait...</span>
              </>
            ) : mode === 'login' ? (
              `Sign In as ${role === 'DRIVER' ? 'Driver' : 'Passenger'}`
            ) : (
              `Create ${role === 'DRIVER' ? 'Driver' : 'Passenger'} Account`
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="px-6 pb-6 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
          By continuing, you agree to ShareWay's{' '}
          <a href="#terms" className="text-[#008f87] underline">
            Terms
          </a>{' '}
          and{' '}
          <a href="#privacy" className="text-[#008f87] underline">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}
