import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  genre: { type: String, required: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  duration: Number,
  url: String,
  thumbnail: String,
}, { timestamps: true });

const Song = mongoose.model("Song", songSchema);
export default Song;
