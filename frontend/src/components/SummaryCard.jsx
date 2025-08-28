import React, { useState } from "react";
import { toast } from "react-toastify";

const SummaryCard = ({ data }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

const generateSummary = async () => {
  if (!data || data.length === 0) {
    toast.error("No data available for summary.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Login token not found. Please log in again.");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("http://localhost:5000/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Added token
      },
      body: JSON.stringify({ data }),
    });

    const json = await res.json();
    if (res.ok && json?.summary) {
      setSummary(json.summary);
    } else {
      toast.error(json?.error || "No summary received from backend.");
    }
  } catch (err) {
    toast.error("Error generating summary.");
    console.error("Summary error:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h4 className="card-title text-primary mb-3">🧠 AI Summary</h4>
        <p className="text-muted">Click the button to generate a summary from your Excel data.</p>

        <button
          className="btn btn-primary"
          disabled={loading || !data || data.length === 0}
          onClick={generateSummary}
        >
          {loading && (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {loading ? "Generating..." : "Generate Summary"}
        </button>

        {summary && (
          <div className="mt-4 bg-light rounded p-3 border border-primary-subtle">
            <pre className="mb-0">{summary}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
