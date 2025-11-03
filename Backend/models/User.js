import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: function() { return this.role !== "Admin"; } },
    location: { type: String, required: function() { return this.role !== "Admin"; } },
    role: {
      type: String,
      enum: ["Donor", "Volunteer", "Admin"],
      default: "Donor",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
