import React, { useEffect, useState } from "react";
import { FiBarChart2, FiUpload, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Dashboard.css"; // custom CSS for floating icons

const Dashboard = () => {
  const [stats, setStats] = useState({ uploads: 0, charts: 0, users: 0 });
  const [recentSummaries, setRecentSummaries] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login again.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setStats(data);
      } catch (err) {
        toast.error("Failed to load stats.");
        console.error("Stats error:", err);
      }
    };

    const fetchSummaries = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/summaries?limit=5", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const summariesArray = Array.isArray(data) ? data : data?.summaries || [];

        if (!Array.isArray(summariesArray)) {
          throw new Error("Summaries data is not an array.");
        }

        setRecentSummaries(summariesArray);
      } catch (err) {
        toast.error("Failed to load summaries.");
        console.error("Summary error:", err);
      }
    };

    fetchStats();
    fetchSummaries();
  }, []);

  const handleDeleteSummary = async (summaryId) => {
    const password = prompt("Enter admin password");
    if (!password) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/admin/delete-summary/${summaryId}`, {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});


      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Delete failed");
        return;
      }

      toast.success("Summary deleted!");
      setRecentSummaries((prev) => prev.filter((s) => s._id !== summaryId));
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Floating icons */}
      <ul className="floating-dashboard-icons">
        <li>📊</li>
        <li>📈</li>
        <li>📂</li>
        <li>📥</li>
        <li>🧾</li>
        <li>📄</li>
        <li>🗂️</li>
        <li>📤</li>
      </ul>

      <div className="container-fluid bg-dark bg-opacity-50 rounded-4 shadow-lg p-4 border border-light position-relative">
        <h2 className="fw-bold text-info mb-4 text-center">📊 Dashboard Overview</h2>

        <div className="row g-4 mb-4">
          <StatCard
            icon={<FiUpload size={36} className="text-primary" />}
            label="Total Uploads"
            value={stats.uploaded}
            color="primary"
          />
          <StatCard
            icon={<FiBarChart2 size={36} className="text-success" />}
            label="Charts Created"
            value={stats.charts}
            color="success"
          />
          <StatCard
            icon={<FiUsers size={36} className="text-warning" />}
            label="Registered Users"
            value={stats.users}
            color="warning"
          />
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm h-100 bg-dark bg-opacity-75 border-light text-white">
              <div className="card-body">
                <h5 className="card-title mb-3 text-info fw-bold">📝 Recent Summaries</h5>
                {recentSummaries.length === 0 ? (
                  <p className="text-muted">No recent summaries found.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {recentSummaries.map((summary, index) => (
                      <li
                        key={summary._id || index}
                        className="list-group-item bg-transparent text-light small d-flex justify-content-between align-items-center"
                      >
                        <span>
                          {summary.summary.length > 100
                            ? summary.summary.slice(0, 100) + "..."
                            : summary.summary}
                        </span>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteSummary(summary._id)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm h-100 bg-dark bg-opacity-75 border-light text-white">
              <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
                <h5 className="card-title mb-3 text-success fw-bold">📈 Chart Preview</h5>
                <div className="text-white">
                  <div className="spinner-border spinner-border-sm me-2 text-white" role="status"></div>
                  <em>Chart preview goes here...</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="col-md-4">
    <div className={`card border-start border-${color} border-4 shadow-sm h-100 bg-dark bg-opacity-75 text-white`}>
      <div className="card-body d-flex align-items-center gap-3">
        {icon}
        <div>
          <h6 className="text-white">{label}</h6>
          <h5 className="mb-0 fw-bold">{value ?? 0}</h5>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
