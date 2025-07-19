import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import "bootstrap/dist/css/bootstrap.min.css";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <header className="sticky-top">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </header>

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none z-2"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Layout Row */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div
          className={`bg-white border-end shadow-sm vh-100 position-fixed top-0 start-0 z-3 d-md-none ${
            isSidebarOpen ? "d-block" : "d-none"
          }`}
          style={{ width: "250px" }}
        >
          <Sidebar />
        </div>

        <aside className="d-none d-md-block bg-white border-end shadow-sm vh-100" style={{ width: "250px" }}>
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="main-dark flex-grow-1 px-4 pt-4">
  {children}
</main>

      </div>

      {/* Footer */}
      <footer className="text-center py-3 text-dark text-sm border-t bg-gradient-to-r from-purple-800 via-blue-900 to-green-800 shadow-inner">
  © {new Date().getFullYear()} Harsh Chauhan
</footer>

    </div>
  );
};

export default Layout;
