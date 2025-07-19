import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const SavedSummaries = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("⚠️ Login token missing. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/summaries", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result?.error || "Failed to fetch summaries");
        }

        const summariesArray = Array.isArray(result) ? result : result?.summaries || [];
setSummaries(summariesArray);

      } catch (err) {
        toast.error("❌ Failed to load summaries.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false); // Stop loading once done
      }
    };

    fetchSummaries();
  }, []);

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h4 className="card-title text-primary mb-4">🗃️ Saved AI Summaries</h4>

        {/* Loading spinner */}
        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : summaries.length === 0 ? (
          <div className="alert alert-info">No summaries saved yet.</div>
        ) : (
          <div className="row g-3">
            {summaries.map((s, idx) => (
              <div className="col-12" key={s._id || idx}>
                <div className="card border-start border-4 border-primary shadow-sm h-100">
                  <div className="card-body">
                    <p className="card-text text-dark" style={{ whiteSpace: "pre-line" }}>
                      {s.summary}
                    </p>
                    <p className="text-muted small mt-3">
                      Saved on: {new Date(s.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSummaries;
