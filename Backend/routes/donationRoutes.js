import express from "express";
import {
  createDonation,
  getAllDonations,
  getMyDonations,
  getDonationById,
  approveDonation,
  assignVolunteer,
  markCompleted,
  approveCompletion,
  getAssignedDonations,
} from "../controllers/donationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { deleteDonation } from "../controllers/donationController.js";


const router = express.Router();

// Donor creates donation
router.post("/", authMiddleware, createDonation);

// Admin: get all donations
router.get("/", authMiddleware, getAllDonations);

// Donor: get own donations
router.get("/my", authMiddleware, getMyDonations);

// Volunteer: get assigned donations
router.get("/assigned", authMiddleware, getAssignedDonations);

// Common: get donation by ID (donor, volunteer, or admin can access)
router.get("/:id", authMiddleware, getDonationById);

// Admin: approve donation
router.patch("/:id/approve", authMiddleware, approveDonation);

// Admin: assign volunteer to donation
router.patch("/:id/assign", authMiddleware, assignVolunteer);

// Volunteer: mark donation/task as completed (requires admin approval later)
router.post("/:id/complete", authMiddleware, markCompleted);

// Admin: approve completion & award points
router.post("/:id/approveCompletion", authMiddleware, approveCompletion);
// admiin: delete own donation if not yet approved
router.delete("/:id", authMiddleware, deleteDonation);

export default router;
