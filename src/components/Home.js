// src/components/Home.js
import React from 'react';
import Navbar from './Navbar'; // Import Navbar
import { Link } from 'react-router-dom';

// Styling sederhana untuk konten home
const homeStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  background: '#F9F7F3' // Samakan dengan background login
};

const Home = () => {
  return (
    <div>
      <Navbar /> {/* Tampilkan Navbar di sini */}
      
      <div style={homeStyle}>
        <h1>Selamat Datang di Portofolio Saya</h1>
        <p>Ini adalah halaman utama baru untuk portofolio Anda.</p>
 <p>
          Silakan lihat <Link to="/dashboard" style={{color: "#A31D1D"}}>Dashboard</Link> saya 
          untuk melihat-lihat tools yang sudah saya buat.
        </p>
      </div>
    </div>
  );
};

export default Home;