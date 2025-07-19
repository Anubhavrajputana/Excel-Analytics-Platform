import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Charts from "./pages/Charts";
import Summary from "./pages/Summary";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Layout & Auth
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Google OAuth
import { GoogleOAuthProvider } from "@react-oauth/google";

// Load Google Client ID from .env
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <Layout>
                  <Upload />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/charts"
            element={
              <PrivateRoute>
                <Layout>
                  <Charts />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/summary"
            element={
              <PrivateRoute>
                <Layout>
                  <Summary />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Layout>
                  <AdminPanel />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<div className="text-center mt-5">404 - Page Not Found</div>} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
