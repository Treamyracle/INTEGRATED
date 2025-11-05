// src/components/Portfolio.js
import React from 'react';
import Navbar from './Navbar';

import pdfFile from "../assets/images/PORTOFOLIO.pdf";

import '../css/portofolio.css'; 

const Portfolio = () => {
  return (
    <div>
      <Navbar />
      
      {/* 2. Kita gunakan class CSS yang sama persis dengan CV.js agar stylenya konsisten */}
      <div className="cv-container">
        <h1>Portofolio Saya</h1>
        <p>Berikut adalah rincian portofolio dan project yang pernah saya kerjakan.</p>
        
        {/* 3. Wrapper dan iframe untuk menampilkan PDF */}
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