import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { FirstPage } from "./pages/FirstPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/guest" element={<FirstPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;