import React, { useState, useEffect } from 'react';
// PERUBAHAN: Import useNavigate untuk navigasi dan Link untuk tautan
import { useNavigate, Link } from 'react-router-dom'; 
import '../style.css';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  
  // PERUBAHAN: Inisialisasi hook useNavigate
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible(prev => !prev);
  };

  // Handler untuk login lokal (email/username & password)
  const handleLocalSignIn = (e) => {
    e.preventDefault();
    fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: identifier, password: password }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(err => { throw err; });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Login berhasil:", data);
        // PERUBAHAN: Simpan token jika ada (opsional, tapi praktik yang baik)
        // localStorage.setItem('token', data.token);
        
        // PERUBAHAN: Arahkan pengguna ke halaman dashboard
        navigate('/dashboard'); 
      })
      .catch((error) => {
        console.error("Error saat login:", error);
        alert(`Login gagal: ${error.error || "Kredensial tidak valid"}`);
      });
  };

  // Handler untuk response dari Google Sign-In
  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    // PERUBAHAN: Kirim token Google ke backend Anda untuk verifikasi
    fetch("/api/auth/google", { // Pastikan Anda punya endpoint ini di backend
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential }),
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw err; });
      }
      return res.json();
    })
    .then(data => {
      console.log("Login Google berhasil:", data);
      // PERUBAHAN: Arahkan ke dashboard setelah verifikasi backend berhasil
      navigate('/dashboard');
    })
    .catch(error => {
      console.error("Error saat login Google:", error);
      alert(`Login Google gagal: ${error.message || "Gagal memverifikasi pengguna"}`);
    });
  };

  useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: '936262775162-d5i691155h5ojuoka01abipgf7fk2pjq.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", width: 280, text: "signin_with", locale: "id_ID", shape: "rectangular" }
      );
    }
  }, []);


  return (
    <div className="container">
      <div className="header">
        <img src="/image/signin.svg" alt="User Icon" className="icon" />
        <h2>Sign In!</h2>
      </div>
      <div className="form-container">
        <form onSubmit={handleLocalSignIn}>
          <label htmlFor="identifier">Email or Username</label>
          <div className="input-box">
            <img src="/image/Vectoremail.svg" alt="User Icon" />
            <input 
              type="text" 
              id="identifier" 
              placeholder="Enter your email or username" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <label htmlFor="password">Password</label>
          <div className="input-box">
            <img src="/image/Vectorlock.svg" alt="Lock Icon" />
            <input 
              type={passwordVisible ? "text" : "password"} 
              id="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img 
              src={passwordVisible ? "/image/eye-close.svg" : "/image/eye.svg"} 
              className="pweye" 
              alt="Toggle Password" 
              onClick={togglePassword}
            />
          </div>
          <button type="submit" className="sign-in-btn">Sign In</button>
        </form>

        <p className="or-text">Or Sign In with Google</p>
        <div id="googleSignInDiv" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}></div>

        <p className="signup-text">
          {/* PERUBAHAN: Gunakan <Link> untuk navigasi SPA yang lebih cepat */}
          Don't have an account? <Link to="/signup">Sign Up.</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;