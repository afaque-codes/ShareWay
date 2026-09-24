import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Users, MapPin, Star, ShieldCheck, Clock, Loader2, Sparkles } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function PopularRoutes() {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedRides() {
      try {
        const res = await apiFetch('/api/rides?limit=4&sortBy=earliest');
        const data = await res.json();
        if (isMounted && res.ok && data.success) {
          setRides(data.data.rides || []);
        }
      } catch (err) {
        console.warn('Failed to load dynamic featured rides:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFeaturedRides();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 bg-[#0b2b3d] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#00a89d] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Community Marketplace</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Featured Verified Rides
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              Discover real-time verified rides in your community with trusted co-travelers.
            </p>
          </div>

          <Link
            to="/rides"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00a89d] hover:text-[#40ab50] transition-colors"
          >
            <span>View All Rides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic Rides Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white/10 border border-white/10 rounded-2xl p-5 animate-pulse space-y-3"
              >
                <div className="h-4 bg-white/20 rounded w-3/4" />
                <div className="h-6 bg-white/20 rounded w-1/2" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : rides.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rides.map((ride) => {
              const originCity = ride.originAddress.split(',')[0].trim();
              const destCity = ride.destinationAddress.split(',')[0].trim();
              const depDate = new Date(ride.departureTime);
              const formattedDate = depDate.toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              });
              const formattedTime = depDate.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });

              return (
                <div
                  key={ride.id}
                  onClick={() => navigate(`/rides/${ride.id}`)}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Route Cities */}
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <span className="font-semibold text-emerald-400">
                        {formattedDate} • {formattedTime}
                      </span>
                      {ride.driver?.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00a89d] bg-white/10 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-[#40ab50]" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="text-base font-extrabold text-white truncate flex items-center gap-2 group-hover:text-[#00a89d] transition-colors">
                      <span className="truncate">{originCity}</span>
                      <span className="text-[#00a89d] shrink-0">→</span>
                      <span className="truncate">{destCity}</span>
                    </div>

                    {/* Driver summary */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <img
                        src={ride.driver?.avatar}
                        alt={ride.driver?.name}
                        className="w-7 h-7 rounded-full object-cover border border-white/20 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-200 block truncate">
                          {ride.driver?.name}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{ride.driver?.rating || 4.9}</span>
                          <span className="text-gray-400 font-normal">
                            ({ride.driver?.totalRatings || 12})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Seats */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-black text-[#00a89d] leading-none">
                        ₹{ride.pricePerSeat}
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">per seat</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-300 font-semibold bg-white/5 px-2.5 py-1 rounded-xl">
                      <Users className="w-3.5 h-3.5 text-[#40ab50]" />
                      <span>{ride.availableSeats} left</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State if no rides in DB */
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center space-y-3 max-w-lg mx-auto">
            <MapPin className="w-8 h-8 text-[#00a89d] mx-auto opacity-80" />
            <h3 className="text-base font-bold text-white">No Rides Published Yet</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Be the first community driver to publish a ride and start sharing commutes!
            </p>
            <div className="pt-2">
              <Link
                to="/dashboard/create-ride"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#008f87] text-white text-xs font-bold hover:bg-[#00736c] transition-colors"
              >
                <span>Offer a Ride</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
