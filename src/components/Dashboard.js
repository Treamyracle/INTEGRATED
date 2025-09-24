import React from 'react';

// Styling sederhana untuk dashboard
const styles = {
  dashboardContainer: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f7f6',
    minHeight: '100vh',
  },
  header: {
    borderBottom: '2px solid #ddd',
    paddingBottom: '1rem',
    marginBottom: '2rem',
  },
  welcomeMessage: {
    fontSize: '2rem',
    color: '#333',
  },
  contentArea: {
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  }
};

const Dashboard = () => {
  // Anda bisa menambahkan logika untuk mengambil data pengguna di sini nanti
  // misalnya dari localStorage atau state management (Context/Redux)

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <h1 style={styles.welcomeMessage}>Selamat Datang di Dashboard!</h1>
      </header>
      
      <main>
        <div style={styles.contentArea}>
          <h2>Area Konten Utama</h2>
          <p>
            Halaman ini siap untuk diisi dengan fitur-fitur dari API Anda.
            Anda bisa mulai membangun komponen untuk menampilkan data, grafik, atau tabel di sini.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;