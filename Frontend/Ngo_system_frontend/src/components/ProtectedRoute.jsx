import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("❌ Error parsing user from localStorage:", error);
    user = null; // ensure user stays null if parsing fails
  }

  if (!user) {
    console.warn("⚠️ No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Case-insensitive role check
  if (
    !allowedRoles.map((r) => r.toLowerCase()).includes(user.role?.toLowerCase())
  ) {
    console.warn("⚠️ Unauthorized access attempt. Role:", user.role);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
