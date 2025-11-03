import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Donor-only
router.get("/donor", authMiddleware, roleMiddleware("donor"), (req, res) => {
  res.json({ message: "Welcome Donor! You can donate blood/charity here." });
});

// Volunteer-only
router.get("/volunteer", authMiddleware, roleMiddleware("volunteer"), (req, res) => {
  res.json({ message: "Welcome Volunteer! You can manage donation drives." });
});

// Admin-only
router.get("/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ message: "Welcome Admin! You can manage users & donations." });
});

export default router;
