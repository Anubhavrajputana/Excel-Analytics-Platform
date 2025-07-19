import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import jwt_decode from "jwt-decode"; // ✅ Decode token

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Please verify the captcha");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);

        const decoded = jwt_decode(data.token); // ✅ Decode token
        console.log("Logged in as:", decoded.email);

        localStorage.setItem("email", decoded.email); // ✅ Store email

        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong during login.");
      console.error("Login error:", err);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const token = credentialResponse?.credential;

    if (!token) {
      toast.error("Google login failed.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);

        const decoded = jwt_decode(data.token);
        console.log("Google login as:", decoded.email);

        localStorage.setItem("email", decoded.email); // ✅ Save email

        toast.success("Google login successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.error || "Google login failed.");
      }
    } catch (err) {
      toast.error("Google login error.");
      console.error("Google login error:", err);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        className="p-4 shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          color: "#fff",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2 className="mb-4 text-center">🔐 Developer Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="👨‍💻 Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                backgroundColor: "#1c1c2c",
                color: "#fff",
                border: "none",
              }}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="🔑 Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                backgroundColor: "#1c1c2c",
                color: "#fff",
                border: "none",
              }}
            />
          </div>

          {/* ✅ Google reCAPTCHA */}
          <div className="mb-3 d-flex justify-content-center">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
              theme="dark"
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            🚀 Login
          </button>
        </form>

        <div className="my-4 text-center text-light">— or —</div>

        {/* Google Login */}
        <div className="d-flex justify-content-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google login failed.")}
          />
        </div>

        {/* Links */}
        <p className="mt-3 text-center text-light">
          <Link to="/forgot-password" className="text-info">
            Forgot Password?
          </Link>
        </p>

        <p className="text-center text-light">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-warning">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
