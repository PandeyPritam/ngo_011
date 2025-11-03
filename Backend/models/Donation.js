import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["clothes", "books", "food", "money", "others"],
    },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "assigned",
        "completed",
        "approvedByAdmin",
        "used",
      ],
      default: "pending",
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },
    usedFor: { type: String },
    completionProof: { type: String }, // added
    pointsAwarded: { type: Number, default: 0 }, // added
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
