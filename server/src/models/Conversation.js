import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
      index: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique conversation per ride and pair of participants
conversationSchema.index({ rideId: 1, participants: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
