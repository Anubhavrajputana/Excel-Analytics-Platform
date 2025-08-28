import express from "express";
const router = express.Router();

router.get("/stats", (req, res) => {
  res.json({
    uploaded: 128,
    charts: 52,
    users: 23,
  });
});

router.get("/summaries", (req, res) => {
  res.json({
    summaries: [
      { _id: "1", summary: "Revenue grew by 20% compared to Q1." },
      { _id: "2", summary: "User engagement dropped slightly in May." },
      { _id: "3", summary: "Product A dominated in South Asia." },
    ],
  });
});

export default router;
