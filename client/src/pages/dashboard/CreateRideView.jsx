import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import RouteMap from '../../components/map/RouteMap';
import LocationSelector from '../../components/LocationSelector';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  Shield,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Compass,
} from 'lucide-react';

export default function CreateRideView() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    originAddress: '',
    destinationAddress: '',
    departureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    departureTime: '08:30',
    totalSeats: 3,
    pricePerSeat: 350,
    notes: '',
  });

  // Route preview state from OSRM
  const [routePreview, setRoutePreview] = useState(null);
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const debounceTimerRef = useRef(null);

  // Calculate route preview with OSRM when origin or destination changes
  const fetchRoutePreview = async (origin, destination, oCoords, dCoords) => {
    if (!origin || !destination || origin.length < 3 || destination.length < 3) return;

    setIsCalculatingRoute(true);
    setRouteError(null);

    const activeOCoords = oCoords !== undefined ? oCoords : originCoords;
    const activeDCoords = dCoords !== undefined ? dCoords : destinationCoords;

    try {
      const res = await apiFetch('/api/rides/preview', {
        method: 'POST',
        body: JSON.stringify({
          originAddress: origin,
          destinationAddress: destination,
          originCoords: activeOCoords || undefined,
          destinationCoords: activeDCoords || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRoutePreview(data.data);
        if (data.data.originCoords) setOriginCoords(data.data.originCoords);
        if (data.data.destinationCoords) setDestinationCoords(data.data.destinationCoords);
      } else {
        setRouteError(data.error?.message || 'Unable to calculate driving route.');
      }
    } catch (err) {
      setRouteError('Network error connecting to routing service.');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const handleOriginChange = (address, coords) => {
    setFormData((prev) => ({ ...prev, originAddress: address }));
    setOriginCoords(coords);
    if (coords && formData.destinationAddress) {
      fetchRoutePreview(address, formData.destinationAddress, coords, destinationCoords);
    } else {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        fetchRoutePreview(address, formData.destinationAddress, coords, destinationCoords);
      }, 500);
    }
  };

  const handleDestinationChange = (address, coords) => {
    setFormData((prev) => ({ ...prev, destinationAddress: address }));
    setDestinationCoords(coords);
    if (coords && formData.originAddress) {
      fetchRoutePreview(formData.originAddress, address, originCoords, coords);
    } else {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        fetchRoutePreview(formData.originAddress, address, originCoords, coords);
      }, 500);
    }
  };

  // Initial preview on mount if addresses pre-filled
  useEffect(() => {
    if (formData.originAddress && formData.destinationAddress) {
      fetchRoutePreview(formData.originAddress, formData.destinationAddress);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeatChange = (delta) => {
    setFormData((prev) => ({
      ...prev,
      totalSeats: Math.max(1, Math.min(6, prev.totalSeats + delta)),
    }));
  };

  const handleSubmit = async (targetStatus) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const departureIso = new Date(
        `${formData.departureDate}T${formData.departureTime}:00`
      ).toISOString();

      const res = await apiFetch('/api/rides', {
        method: 'POST',
        body: JSON.stringify({
          originAddress: formData.originAddress,
          destinationAddress: formData.destinationAddress,
          originCoords: routePreview?.originCoords,
          destinationCoords: routePreview?.destinationCoords,
          departureTime: departureIso,
          totalSeats: Number(formData.totalSeats),
          pricePerSeat: Number(formData.pricePerSeat),
          notes: formData.notes,
          status: targetStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to create ride.');
      }

      // Successfully created -> navigate to driver's ride management
      navigate('/dashboard/my-rides');
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-extrabold text-[#0b2b3d]">Publish a New Ride</h2>
        <p className="text-sm text-[#475f6e] mt-1">
          Specify your route, schedule, seat capacity, and split fuel costs with verified community members.
        </p>
      </div>

      {submitError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Ride Details Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          
          {/* Section 1: Route */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0b2b3d] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#008f87]" />
                <span>1. Route Details</span>
              </h3>

              {isCalculatingRoute && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#008f87]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Calculating route...</span>
                </span>
              )}
            </div>

            <div className="space-y-4">
              <LocationSelector
                label="Departure Origin *"
                value={formData.originAddress}
                onChange={handleOriginChange}
                placeholder="Search departure city, landmark, or transit hub..."
                markerColor="#008f87"
                required
              />

              <LocationSelector
                label="Destination *"
                value={formData.destinationAddress}
                onChange={handleDestinationChange}
                placeholder="Search destination city, landmark, or transit hub..."
                markerColor="#ef4444"
                required
              />
            </div>
          </div>

          {/* Section 2: Date & Time */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-extrabold text-[#0b2b3d] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#008f87]" />
              <span>2. Schedule</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Departure Date *</label>
                <input
                  type="date"
                  required
                  name="departureDate"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.departureDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#0b2b3d] bg-gray-50 focus:bg-white focus:border-[#008f87] focus:outline-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Departure Time *</label>
                <input
                  type="time"
                  required
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#0b2b3d] bg-gray-50 focus:bg-white focus:border-[#008f87] focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Seats & Pricing */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-extrabold text-[#0b2b3d] uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-[#008f87]" />
              <span>3. Seats & Contribution</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Available Passenger Seats</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSeatChange(-1)}
                    className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 font-extrabold text-[#0b2b3d] flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-base font-extrabold text-[#0b2b3d] w-8 text-center">
                    {formData.totalSeats}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSeatChange(1)}
                    className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 font-extrabold text-[#0b2b3d] flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Price per Seat (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-gray-400">₹</span>
                  <input
                    type="number"
                    required
                    min="50"
                    max="5000"
                    step="50"
                    name="pricePerSeat"
                    value={formData.pricePerSeat}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-semibold text-[#0b2b3d] bg-gray-50 focus:bg-white focus:border-[#008f87] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Notes */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-500">Trip Notes & Co-traveler Guidelines</label>
            <textarea
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Can pick up along Highway 7. Trunk space for 2 medium bags."
              className="w-full border border-gray-200 rounded-xl p-3 text-xs font-semibold text-[#0b2b3d] bg-gray-50 focus:bg-white focus:border-[#008f87] focus:outline-none"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('DRAFT')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('PUBLISHED')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#008f87] hover:bg-[#00736c] text-white text-xs font-bold shadow-md shadow-[#008f87]/20 hover:shadow-lg transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <span>Publish Ride</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: OSRM Route Preview & Interactive Leaflet Map */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4 overflow-hidden relative z-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0b2b3d] uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#008f87]" />
                <span>OSRM Driving Route</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400">Live Preview</span>
            </div>

            {/* Leaflet Map Preview */}
            <RouteMap
              originCoords={routePreview?.originCoords}
              destinationCoords={routePreview?.destinationCoords}
              routeGeometry={routePreview?.routeGeometry}
              className="h-64 w-full rounded-2xl overflow-hidden border border-gray-100 relative z-0 isolate"
            />

            {/* Trip Metrics */}
            {routePreview ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Distance</span>
                  <span className="text-lg font-extrabold text-[#0b2b3d]">
                    {routePreview.distanceKm} km
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#e6f6f5] border border-[#008f87]/20">
                  <span className="text-[10px] font-bold uppercase text-[#008f87] block">Estimated Time</span>
                  <span className="text-lg font-extrabold text-[#008f87]">
                    {Math.floor(routePreview.durationMinutes / 60)}h {routePreview.durationMinutes % 60}m
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-gray-50 text-center text-xs text-gray-400">
                Enter your route locations above to preview distance and travel time.
              </div>
            )}
          </div>

          {/* Fuel Split Guide Box */}
          <div className="bg-gradient-to-br from-[#0b2b3d] to-[#134e6f] rounded-3xl p-5 text-white space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-[#00a89d]">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-extrabold uppercase">Fair-Cost Ridesharing</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              ShareWay promotes non-commercial carpooling. Recommended pricing is computed to offset fuel and toll costs among travelers heading along the same corridor.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
