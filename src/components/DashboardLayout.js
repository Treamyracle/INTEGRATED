import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../css/DashboardLayout.css"; // sesuaikan path jika diperlukan

const DashboardLayout = () => {
  return (
    <div className="dl-layout">
      {/* Sidebar */}
      <aside className="dl-sidebar">
        <div className="dl-logo">🔥 My Tools</div>

        <nav className="dl-nav">
          <ul>
            {/* Item "Overview" sudah dihapus */}

            <li>
              <span>🌡 Room Temp</span>
              <Link to="roomtemp">
                <button className="dl-go-btn">Go</button>
              </Link>
            </li>

            <li>
              <span>📄 PDF to PNG</span>
              <Link to="pdfconverter">
                <button className="dl-go-btn">Go</button>
              </Link>
            </li>

            {/* === LINK BARU (EXTERNAL) === */}
            <li>
              <span>🗓️ FilkomReserV</span>
              {/* Gunakan tag <a> untuk link eksternal */}
              <a
                href="https://feaps.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="dl-go-btn">Go</button>
              </a>
            </li>

            <li>
              <span>🔗 Potongin</span>
              <a
                href="https://app.potong.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="dl-go-btn">Go</button>
              </a>
            </li>

            <li>
              <span>💡 Filoti</span>
              <a
                href="https://filoti-frontend.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="dl-go-btn">Go</button>
              </a>
            </li>
            {/* === AKHIR LINK BARU === */}

            {/* Item "Settings" sudah dihapus */}
          </ul>
        </nav>

        <div className="dl-sidebar-footer">
          <Link to="/" className="dl-back-home">
            ← Kembali ke Home
          </Link>
          <small>v1.0 • tools</small>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dl-main">
        {/* === BAGIAN HEADER SUDAH DIHAPUS === */}

        {/* Page Content */}
        <main className="dl-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
