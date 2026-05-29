import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  genres: [String],
  profileImage: String,
  verified: { type: Boolean, default: false },
});

const Artist = mongoose.model("Artist", artistSchema);
export default Artist;
