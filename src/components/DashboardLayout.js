// src/components/DashboardLayout.js
import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../DashboardLayout.css";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">My Tools</h2>
        <nav>
          <ul>
            <li><Link to="/pdfconverter">📄 PDF to PNG</Link></li>
            {/* Nanti tinggal tambah fitur lain */}
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
