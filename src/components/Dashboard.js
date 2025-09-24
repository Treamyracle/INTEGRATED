import React, { useState } from 'react';
import './dashboard.css'; // <-- 1. IMPORT FILE CSS

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