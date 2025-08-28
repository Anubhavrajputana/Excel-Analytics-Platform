import React, { useEffect, useState } from "react";
import { FaFileExcel, FaChartPie, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const stats = [
  {
    title: "Files Uploaded",
    count: 128,
    icon: <FaFileExcel className="text-success fs-2" />,
    bg: "bg-success bg-opacity-10",
  },
  {
    title: "Charts Generated",
    count: 52,
    icon: <FaChartPie className="text-primary fs-2" />,
    bg: "bg-primary bg-opacity-10",
  },
  // {
  //   title: "Total Users",
  //   count: 23,
  //   icon: <FaUsers className="text-info fs-2" />,
  //   bg: "bg-info bg-opacity-10",
  // },
];

const DashboardStats = () => {
  const [recentSummaries, setRecentSummaries] = useState([]);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/summaries?limit=5", {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await res.json();
setRecentSummaries(Array.isArray(data) ? data : data?.summaries || []);


      } catch (err) {
        toast.error("Failed to load summaries.");
        console.error(err);
      }
    };

    fetchSummaries();
  }, []);

  const handleDeleteSummary = async (summaryId) => {
    const password = prompt("Enter admin password");
    if (!password) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/admin/delete-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ summaryId, password }),
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
    <div className="container py-4">
      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={index}>
            <div className={`card shadow-sm border-0 ${stat.bg}`}>
              <div className="card-body d-flex align-items-center gap-3">
                <div className="bg-white rounded-circle p-3 shadow-sm">
                  {stat.icon}
                </div>
                <div>
                  <h5 className="card-title fw-bold mb-1">{stat.count}</h5>
                  <p className="card-text text-white-50 mb-0">{stat.title}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Summaries with Delete Button */}
      <div className="card shadow-sm border-0 bg-dark bg-opacity-75 text-white">
        <div className="card-body">
          <h5 className="card-title mb-3 text-info fw-bold">📝 Recent Summaries</h5>
          {recentSummaries.length === 0 ? (
            <p className="text-muted">No recent summaries found.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {recentSummaries.map((summary) => (
                <li
                  key={summary._id}
                  className="list-group-item bg-transparent text-light d-flex justify-content-between align-items-center"
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
  );
};

export default DashboardStats;
