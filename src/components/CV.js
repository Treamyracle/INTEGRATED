// src/components/CV.js
import React from 'react';
import Navbar from './Navbar';

const CV = () => {
  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: '100px', textAlign: 'center' }}>
        <h1>CV Saya</h1>
        <p>Halaman ini akan menampilkan CV Anda (mungkin PDF viewer atau link download).</p>
      </div>
    </div>
  );
};

export default CV;