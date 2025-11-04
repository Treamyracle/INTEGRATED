// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/navbar.css'; // Kita akan buat file CSS ini

const Navbar = () => {
  return (
    <nav className="portfolio-navbar">
      <ul>
        {/* Link ini akan ke dashboard Anda yang sudah ada */}
        <li><Link to="/dashboard">Dashboard</Link></li>
        
        {/* Link placeholder sesuai permintaan Anda */}
        <li><Link to="/aboutme">About Me</Link></li>
        <li><Link to="/cv">CV</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;