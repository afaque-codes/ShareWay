import {
  createRide,
  publishRide,
  getDriverRides,
  getRideById,
  cancelOrDeleteRide,
  calculateRoutePreview,
  searchPublishedRides,
} from '../services/ride.service.js';
import { searchPlaces } from '../services/osrm.service.js';
import { createRideSchema, routePreviewSchema } from '../validators/ride.validator.js';

/**
 * GET /api/rides - Search published rides with real-time filters
 */
export async function searchRidesHandler(req, res, next) {
  try {
    const {
      origin,
      from,
      destination,
      to,
      date,
      minSeats,
      maxPrice,
      sortBy,
      timeOfDay,
      timeFilter,
      verifiedOnly,
      page,
      limit,
    } = req.query;

    const result = await searchPublishedRides({
      from: from || origin,
      to: to || destination,
      date,
      minSeats,
      maxPrice,
      sortBy,
      timeOfDay: timeOfDay || timeFilter,
      verifiedOnly: verifiedOnly === 'true' || verifiedOnly === true,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });

    res.status(200).json({
      success: true,
      count: result.rides.length,
      total: result.total,
      data: {
        rides: result.rides,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/rides/places - Search matching locations for origin/destination autocomplete
 */
export async function getPlacesSuggestions(req, res, next) {
  try {
    const query = req.query.q || req.query.query || '';
    const places = await searchPlaces(query);

    res.status(200).json({
      success: true,
      count: places.length,
      data: { places },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/rides/preview - Calculate route & OSRM details on the fly
 */
export async function previewRoute(req, res, next) {
  try {
    const validatedData = routePreviewSchema.parse(req.body);
    const preview = await calculateRoutePreview(validatedData);

    res.status(200).json({
      success: true,
      data: preview,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/rides - Create and publish (or draft) a new ride
 */
export async function createNewRide(req, res, next) {
  try {
    const validatedData = createRideSchema.parse(req.body);
    const ride = await createRide(req.user._id, validatedData);

    res.status(201).json({
      success: true,
      message:
        ride.status === 'PUBLISHED'
          ? 'Ride published successfully!'
          : 'Ride saved as draft.',
      data: { ride },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/rides/:id/publish - Transition draft ride to published
 */
export async function publishDraftRide(req, res, next) {
  try {
    const ride = await publishRide(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Ride has been published to the community marketplace.',
      data: { ride },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/rides/my-rides - Retrieve authenticated driver's rides
 */
export async function getMyRides(req, res, next) {
  try {
    const status = req.query.status;
    const rides = await getDriverRides(req.user._id, { status });

    res.status(200).json({
      success: true,
      count: rides.length,
      data: { rides },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/rides/:id - Get specific ride details
 */
export async function getSingleRide(req, res, next) {
  try {
    const ride = await getRideById(req.params.id);

    res.status(200).json({
      success: true,
      data: { ride },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/rides/:id - Delete draft or cancel published ride
 */
export async function deleteOrCancelRide(req, res, next) {
  try {
    const result = await cancelOrDeleteRide(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}
