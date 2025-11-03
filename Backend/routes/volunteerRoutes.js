import express from "express";
import {
  registerVolunteer,
  getAllVolunteers,
  getLeaderboard,
  getVolunteerDonations, // fixed import
} from "../controllers/volunteerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { deleteVolunteer } from "../controllers/volunteerController.js";

const router = express.Router();

// Volunteer self-register
router.post("/register", authMiddleware, registerVolunteer);

// Admin → view all volunteers
router.get("/", authMiddleware, getAllVolunteers);

// Volunteer → view their assigned donations
router.get("/assigned", authMiddleware, getVolunteerDonations);

// Leaderboard (all volunteers sorted by points)
router.get("/leaderboard", authMiddleware, getLeaderboard);
// Admin → delete a volunteer (and unassign their donations)
router.delete("/:id", authMiddleware, deleteVolunteer);

export default router;
