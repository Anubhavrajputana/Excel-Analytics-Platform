import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
  summary: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Summary = mongoose.model("Summary", summarySchema);
export default Summary;
