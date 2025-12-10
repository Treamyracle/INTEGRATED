// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import ikon hamburger & silang
import '../css/navbar.css';

const Navbar = () => {
  // State untuk melacak apakah menu sedang terbuka atau tertutup
  const [isOpen, setIsOpen] = useState(false);

  // Fungsi untuk mengubah status menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="main-navbar">
      <div className="nav-logo">
        <Link to="/" onClick={() => setIsOpen(false)}>AAH</Link>
      </div>

      {/* Ikon Hamburger (Hanya muncul di HP) */}
      <div className="menu-icon" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Daftar Link (Ditambah class 'active' jika isOpen true) */}
      <ul className={isOpen ? "nav-links active" : "nav-links"}>
        <li>
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
        </li>
        <li>
          <Link to="/aboutme" onClick={() => setIsOpen(false)}>About Me</Link>
        </li>
        <li>
          <Link to="/cv" onClick={() => setIsOpen(false)}>CV</Link>
        </li>
        <li>
          <Link to="/portofolio" onClick={() => setIsOpen(false)}>Portfolio</Link>
        </li>
        
        {/* Tombol Contact */}
        <li>
          <Link to="/contact" className="nav-contact-btn" onClick={() => setIsOpen(false)}>
            CONTACT ME
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;