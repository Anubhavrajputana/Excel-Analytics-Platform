// routes/charts.js
import express from "express";
import Chart from "../models/Chart.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/latest", verifyToken, async (req, res) => {
  try {
    const latest = await Chart.findOne().sort({ createdAt: -1 });
    res.json({ chart: latest });
  } catch (err) {
    console.error("❌ Error fetching latest chart:", err);
    res.status(500).json({ error: "Failed to fetch latest chart" });
  }
});

export default router;
