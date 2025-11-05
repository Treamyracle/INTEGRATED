// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import komponen yang sudah ada
import DashboardLayout from './components/DashboardLayout';
import PdfConverter from './components/PdfConverter';
import RoomTempDashboard from "./components/RoomTempDashboard";

// --- IMPORT KOMPONEN BARU ---
import Home from './components/Home';             // Halaman portfolio utama
import AboutMe from './components/AboutMe';       // Halaman About Me
import CV from './components/CV';               // Halaman CV
import DashboardHome from './components/DashboardHome'; // Halaman default dashboard
import Portofolio from './components/Portofolio'; // Halaman Portofolio
// Salin ErrorBoundary Anda ke sini
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}


function App() {
  console.log('App rendering...'); // Debug log
  
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* --- RUTE HALAMAN UTAMA --- */}
          <Route path="/" element={<Home />} />
          <Route path="/aboutme" element={<AboutMe />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/portofolio" element={<Portofolio />} />
          
          {/* --- RUTE DASHBOARD (NESTED) --- */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            
            {/* Rute index: apa yang tampil di /dashboard */}
            <Route index element={<DashboardHome />} /> 
            
            {/* Rute anak: /dashboard/pdfconverter */}
            <Route path="pdfconverter" element={<PdfConverter />} /> 

            {/* Rute anak: /dashboard/roomtemp */}
            <Route path="roomtemp" element={<RoomTempDashboard />} />

          </Route>
          
          {/* Anda bisa tambahkan rute "Not Found" jika perlu */}
          {/* <Route path="*" element={<div>Halaman Tidak Ditemukan</div>} /> */}

        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;