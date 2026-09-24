import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Driver is fundamentally a User
      required: true,
      index: true,
    },
    originAddress: {
      type: String,
      required: true,
    },
    originLocation: {
      type: pointSchema,
      required: true,
      index: '2dsphere',
    },
    destinationAddress: {
      type: String,
      required: true,
    },
    destinationLocation: {
      type: pointSchema,
      required: true,
      index: '2dsphere',
    },
    routeGeometry: {
      type: mongoose.Schema.Types.Mixed, // GeoJSON LineString from OSRM
    },
    distanceKm: {
      type: Number,
    },
    durationMinutes: {
      type: Number,
    },
    departureTime: {
      type: Date,
      required: true,
      index: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'DRAFT',
      index: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for searching active rides by status and departure time
rideSchema.index({ status: 1, departureTime: 1 });

const Ride = mongoose.model('Ride', rideSchema);
export default Ride;
