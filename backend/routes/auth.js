import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch"; // 👈 reCAPTCHA validation
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import ResetToken from "../models/ResetToken.js";
import { sendMail } from "../utils/email.js";

dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// 🔐 Utility: Generate JWT

const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });


// ------------------- ✨ Signup ---------------------
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email & password required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    const token = generateToken(newUser);
    res.json({ token });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ------------------- 🔐 Login (with reCAPTCHA) ---------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    // ✅ reCAPTCHA validation
    if (!captchaToken)
      return res.status(400).json({ error: "Captcha token missing" });

    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
    const recaptchaRes = await fetch(verifyURL, { method: "POST" });
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success)
      return res.status(400).json({ error: "Captcha verification failed" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Incorrect password" });

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ------------------- 🌐 Google Login ---------------------
router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, password: "google-oauth" });
    }

    const jwtToken = generateToken(user);
    res.json({ token: jwtToken });
  } catch (err) {
    console.error("❌ Google login error:", err);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// ------------------- ✉️ Forgot Password ---------------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ error: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 min

    await ResetToken.findOneAndUpdate(
      { email },
      { token, expiresAt },
      { upsert: true }
    );

    await sendMail(
      email,
      "🔐 Password Reset Code",
      `Your password reset code is: ${token}\n\nIt is valid for 10 minutes.`
    );

    res.json({ message: "Reset code sent to email." });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------- 🔐 Reset Password ---------------------
router.post("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const resetDoc = await ResetToken.findOne({ email, token });

    if (!resetDoc)
      return res.status(400).json({ error: "Invalid or expired reset code." });

    if (resetDoc.expiresAt < new Date()) {
      await ResetToken.deleteOne({ email });
      return res.status(400).json({ error: "Reset code has expired." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    await ResetToken.deleteOne({ email }); // Clear used token
    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
