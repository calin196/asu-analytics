import "../styles/topBar.css";
import logo from "../assets/asu-logo-bar.png";
import { NavLink, useNavigate } from "react-router-dom";

export function TopBar() {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div
        className="topbar-left"
        onClick={() => navigate("/guest")}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="ASU Analytics" className="topbar-logo" />
        <span className="topbar-brand">ASU Analytics</span>
      </div>

      <nav className="topbar-nav">
        <NavLink to="/guest">Home</NavLink>

        <NavLink to="/markets/economy">Markets</NavLink>

        <NavLink to="/markets/crypto">Crypto</NavLink> {/* 👈 FIXED */}

        <NavLink to="/stocks">Stocks</NavLink>

        <NavLink to="/exchanges">Exchanges</NavLink>

        <button
          className="topbar-exit"
          onClick={() => navigate("/")}
        >
          Exit
        </button>
      </nav>
    </header>
  );
}
