import express from "express";
const router = express.Router();
import Summary from "../models/Summary.js";
import {verifyToken} from "../middleware/verifyToken.js";

// 🧾 GET summaries for current user (protected)
router.get("/", verifyToken, async (req, res) => {
  try {
    const summaries = await Summary.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(summaries);
  } catch (err) {
    console.error("GET /summaries error:", err);
    res.status(500).json({ error: "Failed to fetch summaries." });
  }
});

// 📝 POST a new summary (protected)
router.post("/", verifyToken, async (req, res) => {
  const { summary } = req.body;

  if (!summary?.trim()) {
    return res.status(400).json({ error: "Summary is required." });
  }

  try {
    const newSummary = new Summary({
      summary,
      user: req.user.id,
    });

    await newSummary.save();
    res.status(201).json({ message: "Summary saved successfully." });
  } catch (err) {
    console.error("POST /summaries error:", err);
    res.status(500).json({ error: "Failed to save summary." });
  }
});

// 🗑️ DELETE by ID (only if owned by user)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const summary = await Summary.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!summary) {
      return res.status(404).json({ error: "Summary not found or unauthorized." });
    }

    res.json({ message: "Summary deleted." });
  } catch (err) {
    console.error("DELETE /summaries/:id error:", err);
    res.status(500).json({ error: "Failed to delete summary." });
  }
});

// ⚠️ ADMIN: DELETE ALL summaries (with password)
router.delete("/", async (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Unauthorized: Invalid admin password." });
  }

  try {
    await Summary.deleteMany({});
    res.json({ message: "All summaries deleted." });
  } catch (err) {
    console.error("DELETE ALL /summaries error:", err);
    res.status(500).json({ error: "Failed to clear summaries." });
  }
});

// ⚠️ ADMIN: DELETE specific summary by ID (with password)
router.post("/delete-summary", verifyToken, async (req, res) => {
  const { summaryId, password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized: Incorrect password" });
  }

  try {
    const deleted = await Summary.findByIdAndDelete(summaryId);
    if (!deleted) return res.status(404).json({ error: "Summary not found" });

    res.json({ message: "Summary deleted successfully." });
  } catch (err) {
    console.error("❌ Delete summary error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
