import React from "react";
import { Outlet } from "react-router-dom";
import "../DashboardLayout.css";
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
              <span>📊 Dashboard</span>
              <Link to="/dashboard">
                <button className="go-btn">Go</button>
              </Link>
            </li>
            <li>
              <span>📄 PDF to PNG</span>
              <Link to="/pdfconverter">
                <button className="go-btn">Go</button>
              </Link>
            </li>
            <li>
              <span>📁 File Manager</span>
              <Link to="/files">
                <button className="go-btn">Go</button>
              </Link>
            </li>
            <li>
              <span>⚙️ Settings</span>
              <Link to="/settings">
                <button className="go-btn">Go</button>
              </Link>
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
