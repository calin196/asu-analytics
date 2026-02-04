import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import logo from "../assets/asu-logo.png";

export function Dashboard() {
  const navigate = useNavigate();
  const [mobileBlocked, setMobileBlocked] = useState(false);

  const isMobile = () => window.innerWidth <= 768;

  const scrollToAuth = () => {
    const auth = document.querySelector(".dashboard-right");
    if (auth) {
      auth.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGuest = () => {
    if (isMobile()) {
      setMobileBlocked(true);
    } else {
      navigate("/guest");
    }
  };

  return (
    <div className="dashboard-root">
      <div className="dashboard-container">
        {/* LEFT / HERO */}
        <div className="dashboard-left">
          <div className="logo-wrapper">
            <img src={logo} alt="ASU Analytics Logo" />
          </div>

          <p className="hero-subtitle">
            Track cryptocurrencies, stocks, and key market insights — all in one place.
          </p>

          <button className="hero-btn" onClick={scrollToAuth}>
            Continue
          </button>
        </div>

        {/* RIGHT / AUTH */}
        <div className="dashboard-right">
          <div className="auth-card">
            <h1>
              Welcome to <span>ASU Analytics</span>
            </h1>
            <p className="subtitle">Login or register to continue</p>

            <button className="btn primary">Login</button>
            <button className="btn secondary">Register</button>

            {/* 🔴 BLOCKED ON MOBILE */}
            <button className="btn ghost" onClick={handleGuest}>
              Continue as guest
            </button>
          </div>
        </div>
      </div>

      {/* 🚫 MOBILE BLOCK MESSAGE */}
      {mobileBlocked && (
        <div className="mobile-block-overlay">
          <div className="mobile-block-card">
            <h2>Desktop required</h2>
            <p>
              ASU Analytics is designed for large screens and
              professional data analysis.
            </p>
            <p>Please use a desktop or laptop.</p>

            <button
              className="btn primary"
              onClick={() => setMobileBlocked(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}