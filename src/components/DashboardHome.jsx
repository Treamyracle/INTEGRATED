// src/components/DashboardHome.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFilePdf, 
  FaThermometerHalf, 
  FaUserAstronaut, 
  FaCalendarCheck, 
  FaCut, 
  FaLightbulb 
} from 'react-icons/fa';
// Pastikan CSS DashboardLayout.css sudah terimport di layout induknya

const DashboardHome = () => {
  return (
    <div className="dashboard-home-container">
      <h1>Selamat Datang di Dashboard</h1>
      <p>Silakan pilih menu aplikasi atau layanan di bawah ini:</p>

      <div className="dashboard-menu-grid">
        
        {/* --- 1. PDF CONVERTER (Internal) --- */}
        <Link to="/dashboard/pdfconverter" className="menu-card">
          <div className="card-icon">
            <FaFilePdf style={{ color: '#F40F02' }} />
          </div>
          <h3>PDF Converter</h3>
          <p>Ubah file PDF menjadi gambar (PNG/ZIP)</p>
        </Link>

        {/* --- 2. ROOM MONITORING (Internal) --- */}
        <Link to="/dashboard/roomtemp" className="menu-card">
          <div className="card-icon">
            <FaThermometerHalf style={{ color: '#007bff' }} />
          </div>
          <h3>Room Temp</h3>
          <p>Pantau suhu dan kelembaban ruangan</p>
        </Link>

        {/* --- 3. FILKOM RESERV (External) --- */}
        <a 
          href="https://feaps.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="menu-card"
        >
          <div className="card-icon">
            <FaCalendarCheck style={{ color: '#28a745' }} />
          </div>
          <h3>FilkomReserV</h3>
          <p>Sistem peminjaman ruangan Filkom</p>
        </a>

        {/* --- 4. POTONGIN (External) --- */}
        <a 
          href="https://app.potong.in/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="menu-card"
        >
          <div className="card-icon">
            <FaCut style={{ color: '#fd7e14' }} />
          </div>
          <h3>Potongin</h3>
          <p>Aplikasi pemendek link (URL Shortener)</p>
        </a>

        {/* --- 5. FILOTI (External) --- */}
        <a 
          href="https://filoti-frontend.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="menu-card"
        >
          <div className="card-icon">
            <FaLightbulb style={{ color: '#ffc107' }} />
          </div>
          <h3>Filoti</h3>
          <p>Sistem Lost & Found Item</p>
        </a>

        {/* --- 6. PROFILE INFO (Internal - Opsional) --- */}
        <Link to="/aboutme" className="menu-card">
          <div className="card-icon">
            <FaUserAstronaut style={{ color: '#6610f2' }} />
          </div>
          <h3>Profile Info</h3>
          <p>Lihat informasi detail tentang saya</p>
        </Link>

      </div>
    </div>
  );
};

export default DashboardHome;