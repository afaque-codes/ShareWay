import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
      index: true,
    },
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    plateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    vehicleType: {
      type: String,
      enum: ['sedan', 'suv', 'hatchback', 'van', 'other'],
      default: 'sedan',
    },
    photoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
