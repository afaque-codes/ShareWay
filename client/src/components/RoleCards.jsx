import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Car, User } from 'lucide-react';

export default function RoleCards() {
  const { user, openAuthModal } = useAuth();

  const handleRoleClick = (role) => {
    if (!user) {
      openAuthModal('register', role);
    }
  };

  return (
    <section className="py-16 bg-[#f8faf9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-[#008f87]">
              Choose Your Way
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b2b3d] mt-1 tracking-tight">
              Join as a Passenger or a Driver
            </h2>
            <p className="text-sm sm:text-base text-[#475f6e] mt-2 max-w-xl">
              Whether you're looking for a ride or have empty seats, ShareWay makes it simple,
              affordable, and sustainable.
            </p>
          </div>

          <div className="hidden lg:block text-right">
            <span className="inline-block text-[#008f87] font-bold text-sm bg-[#e6f6f5] px-4 py-2 rounded-full border border-[#b2e5df] -rotate-1 shadow-xs">
              Same Roads • Stronger Communities 🌱
            </span>
          </div>
        </div>

        {/* Dual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Passenger Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row">
            <div className="sm:w-1/2 h-52 sm:h-auto relative overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80"
                alt="Passenger traveling"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-xs rounded-full text-xs font-bold text-[#0b2b3d] shadow-xs flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#008f87]" />
                <span>Passenger</span>
              </div>
            </div>

            <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-[#0b2b3d]">I'm a Passenger</h3>
                <p className="text-sm text-[#475f6e] mt-2 leading-relaxed">
                  Find affordable rides, travel comfortably, and connect with trusted drivers in your
                  community.
                </p>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleRoleClick('PASSENGER')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white font-bold text-sm shadow-xs hover:shadow transition-all w-full justify-center cursor-pointer"
                >
                  <span>Find a Ride</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Driver Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row">
            <div className="sm:w-1/2 h-52 sm:h-auto relative overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=700&q=80"
                alt="Driver behind the wheel"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-xs rounded-full text-xs font-bold text-[#0b2b3d] shadow-xs flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#40ab50]" />
                <span>Driver</span>
              </div>
            </div>

            <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-[#0b2b3d]">I'm a Driver</h3>
                <p className="text-sm text-[#475f6e] mt-2 leading-relaxed">
                  Share your empty seats, offset fuel costs on your regular commute, and lower CO₂
                  emissions.
                </p>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleRoleClick('DRIVER')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#f0fdf9] text-[#008f87] border-2 border-[#008f87] font-bold text-sm transition-all w-full justify-center cursor-pointer"
                >
                  <span>Offer a Ride</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
