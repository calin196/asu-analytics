import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { FirstPage } from "./pages/FirstPage";
import { MarketsEconomy } from "./pages/MarketsEconomy";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-viewport">
        <div className="app-scale">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/guest" element={<FirstPage />} />
            <Route path="/markets/economy" element={<MarketsEconomy />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;