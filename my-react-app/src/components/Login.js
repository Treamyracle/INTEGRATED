import React, { useState, useEffect } from 'react';
import '../style.css';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePassword = () => {
    setPasswordVisible(prev => !prev);
  };

  const handleLocalSignIn = (e) => {
    e.preventDefault();
    // Menggunakan email sebagai username
    fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password: password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Backend response (local sign in):", data);
        // Lanjutkan proses login, simpan data user atau token session
      })
      .catch((error) => {
        console.error("Error during local sign in:", error);
      });
  };

  useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: '418414887688-u7fg0bshmafc4djrvcj9ueioil4kht2q.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
  
    fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: response.credential }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Backend response (Google sign in):", data);
        // Lanjutkan proses login, misalnya simpan data user atau token session
      })
      .catch((error) => {
        console.error("Error during Google Sign-In:", error);
      });
  };

  return (
    <div className="container">
      <div className="header">
      <img src="/image/signin.svg" alt="User Icon" className="icon" />
        <h2>Sign In!</h2>
      </div>
      <div className="form-container">
        <form onSubmit={handleLocalSignIn}>
          <label htmlFor="email">Email Address</label>
          <div className="input-box">
            <img src="image/Vectoremail.svg" alt="Email Icon" />
            <input 
              type="text" 
              id="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className="input-box">
            <img src="image/Vectorlock.svg" alt="Lock Icon" />
            <input 
              type={passwordVisible ? "text" : "password"} 
              id="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img 
              src={passwordVisible ? "image/eye-close.svg" : "Image/eye.svg"} 
              className="pweye" 
              alt="Toggle Password" 
              onClick={togglePassword}
            />
          </div>

          <button type="submit" className="sign-in-btn">Sign In</button>
        </form>

        <p className="or-text">Or Sign In with Google</p>
        <div id="googleSignInDiv"></div>

        <p className="signup-text">
          Don’t have an account? <a href="/Signup">Sign Up.</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
