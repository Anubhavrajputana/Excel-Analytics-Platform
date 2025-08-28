import React, { useState, useEffect } from "react";
import UploadCard from "../components/UploadCard";
import ChartViewer from "../components/ChartViewer";
import SummaryCard from "../components/SummaryCard";
import "../styles/Summary.css";
import { toast } from "react-toastify";
import axios from "axios"; // ✅ axios for authorized requests

const Summary = () => {
  const [excelData, setExcelData] = useState([]);
  const [userSummaries, setUserSummaries] = useState([]);
  const hasData = excelData && excelData.length > 0;

  // 🔄 Fetch existing summaries from backend
  useEffect(() => {
    const fetchSummaries = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("⚠️ Please log in again. Token missing.");
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/summaries`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUserSummaries(data);
        } else {
          toast.error(data.error || "❌ Failed to load summaries");
          console.error("Backend error:", data.error);
        }
      } catch (err) {
        toast.error("❌ Error fetching summaries");
        console.error("Fetch error:", err);
      }
    };

    fetchSummaries();
  }, []);

  // 🔘 Handle Generate Summary
  const handleGenerateSummary = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("⚠️ Please log in first.");
      return;
    }

    if (!hasData) {
      toast.warn("📂 Please upload Excel data first.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/summary`,
        { data: excelData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.summary) {
        toast.success("✅ Summary generated!");
        // Show latest summary on top
        setUserSummaries((prev) => [
          { summary: res.data.summary, createdAt: new Date().toISOString(), _id: Date.now() },
          ...prev,
        ]);
      } else {
        toast.error("❌ No summary received from backend.");
      }
    } catch (err) {
      console.error("❌ Error generating summary:", err);
      toast.error("❌ Failed to generate summary");
    }
  };

  return (
    <div className="summary-wrapper">
      {/* Floating animated icons */}
      <ul className="floating-summary-icons">
        <li>📈</li>
        <li>📊</li>
        <li>📄</li>
        <li>📥</li>
        <li>🧾</li>
        <li>📤</li>
        <li>🧮</li>
        <li>🗂️</li>
      </ul>

      {/* Frosted Main Card */}
      <div className="container-fluid bg-dark bg-opacity-50 p-4 rounded-4 shadow-lg border border-light summary-glass">
        <h2 className="fw-bold text-light mb-4 text-center">
          📥 Upload & Analyze Excel
        </h2>

        {/* Upload Card */}
        <div className="mb-4">
          <UploadCard onDataParsed={setExcelData} />
        </div>

        {/* Chart Viewer */}
        {hasData && (
          <div className="mb-5">
            <ChartViewer data={excelData} />
          </div>
        )}

        {/* Summary Card or Upload Message */}
        <div className="mt-4">
          {hasData ? (
            <>
              <SummaryCard data={excelData} />
              <div className="text-center mt-3">
                <button
                  className="btn btn-primary"
                  onClick={handleGenerateSummary}
                >
                  Generate Summary
                </button>
              </div>
            </>
          ) : (
            <div
              className="alert alert-info text-center bg-opacity-75"
              style={{
                backgroundColor: "#6f42c1",
                color: "#fff",
                border: "none",
              }}
            >
              📂 Please upload an Excel file to enable summary generation.
            </div>
          )}
        </div>

        {/* 🔁 Previous User Summaries */}
        {userSummaries.length > 0 && (
          <div className="mt-5">
            <h4 className="text-light mb-3">📜 Your Previous Summaries</h4>
            <div className="list-group">
              {userSummaries.map((s) => (
                <div
                  key={s._id}
                  className="list-group-item list-group-item-dark bg-opacity-75 mb-2 rounded"
                  style={{ backgroundColor: "#343a40", color: "#fff" }}
                >
                  <pre className="mb-1" style={{ whiteSpace: "pre-wrap" }}>
                    {s.summary}
                  </pre>
                  <small className="text-muted">
                    ⏱️ {new Date(s.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
