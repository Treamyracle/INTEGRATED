// src/components/Home.js
import React from "react";
import Navbar from "./Navbar"; // Pastikan import ini benar (navbar.js atau Navbar.js)
import "../css/home.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";
import fotoProfil from "../assets/images/profile.png";

const Home = () => {
  return (
    <div className="home-page-container">
      {/* 1. Navbar Anda akan dirender di sini */}
      <Navbar />

      {/* 2. Hero Section (Konten utama split-screen) */}
      <main className="home-hero">
        {/* Bagian Kiri (Teks) */}
        <div className="hero-left">
          <div className="hero-text">
            <p>Hi, I am</p>
            {/* Ganti dengan nama Anda */}
            <h1>Arif Athaya Harahap</h1>
            {/* Ganti dengan deskripsi Anda */}
            <h2>Fullstack Developer, AI-ML Engineer, and Blockchain Enthusiast</h2>
          </div>
          <div className="social-links">
            {/* Ganti ikon dan tambahkan link Anda */}
            <a
              href="https://huggingface.co/treamyracle"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiHuggingface />
            </a>
            <a
              href="https://github.com/Treamyracle"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/arifathaya/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Bagian Kanan (Gambar) */}
<div className="hero-right">
          {/* HAPUS <div className="hero-placeholder"> ... </div> */}
          
          {/* GANTI DENGAN INI: */}
          <img 
            src={fotoProfil} 
            alt="Potret Arif Athaya Harahap" 
            className="hero-image" 
          />

          
        </div>
      </main>

      {/* 3. Bottom Showcase Section ("IT BERRIES") */}
      <section className="home-showcase">
        <div className="showcase-content">
          <h3>IT BERRIES</h3>
          <p>
            Hello in velt a metus rhoncus tempus. Nulla congue nulla vel sem
            varius finibus. Sed ornare sit amet lorem sed viverra. In vel urna
            quis libero viverra facilisis sit amet elit. Nunc egestas nisi eget
            enim gravida facilisis...
          </p>
          <a href="https://huggingface.co/treamyracle" className="read-more-link">
            READ MORE
          </a>
        </div>
        <div className="showcase-logo">
          {/* Logo placeholder dari gambar */}
          <span className="logo-it">IT</span>
        </div>
      </section>
    </div>
  );
};

export default Home;
