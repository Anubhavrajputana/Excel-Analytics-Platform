import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // 👈 Step 1
import { color } from "chart.js/helpers";
import "./Login.css";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // 👈 Step 2

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        navigate("/reset-password", { state: { email } }); // 👈 Step 3
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #1f1c2c, #928dab)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "30px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          color: "#fff",
          backdropFilter: "blur(10px)"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          🔐 Forgot Password
        </h2>

        <div className="form-group mb-3">
          <input
  type="email"
  placeholder="📧 Enter your email"
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="form-control"
  style={{
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    width: "100%",
    backgroundColor: "#2a2e45",
    color: "#fff"
  }}
/>

        </div>

        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#10b981",
            border: "none",
            color: "#fff",
            fontWeight: "bold",
            width: "100%",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          ✉️ Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
