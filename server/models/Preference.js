import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    targetType: {
      type: String,
      required: true,
      enum: ["SONG", "ARTIST", "GENRE"],
    },
    targetId: {
      type: mongoose.Schema.Types.Mixed, // Can be ObjectId (Song/Artist) or String (Genre name)
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Unique index to ensure one preference record per user per target
preferenceSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });
// Index for fast retrieval of top preferences
preferenceSchema.index({ userId: 1, targetType: 1, score: -1 });

const Preference = mongoose.model("Preference", preferenceSchema);

export default Preference;
