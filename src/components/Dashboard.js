import React, { useState } from 'react';

// URL API Backend Anda
const API_URL = "https://pdf-to-image-production.up.railway.app/convert";

// Styling baru dengan tema gelap yang modern
const styles = {
  dashboardContainer: {
    backgroundColor: '#1a1a2e',
    color: '#e0e0e0',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: "'Segoe UI', 'Roboto', 'sans-serif'",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #3a3a5e',
    paddingBottom: '1rem',
    marginBottom: '2rem',
  },
  welcomeMessage: {
    fontSize: '2rem',
    color: '#ffffff',
    margin: 0,
  },
  contentArea: {
    backgroundColor: '#1e2a4a',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  featureTitle: {
    fontSize: '1.5rem',
    color: '#a3a3c2',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #3a3a5e',
    paddingBottom: '0.5rem',
  },
  uploadBox: {
    border: '2px dashed #3a3a5e',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  // Sembunyikan input file asli
  fileInput: {
    display: 'none',
  },
  convertButton: {
    backgroundColor: '#5e548e',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    marginTop: '1rem',
  },
  // Style saat button di-disable
  disabledButton: {
    backgroundColor: '#3a3a5e',
    cursor: 'not-allowed',
  },
  loader: {
    color: '#a3a3c2',
    marginTop: '1rem',
  },
  error: {
    color: '#ff6b6b',
    marginTop: '1rem',
  },
  resultsContainer: {
    marginTop: '2rem',
  },
  imagePreview: {
    maxWidth: '100%',
    maxHeight: '400px',
    border: '2px solid #3a3a5e',
    borderRadius: '8px',
    marginTop: '1rem',
  },
  downloadLink: {
    display: 'inline-block',
    marginTop: '1rem',
    backgroundColor: '#2e8b57',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    textDecoration: 'none',
  },
};

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedImages, setConvertedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handler saat pengguna memilih file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(''); // Hapus error sebelumnya
      setConvertedImages([]); // Hapus hasil sebelumnya
    } else {
      setSelectedFile(null);
      setError('Silakan pilih file dengan format PDF.');
    }
  };

  // Handler untuk tombol konversi
  const handleConvert = async () => {
    if (!selectedFile) {
      setError('Tidak ada file PDF yang dipilih.');
      return;
    }

    setIsLoading(true);
    setError('');
    setConvertedImages([]);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal melakukan konversi.');
      }

      // Cek tipe konten dari respons
      const contentType = response.headers.get('content-type');

      // Jika hasilnya adalah 1 gambar PNG
      if (contentType && contentType.includes('image/png')) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setConvertedImages([{ url: imageUrl, name: `${selectedFile.name.replace('.pdf', '')}_page_1.png` }]);
      
      // Jika hasilnya adalah file ZIP
      } else if (contentType && contentType.includes('application/zip')) {
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        // Buat link sementara untuk men-trigger download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'converted_images.zip';
        document.body.appendChild(a);
        a.click();
        a.remove(); // Hapus link setelah di-klik
        URL.revokeObjectURL(downloadUrl); // Bebaskan memori
        alert('File ZIP berhasil diunduh!');

      } else {
        throw new Error('Format respons tidak dikenali dari server.');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <h1 style={styles.welcomeMessage}>Dashboard</h1>
        {/* Anda bisa menambahkan tombol logout di sini nanti */}
      </header>
      
      <main>
        <div style={styles.contentArea}>
          <h2 style={styles.featureTitle}>PDF to PNG Converter</h2>

          {/* Label ini berfungsi sebagai area drop/klik yang terlihat */}
          <label htmlFor="pdf-upload" style={styles.uploadBox}>
            {selectedFile ? `File terpilih: ${selectedFile.name}` : 'Klik atau jatuhkan file PDF di sini'}
          </label>
          
          {/* Input file yang sebenarnya disembunyikan */}
          <input 
            id="pdf-upload"
            type="file" 
            accept=".pdf"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          
          <button 
            onClick={handleConvert} 
            disabled={!selectedFile || isLoading}
            style={{...styles.convertButton, ...((!selectedFile || isLoading) && styles.disabledButton)}}
          >
            {isLoading ? 'Mengonversi...' : 'Konversi ke PNG'}
          </button>

          {isLoading && <p style={styles.loader}>Harap tunggu, file sedang diproses...</p>}
          {error && <p style={styles.error}>{error}</p>}

          {convertedImages.length > 0 && (
            <div style={styles.resultsContainer}>
              <h3>Hasil Konversi:</h3>
              {convertedImages.map((image, index) => (
                <div key={index}>
                  <img src={image.url} alt={`Converted Page ${index + 1}`} style={styles.imagePreview}/>
                  <br />
                  <a href={image.url} download={image.name} style={styles.downloadLink}>
                    Unduh Gambar
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
