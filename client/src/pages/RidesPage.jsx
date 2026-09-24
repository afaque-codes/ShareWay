import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LocationSelector from '../components/LocationSelector';
import RideDetailModal from '../components/RideDetailModal';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Filter,
  Car,
  Clock,
  ShieldCheck,
  Star,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
  Compass,
  Loader2,
  RefreshCw,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export default function RidesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id: paramRideId } = useParams();
  const { user, openAuthModal } = useAuth();

  // Search input state
  const [origin, setOrigin] = useState(searchParams.get('origin') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [travelDate, setTravelDate] = useState(searchParams.get('date') || '');

  // Filter state
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'earliest');
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 1200);
  const [minSeats, setMinSeats] = useState(Number(searchParams.get('minSeats')) || 1);
  const [timeFilter, setTimeFilter] = useState(searchParams.get('timeOfDay') || 'all');
  const [filterVerified, setFilterVerified] = useState(searchParams.get('verifiedOnly') === 'true');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data fetching state
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ride details modal state
  const [selectedRide, setSelectedRide] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch rides from backend API
  const fetchRides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (origin.trim()) params.append('origin', origin.trim());
      if (destination.trim()) params.append('destination', destination.trim());
      if (travelDate) params.append('date', travelDate);
      if (maxPrice) params.append('maxPrice', maxPrice.toString());
      if (minSeats > 1) params.append('minSeats', minSeats.toString());
      if (sortBy) params.append('sortBy', sortBy);
      if (timeFilter !== 'all') params.append('timeOfDay', timeFilter);
      if (filterVerified) params.append('verifiedOnly', 'true');

      const res = await apiFetch(`/api/rides?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setRides(data.data.rides || []);
      } else {
        setError(data.message || 'Unable to retrieve rides at this moment.');
      }
    } catch (err) {
      console.error('Error fetching rides:', err);
      setError('Failed to connect to the ShareWay marketplace service.');
    } finally {
      setLoading(false);
    }
  }, [origin, destination, travelDate, maxPrice, minSeats, sortBy, timeFilter, filterVerified]);

  // Initial fetch and fetch on filter changes
  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  // If URL has direct /rides/:id param, load single ride
  useEffect(() => {
    if (paramRideId) {
      apiFetch(`/api/rides/${paramRideId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.ride) {
            setSelectedRide(data.data.ride);
            setModalOpen(true);
          }
        })
        .catch((err) => console.warn('Failed to load ride by ID:', err));
    }
  }, [paramRideId]);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (origin.trim()) newParams.origin = origin.trim();
    if (destination.trim()) newParams.destination = destination.trim();
    if (travelDate) newParams.date = travelDate;
    if (maxPrice !== 1200) newParams.maxPrice = maxPrice.toString();
    if (minSeats > 1) newParams.minSeats = minSeats.toString();
    if (sortBy !== 'earliest') newParams.sortBy = sortBy;
    if (timeFilter !== 'all') newParams.timeOfDay = timeFilter;
    if (filterVerified) newParams.verifiedOnly = 'true';

    setSearchParams(newParams);
    fetchRides();
  };

  const resetFilters = () => {
    setOrigin('');
    setDestination('');
    setTravelDate('');
    setMaxPrice(1200);
    setMinSeats(1);
    setTimeFilter('all');
    setFilterVerified(false);
    setSortBy('earliest');
    setSearchParams({});
  };

  const handleOpenDetail = (ride) => {
    setSelectedRide(ride);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRide(null);
    if (paramRideId) {
      navigate('/rides', { replace: true });
    }
  };

  const handleBookRide = (ride, seatsCount = 1) => {
    if (!user) {
      openAuthModal('login', 'PASSENGER');
      return;
    }
    if (user.role === 'DRIVER') {
      alert('You are currently signed in as a Driver. Booking seats is available for passenger accounts.');
      return;
    }
    // Simulation / route to bookings view
    navigate('/dashboard/bookings');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      {/* Hero Header & Search Bar */}
      <section className="bg-gradient-to-b from-[#e6f6f5] to-white border-b border-gray-100 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#008f87]/20 text-xs font-bold text-[#008f87] shadow-xs mb-3">
              <Compass className="w-3.5 h-3.5" />
              Community Marketplace
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b2b3d] tracking-tight">
              Find & Share Verified Rides
            </h1>
            <p className="text-sm text-[#475f6e] mt-2">
              Connect with verified drivers going your direction. Save money, travel safely, and commute sustainably.
            </p>
          </div>

          {/* Global Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl shadow-[#0b2b3d]/5 border border-gray-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center"
          >
            {/* Leaving From */}
            <div className="lg:col-span-4">
              <LocationSelector
                label="Leaving From"
                value={origin}
                onChange={(val) => setOrigin(val)}
                placeholder="Search departure city or address..."
                markerColor="#008f87"
              />
            </div>

            {/* Going To */}
            <div className="lg:col-span-4">
              <LocationSelector
                label="Going To"
                value={destination}
                onChange={(val) => setDestination(val)}
                placeholder="Search destination city or address..."
                markerColor="#ef4444"
              />
            </div>

            {/* Travel Date */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Travel Date
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-[#008f87] focus-within:ring-2 focus-within:ring-[#008f87]/15 transition-all">
                <Calendar className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full text-xs font-semibold text-[#0b2b3d] bg-transparent focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Search Submit Button */}
            <div className="lg:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-5 mt-5 rounded-xl bg-[#008f87] hover:bg-[#00736c] active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-[#008f87]/20 hover:shadow-lg transition-all cursor-pointer h-[38px]"
              >
                <Search className="w-4 h-4" />
                <span>Search Rides</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content Area: Filter Sidebar & Results Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Mobile Filter Toggle & Results Count */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#0b2b3d] shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#008f87]" />
            <span>
              Filters ({[filterVerified, timeFilter !== 'all', minSeats > 1, maxPrice < 1200].filter(Boolean).length})
            </span>
          </button>

          <span className="text-xs font-bold text-gray-500">
            {rides.length} {rides.length === 1 ? 'ride' : 'rides'} available
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Filter Sidebar */}
          <aside
            className={`lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#008f87]" />
                <h3 className="font-extrabold text-[#0b2b3d] text-base">Filter Rides</h3>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-[#008f87] hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-xs font-semibold text-[#0b2b3d] border border-gray-200 rounded-xl p-2.5 bg-gray-50 focus:bg-white focus:border-[#008f87] focus:outline-none cursor-pointer"
              >
                <option value="earliest">Earliest Departure</option>
                <option value="lowest-price">Lowest Price per Seat</option>
                <option value="highest-price">Highest Price per Seat</option>
                <option value="rating">Top Rated Drivers</option>
              </select>
            </div>

            {/* Departure Time Slots */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Departure Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'Anytime' },
                  { id: 'morning', label: 'Morning (Before 12)' },
                  { id: 'afternoon', label: 'Afternoon (12-6 PM)' },
                  { id: 'evening', label: 'Evening (After 6 PM)' },
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setTimeFilter(slot.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                      timeFilter === slot.id
                        ? 'bg-[#008f87] text-white shadow-xs'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="uppercase tracking-wider text-gray-400">Max Price</span>
                <span className="text-[#008f87] font-extrabold">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="200"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#008f87] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 font-semibold">
                <span>₹200</span>
                <span>₹2000</span>
              </div>
            </div>

            {/* Min Seats Needed */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Seats Needed
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMinSeats(num)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      minSeats === num
                        ? 'bg-[#008f87] text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {num} {num === 1 ? 'seat' : 'seats'}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Drivers Toggle */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#008f87]" />
                  <span className="text-xs font-bold text-[#0b2b3d]">Verified Drivers Only</span>
                </div>
                <input
                  type="checkbox"
                  checked={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.checked)}
                  className="rounded text-[#008f87] focus:ring-[#008f87] h-4 w-4 cursor-pointer"
                />
              </label>
            </div>
          </aside>

          {/* Right Column: Search Results */}
          <div className="lg:col-span-8 space-y-4">
            {/* Header info */}
            <div className="hidden lg:flex items-center justify-between px-2 pb-2">
              <div className="text-xs font-semibold text-gray-500">
                Found <span className="font-bold text-[#0b2b3d]">{rides.length}</span> published rides
                {origin && (
                  <span>
                    {' '}
                    from <strong className="text-[#0b2b3d]">"{origin.split(',')[0]}"</strong>
                  </span>
                )}
                {destination && (
                  <span>
                    {' '}
                    to <strong className="text-[#0b2b3d]">"{destination.split(',')[0]}"</strong>
                  </span>
                )}
              </div>

              {loading && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#008f87]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating results...</span>
                </div>
              )}
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={fetchRides}
                  className="inline-flex items-center gap-1 text-red-800 hover:underline cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && rides.length === 0 ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs animate-pulse space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        <div className="space-y-2">
                          <div className="w-32 h-4 bg-gray-200 rounded" />
                          <div className="w-20 h-3 bg-gray-100 rounded" />
                        </div>
                      </div>
                      <div className="w-16 h-6 bg-gray-200 rounded" />
                    </div>
                    <div className="h-12 bg-gray-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : rides.length > 0 ? (
              /* Results List */
              rides.map((ride) => {
                const depDate = new Date(ride.departureTime);
                const depTimeFormatted = depDate.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });
                const depDateFormatted = depDate.toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                });

                const durHours = Math.floor((ride.durationMinutes || 0) / 60);
                const durMins = (ride.durationMinutes || 0) % 60;
                const durStr = durHours > 0 ? `${durHours}h ${durMins}m` : `${durMins}m`;

                return (
                  <div
                    key={ride.id}
                    onClick={() => handleOpenDetail(ride)}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#008f87]/30 transition-all space-y-4 group cursor-pointer"
                  >
                    {/* Top Row: Driver Profile & Pricing */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={ride.driver.avatar}
                          alt={ride.driver.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#e6f6f5]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#0b2b3d] text-base group-hover:text-[#008f87] transition-colors">
                              {ride.driver.name}
                            </span>
                            {ride.driver.isVerified && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#008f87] bg-[#e6f6f5] px-2 py-0.5 rounded-full">
                                <ShieldCheck className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1 font-bold text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {ride.driver.rating || 4.9}
                            </span>
                            <span>•</span>
                            <span>{ride.driver.totalRatings || 14} rides</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-gray-400">
                              <Car className="w-3 h-3" />
                              {ride.driver.vehicle?.displayName || 'Personal Car'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price Per Seat */}
                      <div className="text-right">
                        <div className="text-2xl font-black text-[#008f87] leading-none">
                          ₹{ride.pricePerSeat}
                        </div>
                        <span className="text-[11px] font-semibold text-gray-400">per seat</span>
                      </div>
                    </div>

                    {/* Middle Row: Route Timeline & Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-8 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-[#008f87] bg-white" />
                            <div className="w-0.5 h-8 bg-gray-200" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                          </div>

                          <div className="space-y-3 flex-1 text-sm font-semibold text-[#0b2b3d]">
                            <div className="flex items-center justify-between">
                              <span className="truncate pr-2">{ride.originAddress}</span>
                              <span className="text-xs text-[#008f87] font-bold shrink-0">
                                {depDateFormatted} • {depTimeFormatted}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="truncate pr-2">{ride.destinationAddress}</span>
                              <span className="text-xs text-gray-400 font-normal shrink-0">
                                {durStr} • {ride.distanceKm ? `${ride.distanceKm} km` : ''}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Notes preview pill */}
                        {ride.notes && (
                          <div className="text-[11px] text-gray-500 italic truncate pt-1">
                            "{ride.notes}"
                          </div>
                        )}
                      </div>

                      {/* Right Column: Seats & Actions */}
                      <div className="sm:col-span-4 flex flex-col sm:items-end justify-between gap-3 pt-2 sm:pt-0">
                        <div className="text-xs font-bold text-gray-500">
                          <span className="text-[#008f87] font-extrabold">
                            {ride.availableSeats}
                          </span>{' '}
                          {ride.availableSeats === 1 ? 'seat left' : 'seats left'}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(ride);
                            }}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(ride);
                            }}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008f87] hover:bg-[#00736c] shadow-xs hover:shadow transition-all cursor-pointer"
                          >
                            <span>Book Seat</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#e6f6f5] text-[#008f87] mx-auto flex items-center justify-center">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-[#0b2b3d]">No Matching Rides Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  We couldn't find any verified rides for your specified route or filter criteria. Try clearing filters or searching for nearby major cities.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008f87] text-white text-xs font-bold hover:bg-[#00736c] transition-all cursor-pointer shadow-xs"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Ride Detail Modal */}
      <RideDetailModal
        ride={selectedRide}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onBookRide={handleBookRide}
      />

      <Footer />
    </div>
  );
}
