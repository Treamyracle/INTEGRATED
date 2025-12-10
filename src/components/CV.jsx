// src/components/CV.jsx
import React from 'react';
import Navbar from './Navbar';
import '../css/cv.css'; 

import pdfFile from "../assets/images/CV.pdf";

const CV = () => {
  return (
    <div>
      <Navbar />
      <div className="cv-container">
        <h1>CV Saya</h1>
        <p>Berikut adalah CV saya.</p>
        
        {/* --- TAMBAHAN: Tombol untuk Mobile --- */}
        <div style={{ marginBottom: '20px' }}>
            <a 
              href={pdfFile} 
              target="_blank" 
              rel="noopener noreferrer"
              className="pdf-download-btn"
            >
              Buka / Download CV (PDF)
            </a>
        </div>

        <div className="pdf-viewer-wrapper">
          <iframe 
            src={pdfFile}
            title="CV Arif Athaya Harahap"
            className="pdf-iframe"
          />
        </div>
      </div>
    </div>
  );
};

export default CV;