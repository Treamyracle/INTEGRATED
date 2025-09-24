import React, { useState, useEffect, useCallback } from "react"; // PERUBAHAN: Tambahkan import useCallback
import { useNavigate, Link } from "react-router-dom";
import "../login.css"; // Sesuaikan path jika perlu

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleLocalSignIn = (e) => {
    e.preventDefault();
    fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: identifier, password: password }),
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
        console.log("Login berhasil:", data);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error saat login:", error);
        alert(`Login gagal: ${error.error || "Kredensial tidak valid"}`);
      });
  };

  // PERUBAHAN: Bungkus fungsi ini dengan useCallback
  const handleCredentialResponse = useCallback(
    (response) => {
      console.log("Encoded JWT ID token: " + response.credential);
      fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
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
          console.log("Login Google berhasil:", data);
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error("Error saat login Google:", error);
          alert(
            `Login Google gagal: ${
              error.message || "Gagal memverifikasi pengguna"
            }`
          );
        });
    },
    [navigate]
  ); // Tambahkan `Maps` sebagai dependensi untuk useCallback

  useEffect(() => {
    // Pastikan script Google sudah dimuat sebelum menjalankan ini
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id:
          "936262775162-d5i691155h5ojuoka01abipgf7fk2pjq.apps.googleusercontent.com",
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
          shape: "rectangular",
        }
      );
    }
    // PERUBAHAN: Tambahkan `handleCredentialResponse` ke dependency array useEffect
  }, [handleCredentialResponse]);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src="/image/signin.svg" alt="User Icon" className="icon" />
          <h2>Sign In!</h2>
        </div>
        <div className="login-form">
          <form onSubmit={handleLocalSignIn}>
            <label htmlFor="identifier">Email or Username</label>
            <div className="login-input-box">
              <img src="/image/Vectoremail.svg" alt="User Icon" />
              <input
                type="text"
                id="identifier"
                className="login-input"
                placeholder="Enter your email or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="login-input-box">
              <img src="/image/Vectorlock.svg" alt="Lock Icon" />
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                src={
                  passwordVisible ? "/image/eye-close.svg" : "/image/eye.svg"
                }
                className="pweye"
                alt="Toggle Password"
                onClick={togglePassword}
              />
            </div>

            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>

          <p className="login-or">Or Sign In with Google</p>
          <div
            id="googleSignInDiv"
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          ></div>

          <p className="login-signup-text">
            Don't have an account? <Link to="/signup">Sign Up.</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
