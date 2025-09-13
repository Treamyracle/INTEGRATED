import React, { useState, useEffect } from 'react';
import './style.css'; // Path diperbaiki untuk mengatasi error kompilasi

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  // State ini sekarang bisa menampung email atau username
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');

  const togglePassword = () => {
    setPasswordVisible(prev => !prev);
  };

  const handleLocalSignIn = (e) => {
    e.preventDefault();
    // PERUBAHAN: Kirim 'identifier' yang bisa berupa email atau username
    fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier: identifier, password: password }),
    })
      .then((res) => {
        if (!res.ok) {
           // Coba dapatkan pesan error dari backend
           return res.json().then(err => { throw err; });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Backend response (local sign in):", data);
        alert("Login successful!");
        // Di sini Anda bisa redirect pengguna atau menyimpan token
      })
      .catch((error) => {
        console.error("Error during local sign in:", error);
        // Tampilkan pesan error spesifik dari backend
        alert(`Login failed: ${error.error || "Invalid credentials"}`);
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
        { 
          theme: "outline",
          size: "large",
          width: 280,
          text: "signin_with",
          locale: "id_ID",
          shape: "rectangular"
        }
      );
    }
  }, []);

  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    // TODO: Anda perlu membuat handler di backend untuk Google Sign-In
    // yang menerima token ini dan membuat/memverifikasi pengguna.
  };

  return (
    <div className="container">
      <div className="header">
        <img src="/image/signin.svg" alt="User Icon" className="icon" />
        <h2>Sign In!</h2>
      </div>
      <div className="form-container">
        <form onSubmit={handleLocalSignIn}>
          {/* PERUBAHAN LABEL DAN INPUT */}
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
          Don't have an account? <a href="/signup">Sign Up.</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

