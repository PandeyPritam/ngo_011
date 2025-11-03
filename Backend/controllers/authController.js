import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Regex for validations
const nameRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[^\s@]+@(gmail\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\.[a-zA-Z]{2,})$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phoneRegex = /^[0-9]{10,15}$/; // only digits allowed (10–15)

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey";

// ------------------ REGISTER ------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;
    console.log("Register attempt:", { name, email, role, phone, location });

    // Basic validations
    if (!nameRegex.test(name))
      return res.status(400).json({ message: "Name must contain only alphabets and spaces" });

    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (!passwordRegex.test(password))
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
      });

    // Role-based validation: only Donor/Volunteer require phone & location
    if (role !== "Admin") {
      if (!phone || !phoneRegex.test(phone))
        return res.status(400).json({ message: "Valid phone number is required (10–15 digits)" });

      if (!location || location.trim().length < 2)
        return res.status(400).json({ message: "Location is required for Donor/Volunteer" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object conditionally
    const userData = { name, email, password: hashedPassword, role };
    if (role !== "Admin") {
      userData.phone = phone;
      userData.location = location;
    }

    const user = await User.create(userData);

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------ LOGIN ------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email });

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, role: user.role, name: user.name });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
