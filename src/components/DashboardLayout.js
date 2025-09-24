import React from "react";
import { Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import { Link } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">🔥 My Tools</div>
        <nav>
          <ul>
            <li>
              <Link to="/dashboard">📊 Dashboard</Link>
            </li>
            <li>
              <Link to="/pdfconverter">📄 PDF to PNG</Link>
            </li>
            <li>
              <Link to="/files">📁 File Manager</Link>
            </li>
            <li>
              <Link to="/settings">⚙️ Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-section">
        {/* Header */}
        <header className="header">
          <input type="text" className="search-bar" placeholder="Search..." />
          <div className="header-right">
            <span className="status live">● Live</span>
            <button className="create-btn">+ Create</button>
          </div>
        </header>

        {/* Page Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
