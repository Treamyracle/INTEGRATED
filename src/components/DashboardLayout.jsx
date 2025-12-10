// src/components/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Import Navbar utama
import '../css/DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      {/* 1. Pasang Navbar di bagian paling atas */}
      <Navbar />

      {/* 2. Area Konten Utama Dashboard */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;