import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import {
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Car,
} from 'lucide-react';

export default function ProfileView() {
  const { user, driver } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await apiFetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to update profile.');
      }

      setSuccessMessage('Your profile information has been saved successfully.');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-extrabold text-[#0b2b3d]">Profile & Settings</h2>
        <p className="text-sm text-[#475f6e] mt-1">
          Manage your personal details, role verification, and platform preferences.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-[#008f87] text-white flex items-center justify-center font-extrabold text-3xl uppercase shadow-md shadow-[#008f87]/20 shrink-0">
          {user.firstName?.[0]}
          {user.lastName?.[0]}
        </div>

        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="text-xl font-bold text-[#0b2b3d]">
              {user.firstName} {user.lastName}
            </h3>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#e6f6f5] text-[#008f87] border border-[#b2e5df]">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-gray-400">{user.email}</p>
          <div className="pt-1 flex items-center justify-center sm:justify-start gap-4 text-xs text-gray-500">
            <span>Rating: <strong className="text-[#0b2b3d]">5.0 ★</strong></span>
            <span>•</span>
            <span>Status: <strong className="text-emerald-600">Active</strong></span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleUpdate} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
        <h4 className="text-base font-bold text-[#0b2b3d]">Personal Information</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#0b2b3d] mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008f87] focus:ring-2 focus:ring-[#008f87]/15 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b2b3d] mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008f87] focus:ring-2 focus:ring-[#008f87]/15 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0b2b3d] mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Contact support to change your account email.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0b2b3d] mb-1">Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008f87] focus:ring-2 focus:ring-[#008f87]/15 focus:outline-none"
            />
            <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Driver Extra Information */}
        {user.role === 'DRIVER' && (
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h4 className="text-base font-bold text-[#0b2b3d] flex items-center gap-2">
              <Car className="w-4 h-4 text-[#008f87]" />
              <span>Driver Credentials</span>
            </h4>

            <div className="p-4 rounded-2xl bg-[#f4faf9] border border-[#d0ece8] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#0b2b3d]">License Number</div>
                <div className="text-sm font-semibold text-[#008f87] mt-0.5">
                  {driver?.licenseNumber || 'Verified Registration'}
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {driver?.isVerified ? 'Verified' : 'Active'}
              </span>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
