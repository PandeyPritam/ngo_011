import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skills: [String],
  availability: String,
  points: { type: Number, default: 0 },
});

export default mongoose.model("Volunteer", volunteerSchema);
