import React, { useState } from 'react';

// URL API Backend Anda
const API_URL = "https://pdf-to-image-production.up.railway.app/convert";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedImages, setConvertedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError('');
      setConvertedImages([]);
    } else {
      setSelectedFile(null);
      setError('Silakan pilih file dengan format PDF.');
    }
  };

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
      const response = await fetch(API_URL, { method: 'POST', body: formData });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Gagal melakukan konversi.' }));
        throw new Error(errData.error);
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('image/png')) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setConvertedImages([{ url: imageUrl, name: `${selectedFile.name.replace('.pdf', '')}_page_1.png` }]);
      } else if (contentType && contentType.includes('application/zip')) {
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'converted_images.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(downloadUrl);
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
    <>
      {/* CSS STYLING DENGAN MEDIA QUERIES UNTUK RESPONSIVE */}
      <style>{`
        .dashboard-container {
          background-color: #1a1a2e;
          color: #e0e0e0;
          min-height: 100vh;
          padding: 2rem;
          font-family: 'Segoe UI', 'Roboto', 'sans-serif';
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #3a3a5e;
          padding-bottom: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap; /* Agar bisa wrap di mobile */
        }
        .welcome-message {
          font-size: 2rem;
          color: #ffffff;
          margin: 0;
        }
        .content-area {
          background-color: #1e2a4a;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          max-width: 800px; /* Batasi lebar di layar besar */
          margin: 0 auto; /* Tengahkankan konten */
        }
        .feature-title {
          font-size: 1.5rem;
          color: #a3a3c2;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #3a3a5e;
          padding-bottom: 0.5rem;
        }
        .upload-box {
          border: 2px dashed #3a3a5e;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          margin-bottom: 1rem;
          transition: background-color 0.3s;
        }
        .upload-box:hover {
          background-color: #2a3a6a;
        }
        .file-input { display: none; }
        .convert-button {
          background-color: #5e548e;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          transition: background-color 0.3s;
          margin-top: 1rem;
          width: 100%; /* Lebar penuh di mobile */
          max-width: 200px; /* Batasi lebar di desktop */
        }
        .convert-button:disabled {
          background-color: #3a3a5e;
          cursor: not-allowed;
        }
        .status-text { margin-top: 1rem; }
        .loader { color: #a3a3c2; }
        .error { color: #ff6b6b; font-weight: bold; }
        .results-container { margin-top: 2rem; }
        .image-preview {
          width: 100%;
          max-width: 400px; /* Batasi lebar gambar */
          border: 2px solid #3a3a5e;
          border-radius: 8px;
          margin-top: 1rem;
        }
        .download-link {
          display: inline-block;
          margin-top: 1rem;
          background-color: #2e8b57;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          text-decoration: none;
        }

        /* --- RESPONSIVE STYLING UNTUK LAYAR KECIL --- */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .welcome-message {
            font-size: 1.5rem;
          }
          .content-area {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="welcome-message">Dashboard</h1>
        </header>
        
        <main>
          <div className="content-area">
            <h2 className="feature-title">PDF to PNG Converter</h2>
            <label htmlFor="pdf-upload" className="upload-box">
              {selectedFile ? `File: ${selectedFile.name}` : 'Klik atau jatuhkan file PDF di sini'}
            </label>
            <input 
              id="pdf-upload"
              type="file" 
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
            />
            <button 
              onClick={handleConvert} 
              disabled={!selectedFile || isLoading}
              className="convert-button"
            >
              {isLoading ? 'Mengonversi...' : 'Konversi ke PNG'}
            </button>
            {isLoading && <p className="status-text loader">Harap tunggu, file sedang diproses...</p>}
            {error && <p className="status-text error">{error}</p>}
            {convertedImages.length > 0 && (
              <div className="results-container">
                <h3>Hasil Konversi:</h3>
                {convertedImages.map((image, index) => (
                  <div key={index}>
                    <img src={image.url} alt={`Converted Page ${index + 1}`} className="image-preview"/>
                    <br />
                    <a href={image.url} download={image.name} className="download-link">
                      Unduh Gambar
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;