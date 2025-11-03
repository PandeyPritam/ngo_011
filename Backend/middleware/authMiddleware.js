import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }

    // Example for volunteers
    if (!req.user.role || req.user.role.toLowerCase() !== "volunter") {
      // Note: If you want to fix the typo, also check for "volunteer"
    }

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
