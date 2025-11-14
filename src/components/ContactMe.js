// src/components/ContactMe.js
import React from 'react';
import Navbar from './Navbar';
import '../css/contactme.css'; 

// --- 1. IMPORT IKON BARU ---
import { FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const ContactMe = () => {
  return (
    <>
      <Navbar /> 
      
      <div className="contact-container">
        <h1>Hubungi Saya</h1>
        <p className="contact-subtitle">
          Saya tertarik untuk berkolaborasi. Silakan hubungi saya melalui salah satu metode di bawah ini.
        </p>

        <div className="contact-methods">
          
          {/* --- Template GMAIL --- */}
          <div className="contact-card">
            {/* 2. Ganti <img> dengan komponen ikon */}
            <SiGmail className="contact-icon gmail-icon" />
            
            <h2>Email (Gmail)</h2>
            <a 
              href="mailto:arifathayaharahap@gmail.com" 
              className="contact-link"
            >
              arifathayaharahap@gmail.com
            </a>
          </div>

          {/* --- Template Nomor HP (WhatsApp) --- */}
          <div className="contact-card">
            {/* 2. Ganti <img> dengan komponen ikon */}
            <FaWhatsapp className="contact-icon whatsapp-icon" />

            <h2>WhatsApp (HP)</h2>
            <a 
              href="https://wa.me/6281310904470" 
              className="contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              +62 813 1090 4470
            </a>
          </div>

        </div>
      </div>
    </>
  );
};

export default ContactMe;