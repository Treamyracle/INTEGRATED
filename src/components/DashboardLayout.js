// src/components/DashboardLayout.js
import React from "react";
import { Link, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">My Tools</h2>
        <nav>
          <ul>
            <li><Link to="/pdfconverter">PDF to PNG Converter</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet /> {/* Tempat render fitur */}
      </main>
    </div>
  );
};

export default DashboardLayout;
