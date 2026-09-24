import mongoose from 'mongoose';

const rideRequestSchema = new mongoose.Schema(
  {
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
      index: true,
    },
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    seatsRequested: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// One active request per passenger per ride
rideRequestSchema.index({ rideId: 1, passengerId: 1 }, { unique: true });

const RideRequest = mongoose.model('RideRequest', rideRequestSchema);
export default RideRequest;
