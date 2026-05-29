import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    interactionType: {
      type: String,
      required: true,
      enum: ["PLAY", "REPLAY", "LIKE", "PLAYLIST_ADD", "FOLLOW", "SKIP"],
    },
    entityType: {
      type: String,
      required: true,
      enum: ["SONG", "ARTIST", "PLAYLIST"],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for efficient retrieval of user interactions
interactionSchema.index({ userId: 1, timestamp: -1 });

const Interaction = mongoose.model("Interaction", interactionSchema);

export default Interaction;
