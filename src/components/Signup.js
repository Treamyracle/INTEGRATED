import React, { useState } from 'react';
import '../style.css';

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState([false, false]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const togglePassword = (index) => {
    setPasswordVisible(prev => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Contoh: validasi password dan confirm
    if (password !== confirm) {
      alert("Password tidak cocok");
      return;
    }
    // Misalnya endpoint signup di backend
    fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Signup failed");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Signup response:", data);
        // Lanjutkan misalnya redirect ke halaman login
      })
      .catch((error) => {
        console.error("Error during signup:", error);
      });
  };

  return (
    <div className="container">
      <div className="header">
        <img src="/image/signup.svg" alt="User Icon" className="icon" />
        <h2>Sign Up!</h2>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <div className="input-box">
            <img src="/image/Vectoremail.svg" alt="Email Icon" />
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className="input-box">
            <img src="/image/Vectorlock.svg" alt="Lock Icon" />
            <input 
              type={passwordVisible[0] ? "text" : "password"} 
              id="password" 
              className="password-input" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <img 
              src={passwordVisible[0] ? "/image/eye-close.svg" : "/image/eye.svg"} 
              className="pweye" 
              alt="Toggle Password" 
              onClick={() => togglePassword(0)}
            />
          </div>

          <label htmlFor="confirm-password">Confirm Password</label>
          <div className="input-box">
            <img src="/image/Vectorlock.svg" alt="Lock Icon" />
            <input 
              type={passwordVisible[1] ? "text" : "password"} 
              id="confirm-password" 
              className="password-input" 
              placeholder="Enter your password again"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required 
            />
            <img 
              src={passwordVisible[1] ? "/image/eye-close.svg" : "/image/eye.svg"} 
              className="pweye" 
              alt="Toggle Password" 
              onClick={() => togglePassword(1)}
            />
          </div>

          <button type="submit" className="sign-in-btn">Sign Up</button>
        </form>

        <p className="or-text">Or Sign Up with</p>

        <div className="social-login">
          <button className="google-btn"><img src="/image/Google.svg" alt="Google" /></button>
          <button className="facebook-btn"><img src="/image/Facebookfb.svg" alt="Facebook" /></button>
          <button className="twitter-btn"><img src="/image/Vectortwitter.svg" alt="Twitter" /></button>
        </div>

        <p className="signup-text">
          Already have an account? <a href="/login">Sign In.</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
