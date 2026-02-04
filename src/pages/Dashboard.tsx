import "../styles/dashboard.css";
import logo from "../assets/asu-logo.png";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const navigate = useNavigate();

  const scrollToAuth = () => {
    const auth = document.querySelector(".dashboard-right");
    if (auth) {
      auth.scrollIntoView({ behavior: "smooth" });
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

            {/* GUEST FLOW */}
            <button
              className="btn ghost"
              onClick={() => navigate("/guest")}
            >
              Continue as guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}