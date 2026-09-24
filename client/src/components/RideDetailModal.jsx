import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Car,
  ShieldCheck,
  Star,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import RouteMap from './map/RouteMap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RideDetailModal({ ride, isOpen, onClose, onBookRide }) {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [requestedSeats, setRequestedSeats] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Reset requested seats when ride changes
  useEffect(() => {
    setRequestedSeats(1);
    setBookingSuccess(false);
  }, [ride]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !ride) return null;

  const driver = ride.driver || {};
  const vehicle = driver.vehicle || {};
  const originCoords = ride.originLocation?.coordinates || null;
  const destCoords = ride.destinationLocation?.coordinates || null;

  const departureDateObj = new Date(ride.departureTime);
  const formattedDate = departureDateObj.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = departureDateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const durationHours = Math.floor((ride.durationMinutes || 0) / 60);
  const durationMins = (ride.durationMinutes || 0) % 60;
  const durationString =
    durationHours > 0 ? `${durationHours}h ${durationMins}m` : `${durationMins} mins`;

  const totalPrice = requestedSeats * (ride.pricePerSeat || 0);

  const handleBooking = () => {
    if (!user) {
      openAuthModal('login', 'PASSENGER');
      return;
    }
    if (user.role === 'DRIVER') {
      alert('You are currently logged in as a Driver. Booking rides is for Passenger accounts.');
      return;
    }

    if (onBookRide) {
      onBookRide(ride, requestedSeats);
    } else {
      setBookingSuccess(true);
      setTimeout(() => {
        onClose();
        navigate('/dashboard/bookings');
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0b2b3d]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-4xl w-full max-h-[92vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#008f87] bg-[#e6f6f5] px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Community Ride
            </span>
            <span className="text-xs text-gray-400 font-medium">#{ride.id.slice(-6).toUpperCase()}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Top Grid: Route Summary & Route Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Journey Details */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#0b2b3d] leading-snug">
                  {ride.originAddress.split(',')[0]} → {ride.destinationAddress.split(',')[0]}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-gray-500">
                  <Calendar className="w-4 h-4 text-[#008f87]" />
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <Clock className="w-4 h-4 text-[#008f87]" />
                  <span>{formattedTime}</span>
                </div>
              </div>

              {/* Step Timeline */}
              <div className="p-4 rounded-2xl bg-[#fafbfb] border border-gray-100 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#e6f6f5] border-2 border-[#008f87] flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[#008f87]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Pickup Origin
                    </span>
                    <p className="text-xs font-bold text-[#0b2b3d] mt-0.5">
                      {ride.originAddress}
                    </p>
                  </div>
                </div>

                <div className="ml-3 pl-3 border-l-2 border-dashed border-gray-200 py-1 text-xs text-gray-500 flex items-center gap-4">
                  <span className="font-semibold">{durationString} estimated</span>
                  <span>•</span>
                  <span className="font-semibold">{ride.distanceKm ? `${ride.distanceKm} km` : 'Direct Route'}</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-50 border-2 border-red-500 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Dropoff Destination
                    </span>
                    <p className="text-xs font-bold text-[#0b2b3d] mt-0.5">
                      {ride.destinationAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ride Notes */}
              {ride.notes && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/50 flex items-start gap-3">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-900 block mb-0.5">
                      Driver Guidelines & Notes
                    </span>
                    <p className="text-xs text-amber-800 leading-relaxed">{ride.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Route Map */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                <span>Interactive Route Preview</span>
                <span className="text-[#008f87]">OSRM Driving Route</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-inner h-64 sm:h-72 w-full relative z-0 isolate">
                <RouteMap
                  originCoords={originCoords}
                  destinationCoords={destCoords}
                  routeGeometry={ride.routeGeometry}
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>

          {/* Middle Row: Driver Profile & Vehicle Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            {/* Driver Profile */}
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-start gap-4">
              <img
                src={driver.avatar}
                alt={driver.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#008f87]/20 shrink-0"
              />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-[#0b2b3d] text-base truncate">
                    {driver.name}
                  </h4>
                  {driver.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {driver.rating || 4.9}
                  </span>
                  <span>•</span>
                  <span>{driver.totalRatings || 14} rides rated</span>
                </div>

                <p className="text-xs text-gray-500 italic mt-1 line-clamp-2">
                  "{driver.bio || 'Verified community driver on ShareWay.'}"
                </p>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#008f87]" />
                <h4 className="font-extrabold text-[#0b2b3d] text-sm">Vehicle Details</h4>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Model:</span>
                  <span className="font-bold text-[#0b2b3d]">
                    {vehicle.displayName || `${vehicle.make || 'Standard'} ${vehicle.model || 'Sedan'}`}
                  </span>
                </div>
                {vehicle.plateNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">License Plate:</span>
                    <span className="font-mono font-bold text-[#0b2b3d] bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">
                      {vehicle.plateNumber}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Available Seats:</span>
                  <span className="font-bold text-[#008f87]">
                    {ride.availableSeats} of {ride.totalSeats} seats open
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Seat Selection & Total Price Booking */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#e6f6f5] to-[#f0fbfb] border border-[#008f87]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Fare Breakdown
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#008f87]">₹{totalPrice}</span>
                <span className="text-xs text-gray-500 font-medium">
                  (₹{ride.pricePerSeat} × {requestedSeats} seat{requestedSeats > 1 ? 's' : ''})
                </span>
              </div>
              <span className="text-[11px] text-gray-500 block">
                No hidden fees • Direct driver fuel cost share
              </span>
            </div>

            {/* Stepper & Action Button */}
            <div className="flex items-center gap-4">
              {/* Seat Stepper */}
              <div className="flex items-center bg-white rounded-2xl border border-gray-200 p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setRequestedSeats((prev) => Math.max(1, prev - 1))}
                  disabled={requestedSeats <= 1}
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  -
                </button>
                <div className="px-3 text-xs font-extrabold text-[#0b2b3d] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#008f87]" />
                  <span>{requestedSeats}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setRequestedSeats((prev) =>
                      Math.min(ride.availableSeats || 1, prev + 1)
                    )
                  }
                  disabled={requestedSeats >= (ride.availableSeats || 1)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>

              {/* Book CTA */}
              <button
                type="button"
                onClick={handleBooking}
                disabled={bookingSuccess || ride.availableSeats <= 0}
                className={`py-3.5 px-6 rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                  bookingSuccess
                    ? 'bg-emerald-600 text-white'
                    : ride.availableSeats <= 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#008f87] hover:bg-[#00736c] text-white hover:shadow-lg active:scale-[0.99]'
                }`}
              >
                {bookingSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Booking Reserved!</span>
                  </>
                ) : ride.availableSeats <= 0 ? (
                  <span>Fully Booked</span>
                ) : (
                  <>
                    <span>Book {requestedSeats} Seat{requestedSeats > 1 ? 's' : ''}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
