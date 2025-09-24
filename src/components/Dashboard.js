import React, { useState, useEffect, useRef } from 'react';
import '../dashboard.css'; // Sesuaikan jika path berbeda

// BARU: Cara impor yang lebih baik dan stabil, tidak lagi menggunakan CDN
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/build/pdf';

GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const API_URL = "https://pdf-to-image-production.up.railway.app/convert";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedImages, setConvertedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const canvasRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setConvertedImages([]);
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError('');
    } else {
      setSelectedFile(null);
      setError('Silakan pilih file dengan format PDF!');
    }
  };

  useEffect(() => {
    let isMounted = true; 

    const renderPdf = async () => {
      if (!selectedFile || !canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas

      try {
        const fileReader = new FileReader();
        fileReader.onload = async function() {
          if (!isMounted) return;
          try {
            const typedarray = new Uint8Array(this.result);
            const loadingTask = getDocument(typedarray);
            const pdf = await loadingTask.promise;
            const page = await pdf.getPage(1);
            
            if (!canvasRef.current || !isMounted) return;
            
            const container = canvasRef.current.parentElement;
            const viewport = page.getViewport({ scale: 1.0 });
            const scale = container.clientWidth / viewport.width;
            const scaledViewport = page.getViewport({ scale });
            
            canvasRef.current.height = scaledViewport.height;
            canvasRef.current.width = scaledViewport.width;

            await page.render({
              canvasContext: context,
              viewport: scaledViewport
            }).promise;
          } catch (renderError) {
            console.error("Error saat merender PDF:", renderError);
            if (isMounted) setError("Gagal menampilkan preview. File mungkin rusak atau tidak didukung.");
          }
        };
        fileReader.readAsArrayBuffer(selectedFile);
      } catch (outerError) {
        console.error("Error persiapan FileReader:", outerError);
        if (isMounted) setError("Terjadi error saat memuat file.");
      }
    };
    
    renderPdf();

    return () => {
      isMounted = false;
    };

  }, [selectedFile]);

  const handleConvert = () => {
    if (!selectedFile) {
      setError('Tidak ada file PDF yang dipilih.');
      return;
    }
    setIsLoading(true);
    setError('');
    setConvertedImages([]);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        setUploadProgress((event.loaded / event.total) * 100);
      }
    });

    xhr.onload = function() {
      setIsLoading(false);
      if (xhr.status === 200) {
        const contentType = xhr.getResponseHeader('content-type');
        const blob = xhr.response;

        if (contentType?.includes('image/png')) {
          setConvertedImages([{ url: URL.createObjectURL(blob), name: `${selectedFile.name.replace('.pdf', '')}_page_1.png` }]);
        } else if (contentType?.includes('application/zip')) {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'converted_images.zip';
          document.body.appendChild(a);
          a.click();
          a.remove();
          alert('File ZIP berhasil diunduh!');
        } else {
          setError('Format respons tidak dikenali dari server.');
        }
      } else {
        setError(`Gagal melakukan konversi. Status: ${xhr.status}`);
      }
    };

    xhr.onerror = function() {
      setIsLoading(false);
      setError('Terjadi error jaringan saat mengunggah file.');
    };

    xhr.open('POST', API_URL, true);
    xhr.responseType = 'blob';
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