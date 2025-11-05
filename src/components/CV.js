// src/components/CV.js
import React from 'react';
import Navbar from './Navbar';
import '../css/cv.css'; // Kita akan buat file CSS ini

import pdfFile from "../assets/images/CV.pdf";

const CV = () => {
  return (
    <div>
      <Navbar />
      <div className="cv-container">
        <h1>CV Saya</h1>
        <p>Berikut adalah CV saya. Anda juga bisa mengunduhnya melalui tombol di viewer.</p>
        
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