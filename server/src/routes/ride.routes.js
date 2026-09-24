import { Router } from 'express';
import {
  createNewRide,
  publishDraftRide,
  getMyRides,
  getSingleRide,
  deleteOrCancelRide,
  previewRoute,
  getPlacesSuggestions,
  searchRidesHandler,
} from '../controllers/ride.controller.js';
import { protect, requireDriver } from '../middleware/auth.middleware.js';

const router = Router();

// Location autocomplete / search endpoint (places dropdown)
router.get('/places', getPlacesSuggestions);

// Preview route geometry, duration, distance (protected driver preview)
router.post('/preview', protect, requireDriver, previewRoute);

// Create a new ride (Draft or Published)
router.post('/', protect, requireDriver, createNewRide);

// Get current driver's rides
router.get('/my-rides', protect, requireDriver, getMyRides);

// Search published rides (Passenger marketplace)
router.get('/', searchRidesHandler);

// Get specific ride details
router.get('/:id', getSingleRide);

// Publish a draft ride
router.patch('/:id/publish', protect, requireDriver, publishDraftRide);

// Delete draft or cancel published ride
router.delete('/:id', protect, requireDriver, deleteOrCancelRide);

export default router;
