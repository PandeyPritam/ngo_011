import Volunteer from "../models/Volunteer.js";
import Donation from "../models/Donation.js";

// Volunteer self-register
export const registerVolunteer = async (req, res) => {
  try {
    const { skills, availability } = req.body;
    const volunteer = await Volunteer.create({
      userId: req.user.id,
      skills,
      availability,
    });
    res.status(201).json(volunteer);
  } catch (error) {
    res.status(500).json({ message: "Error registering volunteer", error });
  }
};

// Admin: get all volunteers
export const getAllVolunteers = async (req, res) => {
  try {
    if (!req.user.role || req.user.role.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can view all volunteers" });
    }
    const volunteers = await Volunteer.find().populate(
      "userId",
      "name email role"
    );
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching volunteers" });
  }
};

// Admin: assign a volunteer to a donation
export const assignVolunteerToDonation = async (req, res) => {
  try {
    const { volunteerId, donationId } = req.body;

    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    donation.assignedTo = volunteer._id;
    await donation.save();

    res.json({
      message: "Volunteer assigned to donation successfully",
      donation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning volunteer to donation", error });
  }
};

// Volunteer: get all donations assigned to them
export const getVolunteerDonations = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user.id });
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // FIX: Populate donorId with all needed fields
    const donations = await Donation.find({ assignedTo: volunteer._id })
      .populate("donorId", "name email phone location");

    res.json(donations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching volunteer donations", error });
  }
};

// Leaderboard: top volunteers by points
export const getLeaderboard = async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
      .populate("userId", "name email")
      .sort({ points: -1 }) // highest points first
      .limit(5);

    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error });
  }
};

// ✅ Admin: Delete a volunteer (and unassign their donations)
export const deleteVolunteer = async (req, res) => {
  try {
    if (!req.user.role || req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can delete volunteers" });
    }

    const { id } = req.params;
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // Unassign all donations where this volunteer was assigned
    await Donation.updateMany(
      { assignedTo: volunteer._id },
      { $unset: { assignedTo: "" }, status: "approved" } // reset to approved so admin can reassign
    );

    await Volunteer.findByIdAndDelete(id);
    res.json({ message: "Volunteer deleted and unassigned from donations" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting volunteer", error });
  }
};
