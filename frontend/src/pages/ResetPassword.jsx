import React, { useState } from "react";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [form, setForm] = useState({ email: "", token: "", newPassword: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      res.ok ? toast.success(data.message) : toast.error(data.error);
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div style={{
      background: "#111827",
      color: "white",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#1f2937",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 0 10px #000",
          width: "100%",
          maxWidth: "400px"
        }}
      >
        <h2 className="text-center mb-4">🔐 Reset Your Password</h2>

        <input
          type="email"
          placeholder="📧 Enter your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="form-control mb-3"
        />
        <input
          type="text"
          placeholder="🔢 Enter the 6-digit OTP"
          value={form.token}
          onChange={(e) => setForm({ ...form, token: e.target.value })}
          required
          className="form-control mb-3"
        />
        <input
          type="password"
          placeholder="🔐 New password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          required
          className="form-control mb-3"
        />

        <button type="submit" className="btn btn-success w-100">
          ✅ Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
