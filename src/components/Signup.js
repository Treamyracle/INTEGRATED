import React, { useState } from "react";
import "../style.css"; // Path diperbaiki untuk mengatasi error kompilasi
import { Link } from "react-router-dom";

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState([false, false]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // State baru untuk username
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const togglePassword = (index) => {
    setPasswordVisible((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    // PERUBAHAN: Kirim email, username, dan password
    fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw err;
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Signup response:", data);
        alert("Signup successful! Please proceed to login.");
        // Arahkan pengguna ke halaman login, misalnya:
        // window.location.href = '/login';
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        // Tampilkan pesan error spesifik dari backend
        alert(`Signup failed: ${error.error || "An unknown error occurred"}`);
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <img src="/image/signup.svg" alt="User Icon" className="icon" />
        <h2>Sign Up!</h2>
      </div>
      <div className="signup-form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <div className="signup-input-box">
            <img src="/image/Vectoremail.svg" alt="Email Icon" />
            <input
              type="email"
              id="email"
              className="signup-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label htmlFor="username">Username</label>
          <div className="signup-input-box">
            <img
              src="/image/signin.svg"
              alt="User Icon"
              style={{ width: "16px" }}
            />
            <input
              type="text"
              id="username"
              className="signup-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className="signup-input-box">
            <img src="/image/Vectorlock.svg" alt="Lock Icon" />
            <input
              type={passwordVisible[0] ? "text" : "password"}
              id="password"
              className="signup-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              src={
                passwordVisible[0] ? "/image/eye-close.svg" : "/image/eye.svg"
              }
              className="pweye"
              alt="Toggle Password"
              onClick={() => togglePassword(0)}
            />
          </div>

          <label htmlFor="confirm-password">Confirm Password</label>
          <div className="signup-input-box">
            <img src="/image/Vectorlock.svg" alt="Lock Icon" />
            <input
              type={passwordVisible[1] ? "text" : "password"}
              id="confirm-password"
              className="signup-input"
              placeholder="Enter your password again"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <img
              src={
                passwordVisible[1] ? "/image/eye-close.svg" : "/image/eye.svg"
              }
              className="pweye"
              alt="Toggle Password"
              onClick={() => togglePassword(1)}
            />
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <p className="signup-or">Or Sign Up with</p>

        <div className="signup-social">
          <button>
            <img src="/image/Google.svg" alt="Google" />
          </button>
          <button>
            <img src="/image/Facebookfb.svg" alt="Facebook" />
          </button>
          <button>
            <img src="/image/Vectortwitter.svg" alt="Twitter" />
          </button>
        </div>

        <p className="signup-text">
          Already have an account? <Link to="/login">Sign In.</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
