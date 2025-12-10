// src/components/navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/navbar.css'; // Pastikan nama file CSS ini sesuai

const Navbar = () => {
  return (
    <nav className="main-navbar">
      <div className="nav-logo">
        <Link to="/">AAH</Link> {/* Ganti "TG" dengan inisial Anda */}
      </div>
      <ul className="nav-links">
        {/* Link yang sudah ada */}
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/aboutme">About Me</Link></li> 
        <li><Link to="/cv">CV</Link></li>
        
        {/* Link baru yang Anda minta */}
        <li><Link to="/portofolio">Portfolio</Link></li> 
        
        {/* Tombol Contact Me */}
        <li>
          <Link to="/contact" className="nav-contact-btn">
            CONTACT ME
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;