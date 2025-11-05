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
          <h3>About Me</h3>
          <p>
            Informatics Engineering undergraduate with a strong foundation in Machine Learning, Deep Learning, AI,
            Blockchain, and Backend/Frontend development. Skilled in collaborating within teams to take projects
            from concept to deployment, with live applications on Google Cloud Run (AI Itinerary Agent) and Vercel
            (Room Booking and Lost and Found System, Link Shortener). Fueled by a deep passion for all aspects of
            technology, I am committed to continuous growth and developing into a leading expert in the field.
          </p>
          <a href="https://www.tream.icu/" className="read-more-link">
            READ MORE
          </a>
        </div>
        <div className="showcase-logo">
          {/* Logo placeholder dari gambar */}
          <span className="logo-it">tream</span>
        </div>
      </section>
    </div>
  );
};

export default Home;
