import "../styles/topBar.css";
import logo from "../assets/asu-logo-bar.png"; // ← use the SAME logo as dashboard

export function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <img src={logo} alt="ASU Analytics" className="topbar-logo" />
        <span className="topbar-brand">ASU Analytics</span>
      </div>

      <nav className="topbar-nav">
        <a href="#">Home</a>
        <a href="#">Markets</a>
        <a href="#">Crypto</a>
        <a href="#">Stocks</a>
        <a href="#">Exchanges</a>
        <a href="#">About</a>
      </nav>
    </header>
  );
}