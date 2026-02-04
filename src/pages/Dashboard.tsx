import "../styles/dashboard.css";
import logo from "../assets/asu-logo.png";

export function Dashboard() {
  const scrollToAuth = () => {
    const auth = document.querySelector(".dashboard-right");
    if (auth) {
      auth.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="dashboard-root">
      <div className="dashboard-container">
        {/* LEFT */}
        <div className="dashboard-left">
          <div className="logo-wrapper">
            <img src={logo} alt="ASU Analytics Logo" />
          </div>

          {/* MOBILE ONLY */}

          <p className="hero-subtitle">
            An early-stage platform for tracking cryptocurrencies, stocks, and market trends.
          </p>

          <button className="hero-btn" onClick={scrollToAuth}>
            Continue
          </button>
        </div>

        {/* RIGHT */}
        <div className="dashboard-right">
          <div className="auth-card">
            <h1>
              Welcome to <span>ASU Analytics</span>
            </h1>
            <p className="subtitle">Login or register to continue</p>

            <button className="btn primary">Login</button>
            <button className="btn secondary">Register</button>
            <button className="btn ghost">Continue as guest</button>
          </div>
        </div>
      </div>
    </div>
  );
}