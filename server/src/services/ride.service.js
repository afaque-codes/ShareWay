import Ride from '../models/Ride.js';
import User from '../models/User.js';
import Driver from '../models/Driver.js';
import Vehicle from '../models/Vehicle.js';
import { geocodeAddress, getRouteDetails } from './osrm.service.js';

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Composite helper to format ride with driver details and vehicle
 */
function enrichRide(rideDoc, driverProfile, vehicle) {
  const rideObj = rideDoc.toObject ? rideDoc.toObject() : { ...rideDoc };
  const driverUser = rideObj.driverId || {};

  return {
    ...rideObj,
    id: rideObj._id.toString(),
    driver: {
      id: driverUser._id,
      name: `${driverUser.firstName || ''} ${driverUser.lastName || ''}`.trim() || 'Community Driver',
      firstName: driverUser.firstName || 'Driver',
      lastName: driverUser.lastName || '',
      email: driverUser.email,
      phone: driverUser.phone,
      avatar:
        driverUser.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          driverUser.firstName || 'Driver'
        )}&background=008f87&color=fff`,
      rating: Number((driverUser.averageRating || 4.9).toFixed(1)),
      totalRatings: driverUser.totalRatings || 14,
      isVerified: driverProfile ? driverProfile.isVerified : true,
      bio: driverProfile?.bio || 'Experienced community carpool driver.',
      vehicle: vehicle
        ? {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            color: vehicle.color,
            plateNumber: vehicle.plateNumber,
            vehicleType: vehicle.vehicleType,
            displayName: `${vehicle.make} ${vehicle.model} (${vehicle.color})`,
          }
        : {
            make: 'Verified',
            model: 'Sedan',
            color: 'Comfort',
            displayName: 'Verified Personal Vehicle',
          },
    },
  };
}

/**
 * Preview route calculation without saving to DB
 */
export async function calculateRoutePreview({
  originAddress,
  destinationAddress,
  originCoords,
  destinationCoords,
}) {
  const resolvedOriginCoords =
    originCoords && originCoords.length === 2
      ? originCoords
      : await geocodeAddress(originAddress);

  const resolvedDestCoords =
    destinationCoords && destinationCoords.length === 2
      ? destinationCoords
      : await geocodeAddress(destinationAddress);

  const routeDetails = await getRouteDetails(resolvedOriginCoords, resolvedDestCoords);

  return {
    originCoords: resolvedOriginCoords,
    destinationCoords: resolvedDestCoords,
    distanceKm: routeDetails.distanceKm,
    durationMinutes: routeDetails.durationMinutes,
    routeGeometry: routeDetails.routeGeometry,
  };
}

/**
 * Create a new Ride (Draft or Published)
 */
export async function createRide(driverUserId, rideData) {
  // 1. Verify user exists
  const user = await User.findById(driverUserId);
  if (!user) {
    const err = new Error('Driver account not found.');
    err.statusCode = 404;
    throw err;
  }

  // 2. Validate departure date is in the future
  const departureDate = new Date(rideData.departureTime);
  if (departureDate.getTime() < Date.now() - 5 * 60 * 1000) {
    const err = new Error('Departure time must be in the future.');
    err.statusCode = 400;
    throw err;
  }

  // 3. Resolve coordinates
  const originCoords =
    rideData.originCoords && rideData.originCoords.length === 2
      ? rideData.originCoords
      : await geocodeAddress(rideData.originAddress);

  const destinationCoords =
    rideData.destinationCoords && rideData.destinationCoords.length === 2
      ? rideData.destinationCoords
      : await geocodeAddress(rideData.destinationAddress);

  // 4. Calculate OSRM route details
  const route = await getRouteDetails(originCoords, destinationCoords);

  // 5. Persist Ride in MongoDB
  const ride = await Ride.create({
    driverId: driverUserId,
    originAddress: rideData.originAddress,
    originLocation: {
      type: 'Point',
      coordinates: originCoords,
    },
    destinationAddress: rideData.destinationAddress,
    destinationLocation: {
      type: 'Point',
      coordinates: destinationCoords,
    },
    routeGeometry: route.routeGeometry,
    distanceKm: route.distanceKm,
    durationMinutes: route.durationMinutes,
    departureTime: departureDate,
    totalSeats: rideData.totalSeats,
    availableSeats: rideData.totalSeats,
    pricePerSeat: rideData.pricePerSeat,
    status: rideData.status || 'PUBLISHED',
    notes: rideData.notes || '',
  });

  return ride;
}

/**
 * Publish a Draft Ride
 */
export async function publishRide(rideId, driverUserId) {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    const err = new Error('Ride not found.');
    err.statusCode = 404;
    throw err;
  }

  if (ride.driverId.toString() !== driverUserId.toString()) {
    const err = new Error('Unauthorized to modify this ride.');
    err.statusCode = 403;
    throw err;
  }

  ride.status = 'PUBLISHED';
  await ride.save();

  return ride;
}

/**
 * Retrieve all rides published or drafted by a specific driver
 */
export async function getDriverRides(driverUserId, { status } = {}) {
  const query = { driverId: driverUserId };
  if (status) {
    query.status = status.toUpperCase();
  }

  const rides = await Ride.find(query)
    .sort({ departureTime: -1 })
    .populate('driverId', 'firstName lastName email phone averageRating avatar');

  return rides;
}

/**
 * Get single ride with driver details
 */
export async function getRideById(rideId) {
  const ride = await Ride.findById(rideId).populate(
    'driverId',
    'firstName lastName email phone avatarUrl averageRating totalRatings'
  );

  if (!ride) {
    const err = new Error('Ride not found.');
    err.statusCode = 404;
    throw err;
  }

  let driverProfile = null;
  let vehicle = null;

  if (ride.driverId) {
    driverProfile = await Driver.findOne({ userId: ride.driverId._id }).lean();
    if (driverProfile) {
      vehicle = await Vehicle.findOne({ driverId: driverProfile._id }).lean();
    }
  }

  return enrichRide(ride, driverProfile, vehicle);
}

/**
 * Search and filter published rides for passengers marketplace
 */
export async function searchPublishedRides({
  from,
  to,
  date,
  minSeats,
  maxPrice,
  sortBy = 'earliest',
  timeOfDay,
  verifiedOnly = false,
  page = 1,
  limit = 20,
}) {
  const query = {
    status: 'PUBLISHED',
  };

  // Available seats filter
  const seatsRequired = Math.max(1, parseInt(minSeats, 10) || 1);
  query.availableSeats = { $gte: seatsRequired };

  // Max price filter
  if (maxPrice && !isNaN(Number(maxPrice))) {
    query.pricePerSeat = { $lte: Number(maxPrice) };
  }

  // Date filtering
  if (date) {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);
    const now = new Date(Date.now() - 15 * 60 * 1000);
    query.departureTime = {
      $gte: startOfDay < now ? now : startOfDay,
      $lte: endOfDay,
    };
  } else {
    query.departureTime = { $gte: new Date(Date.now() - 15 * 60 * 1000) };
  }

  // Origin matching
  if (from && from.trim()) {
    const originTerm = from.split(',')[0].trim();
    if (originTerm) {
      query.originAddress = { $regex: escapeRegex(originTerm), $options: 'i' };
    }
  }

  // Destination matching
  if (to && to.trim()) {
    const destTerm = to.split(',')[0].trim();
    if (destTerm) {
      query.destinationAddress = { $regex: escapeRegex(destTerm), $options: 'i' };
    }
  }

  // Sort criteria
  let sortCriteria = { departureTime: 1 };
  if (sortBy === 'lowest-price') {
    sortCriteria = { pricePerSeat: 1, departureTime: 1 };
  } else if (sortBy === 'highest-price') {
    sortCriteria = { pricePerSeat: -1, departureTime: 1 };
  }

  const rides = await Ride.find(query)
    .sort(sortCriteria)
    .populate('driverId', 'firstName lastName email phone avatarUrl averageRating totalRatings');

  // Enrich with Driver Profile and Vehicle
  const driverUserIds = rides
    .map((r) => r.driverId?._id)
    .filter(Boolean);

  const driverProfiles = await Driver.find({ userId: { $in: driverUserIds } }).lean();
  const driverProfileMap = new Map(driverProfiles.map((d) => [d.userId.toString(), d]));

  const driverProfileIds = driverProfiles.map((d) => d._id);
  const vehicles = await Vehicle.find({ driverId: { $in: driverProfileIds } }).lean();
  const vehicleMap = new Map(vehicles.map((v) => [v.driverId.toString(), v]));

  let enrichedRides = rides.map((rideDoc) => {
    const userIdStr = rideDoc.driverId?._id?.toString();
    const dProf = userIdStr ? driverProfileMap.get(userIdStr) : null;
    const veh = dProf ? vehicleMap.get(dProf._id.toString()) : null;
    return enrichRide(rideDoc, dProf, veh);
  });

  // Filter verified drivers
  if (verifiedOnly) {
    enrichedRides = enrichedRides.filter((r) => r.driver.isVerified);
  }

  // Filter time of day (morning: 0-12, afternoon: 12-18, evening: 18-24)
  if (timeOfDay && timeOfDay !== 'all') {
    enrichedRides = enrichedRides.filter((r) => {
      const depDate = new Date(r.departureTime);
      const hour = depDate.getHours();
      if (timeOfDay === 'morning') return hour < 12;
      if (timeOfDay === 'afternoon') return hour >= 12 && hour < 18;
      if (timeOfDay === 'evening') return hour >= 18;
      return true;
    });
  }

  // Sort by driver rating
  if (sortBy === 'rating') {
    enrichedRides.sort((a, b) => (b.driver.rating || 0) - (a.driver.rating || 0));
  }

  const total = enrichedRides.length;
  const pageNum = Math.max(1, page);
  const limitNum = Math.max(1, limit);
  const paginated = enrichedRides.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return {
    rides: paginated,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
}

/**
 * Delete draft or cancel published ride
 */
export async function cancelOrDeleteRide(rideId, driverUserId) {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    const err = new Error('Ride not found.');
    err.statusCode = 404;
    throw err;
  }

  if (ride.driverId.toString() !== driverUserId.toString()) {
    const err = new Error('Unauthorized to modify this ride.');
    err.statusCode = 403;
    throw err;
  }

  if (ride.status === 'DRAFT') {
    await Ride.findByIdAndDelete(rideId);
    return { message: 'Draft ride deleted successfully.' };
  }

  ride.status = 'CANCELLED';
  await ride.save();
  return { message: 'Ride has been cancelled.' };
}
