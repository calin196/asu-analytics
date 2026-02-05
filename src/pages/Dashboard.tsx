import "../styles/dashboard.css";
import logo from "../assets/asu-logo.png";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-root">
      <div className="dashboard-container">

        {/* LEFT — LOGO */}
        <div className="dashboard-left">
          <div className="logo-wrapper">
            <img src={logo} alt="ASU Analytics" />
          </div>
        </div>

        {/* RIGHT — WELCOME / AUTH */}
        <div className="dashboard-right">
          <div className="auth-card">
            <h1>
              Welcome to <span>ASU Analytics</span>
            </h1>
            <p className="subtitle">Login or register to continue</p>

            <button className="btn primary">Login</button>
            <button className="btn secondary">Register</button>

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
