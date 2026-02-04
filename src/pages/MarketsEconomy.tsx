// src/pages/MarketsEconomy.tsx

import { useEffect, useState } from "react";
import { TopBar } from "../components/TopBar";
import { fetchEurostat, parseTimeSeries } from "../services/eurostat";

import "../styles/firstPage.css";        // 👈 reuse SAME background
import "../styles/marketsEconomy.css";  // 👈 economy-specific styles

export function MarketsEconomy() {
  const [country, setCountry] = useState("DE");
  const [gdp, setGdp] = useState<any[]>([]);
  const [inflation, setInflation] = useState<any[]>([]);
  const [unemployment, setUnemployment] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetchEurostat("nama_10_gdp", {
        geo: country,
        unit: "CLV10_MEUR",
      }),
      fetchEurostat("prc_hicp_manr", {
        geo: country,
      }),
      fetchEurostat("une_rt_m", {
        geo: country,
      }),
    ])
      .then(([gdpData, inflationData, unemploymentData]) => {
        setGdp(parseTimeSeries(gdpData));
        setInflation(parseTimeSeries(inflationData));
        setUnemployment(parseTimeSeries(unemploymentData));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [country]);

  return (
    <div className="first-page-root">
      {/* 🔥 SAME TOP BAR AS OTHER PAGES */}
      <TopBar />

      {/* ECONOMY CONTENT */}
      <div className="economy-content">

        {/* COUNTRY SELECTOR */}
        <select
          className="country-select"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="DE">Germany</option>
          <option value="FR">France</option>
          <option value="IT">Italy</option>
          <option value="ES">Spain</option>
          <option value="NL">Netherlands</option>
        </select>

        {loading && <p className="loading">Loading data…</p>}

        {!loading && (
          <div className="kpi-grid">
            <div className="kpi-card">
              <h3>GDP (latest)</h3>
              <p>{gdp.at(-1)?.value?.toLocaleString()} €</p>
            </div>

            <div className="kpi-card">
              <h3>Inflation</h3>
              <p>{inflation.at(-1)?.value}%</p>
            </div>

            <div className="kpi-card">
              <h3>Unemployment</h3>
              <p>{unemployment.at(-1)?.value}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}