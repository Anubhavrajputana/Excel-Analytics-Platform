import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NavbarGlass.css"; // CSS file

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar-glass navbar navbar-expand-md border-bottom px-3">
      <div className="container-fluid">
        {/* Sidebar toggle for mobile */}
        <button
          className="btn btn-outline-light d-md-none me-2"
          onClick={onToggleSidebar}
        >
          ☰
        </button>

        <span
          className="navbar-brand fw-bold fs-5 text-white glow-text"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          📊 Excel Analytics Platform
        </span>

        <div className="d-flex align-items-center ms-auto gap-2">
          {isLoggedIn ? (
            <>
            
             
              <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-sm btn-info"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
