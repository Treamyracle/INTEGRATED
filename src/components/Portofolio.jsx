// src/components/Portofolio.jsx
import React from 'react';
import Navbar from './Navbar';
import '../css/portofolio.css'; 

import pdfFile from "../assets/images/PORTOFOLIO.pdf";

const Portfolio = () => {
  return (
    <div>
      <Navbar />
      <div className="cv-container">
        <h1>Portofolio Saya</h1>
        <p>Berikut adalah portofolio saya.</p>
        
        {/* --- TAMBAHAN: Tombol untuk Mobile --- */}
        <div style={{ marginBottom: '20px' }}>
            <a 
              href={pdfFile} 
              target="_blank" 
              rel="noopener noreferrer"
              className="pdf-download-btn"
            >
              Buka / Download Portofolio (PDF)
            </a>
        </div>
        
        <div className="pdf-viewer-wrapper">
          <iframe 
            src={pdfFile}
            title="Portofolio Arif Athaya Harahap"
            className="pdf-iframe"
          />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;