// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUpload, FiBarChart2, FiCpu, FiSettings } from "react-icons/fi";
import "../styles/SidebarGlass.css"; // Custom sidebar background styles

const Sidebar = () => {
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/upload", label: "Upload Excel", icon: <FiUpload /> },
    { to: "/charts", label: "Charts", icon: <FiBarChart2 /> },
    { to: "/summary", label: "AI Summary", icon: <FiCpu /> },
    { to: "/admin", label: "Admin Panel", icon: <FiSettings /> },
  ];

  return (
    <div className="custom-sidebar">
      <h5 className="sidebar-title">📊 Analytics Menu</h5>

      <nav className="nav flex-column">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            to={to}
            end
            key={to}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded sidebar-link ${
                isActive ? "active-link" : ""
              }`
            }
          >
            <span className="sidebar-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
