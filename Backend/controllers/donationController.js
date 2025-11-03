import mongoose from "mongoose";
import Donation from "../models/Donation.js";
import Volunteer from "../models/Volunteer.js";

// Donor creates donation
export const createDonation = async (req, res) => {
  try {
    const { type, quantity } = req.body;
    const donorId = req.user.id;

    if (!type || !quantity) {
      return res.status(400).json({ message: "Type and quantity are required." });
    }

    const donation = new Donation({
      type,
      quantity,
      donorId: new mongoose.Types.ObjectId(donorId),
    });

    await donation.save();
    res.status(201).json({ message: "Donation created successfully", donation });
  } catch (err) {
    res.status(500).json({ message: "Server error creating donation" });
  }
};

// Admin: Approve a donation
export const approveDonation = async (req, res) => {
  try {
    if (!req.user.role || req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can approve donations" });
    }
    const { id } = req.params;
    const donation = await Donation.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    res.json({ message: "Donation approved", donation });
  } catch (err) {
    res.status(500).json({ message: "Error approving donation" });
  }
};

// Admin: Assign a volunteer (only if approved)
export const assignVolunteer = async (req, res) => {
  try {
    if (!req.user.role || req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can assign volunteers" });
    }
    const { id } = req.params;
    const { volunteerId } = req.body;

    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    const donation = await Donation.findById(id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    if (donation.status !== "approved") {
      return res.status(400).json({ message: "Donation must be approved first" });
    }

    donation.assignedTo = volunteer._id;
    donation.status = "assigned";
    await donation.save();

    await donation.populate({
      path: "assignedTo",
      populate: { path: "userId", select: "name email phone location role" },
    });

    res.json({ message: "Volunteer assigned", donation });
  } catch (err) {
    res.status(500).json({ message: "Error assigning volunteer" });
  }
};

// Volunteer: Mark task as completed (needs admin approval)
export const markCompleted = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can mark tasks completed" });
    }
    const { id } = req.params;
    const { completionProof } = req.body;

    const donation = await Donation.findById(id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    const volunteer = await Volunteer.findOne({ userId: req.user.id });
    if (!volunteer || donation.assignedTo.toString() !== volunteer._id.toString()) {
      return res.status(403).json({ message: "Not assigned to you" });
    }

    donation.status = "completed";
    donation.completionProof = completionProof || "";
    await donation.save();

    res.json({ message: "Task marked as completed, waiting for admin approval", donation });
  } catch (err) {
    res.status(500).json({ message: "Error marking task completed" });
  }
};

// Admin: Approve volunteer completion and award points
export const approveCompletion = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can approve completion" });
    }

    const { id } = req.params;
    const { points } = req.body;

    const donation = await Donation.findById(id);
    if (!donation || donation.status !== "completed") {
      return res.status(400).json({ message: "Task not marked completed yet" });
    }

    donation.status = "approvedByAdmin";
    donation.pointsAwarded = points || 0;
    await donation.save();

    await Volunteer.findByIdAndUpdate(donation.assignedTo, {
      $inc: { points: points || 0 },
    });

    res.json({ message: "Completion approved and points awarded", donation });
  } catch (err) {
    res.status(500).json({ message: "Error approving completion" });
  }
};

// Admin: Get all donations
export const getAllDonations = async (req, res) => {
  try {
    if (!req.user.role || req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can view all donations" });
    }
    const donations = await Donation.find()
      .populate("donorId", "name email phone location role")
      .populate({
        path: "assignedTo",
        populate: { path: "userId", select: "name email phone location role" },
      });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching donations" });
  }
};

// Donor gets only their donations
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      donorId: new mongoose.Types.ObjectId(req.user.id),
    });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching donations" });
  }
};

// Get donation details by ID
export const getDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findById(id)
      .populate("donorId", "name email phone location role")
      .populate("assignedTo", "name email phone location role");

    if (!donation) return res.status(404).json({ message: "Donation not found" });

    const user = req.user;
    if (
      user.role.toLowerCase() !== "admin" &&
      String(donation.donorId._id) !== user.id &&
      (!donation.assignedTo || String(donation.assignedTo._id) !== user.id)
    ) {
      return res.status(403).json({ message: "Not authorized to view this donation" });
    }

    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching donation details" });
  }
};

// GET assigned donations for volunteer
export const getAssignedDonations = async (req, res) => {
  try {
    const role = req.user.role?.toLowerCase();
    if (role !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can view assigned donations" });
    }

    const volunteer = await Volunteer.findOne({ userId: req.user.id });
    if (!volunteer) return res.json([]);

    const donations = await Donation.find({ assignedTo: volunteer._id })
      .populate("donorId", "name email phone location role")
      .populate({
        path: "assignedTo",
        populate: { path: "userId", select: "name email role" },
      });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching assigned donations" });
  }
};

// Admin or Donor: Delete a donation
export const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role?.toLowerCase();

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // ✅ Allow admin OR donor who created it (if not approved yet)
    if (userRole !== "admin" && String(donation.donorId) !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this donation" });
    }

    if (userRole !== "admin" && donation.status === "approved") {
      return res.status(400).json({ message: "Cannot delete approved donation" });
    }

    await Donation.findByIdAndDelete(id);
    res.json({ message: "Donation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting donation" });
  }
};
