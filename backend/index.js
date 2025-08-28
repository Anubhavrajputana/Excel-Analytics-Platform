// src/backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { OpenAI } from "openai";
import jwt from "jsonwebtoken";
import validateEnv from "./utils/envValidator.js";

// Models
import Summary from "./models/Summary.js";
import User from "./models/User.js";

// Routes & Middleware
import authRoutes from "./routes/auth.js";
import chartRoutes from "./routes/charts.js";
import summaryRoutes from "./routes/summaries.js";
import dashboardRoutes from "./routes/dashboard.js";
import adminRoutes from "./routes/admin.js";
import { verifyToken } from "./middleware/verifyToken.js";

// Load and validate environment variables
dotenv.config();
validateEnv();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/excel_ai";
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/charts", chartRoutes);
app.use("/api/summaries", summaryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

// Summary Generator
app.post("/api/summary", verifyToken, async (req, res) => {
  try {
    const excelData = req.body.data;
    if (!excelData || excelData.length === 0) {
      return res.status(400).json({ error: "No data provided" });
    }

    const keys = Object.keys(excelData[0]);
    const values = excelData.map((row) => Number(row[keys[1]]) || 0);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    const dummySummary = `
• Total Rows Analyzed: ${excelData.length}
• Highest value in "${keys[1]}" is ${maxVal}.
• Lowest value is ${minVal}.
• Insights indicate variations across "${keys[0]}" category.
`;

    const summaryDoc = new Summary({
      summary: dummySummary,
      user: req.user.id,
    });

    await summaryDoc.save();
    res.json({ summary: dummySummary });
  } catch (err) {
    console.error("❌ /api/summary error:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// User summaries
app.get("/api/summaries", verifyToken, async (req, res) => {
  try {
    const summaries = await Summary.find({ user: req.user.id }).sort({ _id: -1 });
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summaries" });
  }
});

// Dashboard Stats
app.get("/api/stats", verifyToken, async (req, res) => {
  try {
    const uploaded = await Summary.countDocuments({ user: req.user.id });
    const charts = uploaded;
    const users = 1;
    res.json({ uploaded, charts, users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("🧠 Excel Analytics API is live!");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
