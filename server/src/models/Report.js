import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reportedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    reportedRideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      index: true,
    },
    reason: {
      type: String,
      enum: ['HARASSMENT', 'UNSAFE_DRIVING', 'NO_SHOW', 'FRAUD', 'SPAM', 'OTHER'],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'],
      default: 'PENDING',
      index: true,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolutionNotes: {
      type: String,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose custom validation: Report must target at least one entity
reportSchema.pre('validate', function (next) {
  if (!this.reportedUserId && !this.reportedRideId) {
    this.invalidate('reportedUserId', 'Report must target at least one user or ride.');
  }
  next();
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
