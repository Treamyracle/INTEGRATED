import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../DashboardLayout.css"; // sesuaikan path jika diperlukan

const DashboardLayout = () => {
  return (
    <div className="dl-layout">
      {/* Sidebar */}
      <aside className="dl-sidebar">
        <div className="dl-logo">🔥 My Tools</div>

        <nav className="dl-nav">
          <ul>
            <li>
              <span>📊 Overview</span>
              <Link to="/dashboard">
                <button className="dl-go-btn">Go</button>
              </Link>
            </li>

            <li>
              <span>🌡 Room Temp</span>
              <Link to="/roomtemp">
                <button className="dl-go-btn">Go</button>
              </Link>
            </li>

            <li>
              <span>📄 PDF to PNG</span>
              <Link to="/pdfconverter">
                <button className="dl-go-btn">Go</button>
              </Link>
            </li>

            <li>
              <span>⚙️ Settings</span>
              <Link to="/settings">
                <button className="dl-go-btn">Go</button>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="dl-sidebar-footer">
          <small>v1.0 • tools</small>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dl-main">
        {/* Header */}
        <header className="dl-header">
          <input type="text" className="dl-search" placeholder="Search..." />
          <div className="dl-header-right">
            <span className="dl-status live">● Live</span>
            <button className="dl-create">+ Create</button>
          </div>
        </header>

        {/* Page Content */}
        <main className="dl-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
