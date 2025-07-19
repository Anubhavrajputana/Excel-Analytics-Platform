import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from 'jwt-decode';  // ✅ default import



const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If token is missing, redirect
  if (!token) return <Navigate to="/login" replace />;

  try {
    const { exp } = jwt_decode(token);  // correct name
    if (Date.now() >= exp * 1000) {
      // Token expired
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    // Invalid token
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // Token is valid
  return children;
};

export default PrivateRoute;
