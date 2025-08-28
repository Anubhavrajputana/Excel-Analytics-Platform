// src/backend/models/Chart.js
import mongoose from "mongoose";

const chartSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true }, // e.g. bar, line, pie
    data: { type: Object, required: true }, // store actual chart data (labels, datasets, etc.)
    createdBy: { type: String }, // optional: user email or ID
  },
  { timestamps: true }
);

export default mongoose.model("Chart", chartSchema);
