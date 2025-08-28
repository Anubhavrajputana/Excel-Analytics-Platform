import React, { useEffect, useState } from "react";
import { FaFileExcel, FaUsers, FaChartBar } from "react-icons/fa";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState("");
  const [stats, setStats] = useState({ uploaded: 0, charts: 0, users: 0 });
  const [summaries, setSummaries] = useState([]);
  const [loadingSummaries, setLoadingSummaries] = useState(true);

  // ✅ Decode JWT token to get email
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUserEmail(decoded.email || "User");
        console.log("User ID:", decoded.id);
      } catch (err) {
        console.error("Token decode failed", err);
        setUserEmail("Unknown");
      }
    } else {
      toast.warn("No token found. Please log in again.");
    }
  }, []);

  // ✅ Fetch stats and summaries
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) setStats(data);
        else toast.error(data.error || "Failed to load stats");
      } catch {
        toast.error("Error loading stats");
      }
    };

    const fetchSummaries = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/summaries`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) setSummaries(data.slice(0, 3));
        else toast.error(data.error || "Failed to load summaries");
      } catch {
        toast.error("Error fetching summaries");
      } finally {
        setLoadingSummaries(false);
      }
    };

    fetchStats();
    fetchSummaries();
  }, []);

  return (
    <div className="dashboard-container">
      <div>
        <h2>Welcome to Dashboard</h2>
        <p>Hi, <strong>{userEmail}</strong></p>
      </div>

      {/* Floating icons */}
      <img src="/icons/excel.png" alt="excel" className="floating-icon" />
      <img src="/icons/chart.png" alt="chart" className="floating-icon" />
      <img src="/icons/user.png" alt="user" className="floating-icon" />
      <img src="/icons/stats.png" alt="stats" className="floating-icon" />

      <div className="admin-wrapper p-4 rounded-4 shadow-lg position-relative">
        <h2 className="fw-bold mb-5 text-center text-gradient">📊 Dashboard Overview</h2>

        {/* Stats Cards */}
        <div className="row g-4 mb-5">
          <StatCard icon={<FaFileExcel className="fs-2 text-success" />} title="Files Uploaded" value={stats.uploaded ?? 0} color="success" />
          <StatCard icon={<FaChartBar className="fs-2 text-info" />} title="Charts Generated" value={stats.charts ?? 0} color="info" />
          {/* <StatCard icon={<FaUsers className="fs-2 text-warning" />} title="Total Users" value={stats.users ?? 0} color="warning" /> */}
        </div>

        {/* Summaries and Chart Preview */}
        <div className="row g-4">
          {/* Summaries */}
          <div className="col-lg-6">
            <div className="glass-card h-100">
              <div className="card-header fw-semibold text-warning border-bottom border-warning">
                📄 Recent Summaries
              </div>
              <div className="card-body">
                {loadingSummaries ? (
                  <p>Loading summaries...</p>
                ) : summaries.length === 0 ? (
                  <p>No summaries available.</p>
                ) : (
                  <ul className="list-group list-group-flush small">
                    {summaries.map((s) => (
                      <li key={s._id} className="list-group-item bg-transparent text-light border-bottom border-secondary">
                        <pre className="mb-0">{s.summary.slice(0, 100)}...</pre>
                        <small className="text-muted">{new Date(s.createdAt).toLocaleString()}</small>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Chart Preview Placeholder */}
          <div className="col-lg-6">
            <div className="glass-card h-100 d-flex justify-content-center align-items-center flex-column text-light">
              <div className="card-header fw-semibold text-info border-bottom border-info w-100 text-center">
                📊 Chart Preview
              </div>
              <div className="card-body">
                <em>Chart preview goes here...</em>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="col-md-4">
    <div className={`card border-start border-${color} border-4 shadow-sm bg-dark bg-opacity-50 text-white`}>
      <div className="card-body d-flex align-items-center gap-3">
        {icon}
        <div>
          <h5 className="mb-0 fw-bold">{value}</h5>
          <small className="text-white">{title}</small>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
