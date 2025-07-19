// routes/admin.js
import express from "express";
import Summary from "../models/Summary.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// DELETE summary by ID
router.delete("/delete-summary/:id", verifyToken, async (req, res) => {
  try {
    const summaryId = req.params.id;
    const deleted = await Summary.findByIdAndDelete(summaryId);

    if (!deleted) {
      return res.status(404).json({ error: "Summary not found" });
    }

    res.json({ message: "Summary deleted successfully" });
  } catch (err) {
    console.error("❌ Delete summary error:", err);
    res.status(500).json({ error: "Failed to delete summary" });
  }
});

export default router;
