import React, { useState, useEffect, useRef } from 'react';
import '../dashboard.css'; // Sesuaikan path jika perlu

// BARU: Import library pdf.js
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// BARU: Atur path untuk worker (diperlukan oleh pdf.js)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


// URL API Backend Anda
const API_URL = "https://pdf-to-image-production.up.railway.app/convert";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedImages, setConvertedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // BARU: State untuk melacak progres upload
  const [uploadProgress, setUploadProgress] = useState(0);

  // BARU: Ref untuk elemen canvas preview
  const canvasRef = useRef(null);

  // PERUBAHAN: handleFileChange sekarang juga memicu render preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setConvertedImages([]); // Reset hasil konversi sebelumnya
    
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError('');
    } else {
      setSelectedFile(null);
      setError('Silakan pilih file dengan format PDF.');
    }
  };

  // BARU: useEffect untuk merender preview PDF saat file dipilih
  useEffect(() => {
    if (!selectedFile || !canvasRef.current) return;

    const fileReader = new FileReader();
    fileReader.onload = async function() {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      const page = await pdf.getPage(1); // Ambil halaman pertama
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const viewport = page.getViewport({ scale: 1 });

      // Atur skala agar pas dengan lebar canvas
      const scale = canvas.parentElement.clientWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale: scale });
      
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;

      // Render halaman PDF ke canvas
      await page.render({
        canvasContext: context,
        viewport: scaledViewport
      }).promise;
    };
    fileReader.readAsArrayBuffer(selectedFile);

  }, [selectedFile]);

  // PERUBAHAN: handleConvert sekarang menggunakan XMLHttpRequest untuk progress tracking
  const handleConvert = () => {
    if (!selectedFile) {
      setError('Tidak ada file PDF yang dipilih.');
      return;
    }
    setIsLoading(true);
    setError('');
    setConvertedImages([]);
    setUploadProgress(0); // Reset progress bar

    const formData = new FormData();
    formData.append('file', selectedFile);

    const xhr = new XMLHttpRequest();

    // Event listener untuk progres upload
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(percentComplete);
      }
    });

    // Event listener saat request selesai
    xhr.onload = function() {
      setIsLoading(false);
      if (xhr.status === 200) {
        const contentType = xhr.getResponseHeader('content-type');
        const blob = xhr.response;

        if (contentType && contentType.includes('image/png')) {
          const imageUrl = URL.createObjectURL(blob);
          setConvertedImages([{ url: imageUrl, name: `${selectedFile.name.replace('.pdf', '')}_page_1.png` }]);
        } else if (contentType && contentType.includes('application/zip')) {
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
          setError('Format respons tidak dikenali dari server.');
        }
      } else {
        setError(`Gagal melakukan konversi. Status: ${xhr.status}`);
      }
    };

    // Event listener untuk error jaringan
    xhr.onerror = function() {
      setIsLoading(false);
      setError('Terjadi error jaringan saat mengunggah file.');
    };

    xhr.open('POST', API_URL, true);
    xhr.responseType = 'blob'; // Penting agar bisa menangani file PNG/ZIP
    xhr.send(formData);
  };

  return (
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
          
          {/* BARU: Area untuk preview PDF */}
          {selectedFile && (
            <div className="preview-container">
              <h4>Preview Halaman Pertama:</h4>
              <div className="canvas-wrapper">
                <canvas ref={canvasRef}></canvas>
              </div>
            </div>
          )}

          <button 
            onClick={handleConvert} 
            disabled={!selectedFile || isLoading}
            className="convert-button"
          >
            {isLoading ? 'Mengonversi...' : 'Konversi ke PNG'}
          </button>
          
          {/* BARU: Progress bar untuk upload */}
          {isLoading && (
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${uploadProgress}%` }}>
                {Math.round(uploadProgress)}%
              </div>
            </div>
          )}
          
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
  );
};

export default Dashboard;