import { useEffect, useState } from "react";
import { TopBar } from "../components/TopBar";
import { NavLinkButton } from "../components/NavLinkButton1";
import "../styles/navLink.css";

import {
  fetchEurostat,
  parseTimeSeries,
  extractCountries,
} from "../services/eurostat";
import { getMarketProfile } from "../services/ecMarket";
import { fetchSectorShares } from "../services/worldBank";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "../styles/firstPage.css";
import "../styles/marketsEconomy.css";

/* ===============================
   TYPES
=============================== */

type Country = {
  code: string;
  name: string;
};

type SectorDatum = {
  name: string;
  value: number; // percent
};

export function MarketsEconomy() {
  const [enter, setEnter] = useState(false);

  const [countries, setCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState<string | null>(null);
  const [view, setView] = useState<"select" | "dashboard">("select");

  const [gdp, setGdp] = useState<any[]>([]);
  const [inflation, setInflation] = useState<any[]>([]);
  const [unemployment, setUnemployment] = useState<any[]>([]);
  const [population, setPopulation] = useState<any[]>([]);
  const [income, setIncome] = useState<any[]>([]);
  const [sectorData, setSectorData] = useState<SectorDatum[]>([]);
  const [loading, setLoading] = useState(false);

  /* ===============================
     RE-TRIGGER SELECTOR ANIMATION
  =============================== */
  useEffect(() => {
    if (view === "select") {
      setEnter(false); // reset animation
      requestAnimationFrame(() => {
        setEnter(true); // trigger again
      });
    }
  }, [view]);

  /* ===============================
     LOAD COUNTRIES
  =============================== */
  useEffect(() => {
    fetchEurostat("nama_10_gdp", { unit: "CLV10_MEUR" })
      .then((d) => setCountries(extractCountries(d)))
      .catch(console.error);
  }, []);

  /* ===============================
     LOAD DASHBOARD DATA
  =============================== */
  useEffect(() => {
    if (!country || view !== "dashboard") return;

    setLoading(true);

    Promise.all([
      fetchEurostat("nama_10_gdp", { geo: country, unit: "CLV10_MEUR" }),
      fetchEurostat("prc_hicp_manr", { geo: country }),
      fetchEurostat("une_rt_m", {
        geo: country,
        age: "TOTAL",
        sex: "T",
        s_adj: "SA",
        unit: "PC_ACT",
      }),
      fetchEurostat("demo_pjan", { geo: country }),
      fetchEurostat("ilc_di03", { geo: country, unit: "EUR" }),
      fetchSectorShares(country),
    ])
      .then(([g, i, u, p, inc, sector]) => {
        setGdp(parseTimeSeries(g));
        setInflation(parseTimeSeries(i));
        setUnemployment(parseTimeSeries(u));
        setPopulation(parseTimeSeries(p));
        setIncome(parseTimeSeries(inc));

        const raw = sector
          .filter((s: any) => s.value != null)
          .map((s: any) => ({
            name: s.name,
            value: Number(s.value),
          }));

        const total = raw.reduce((sum, s) => sum + s.value, 0);

        const normalized: SectorDatum[] = raw.map((s) => ({
          name: s.name,
          value: total > 0 ? (s.value / total) * 100 : 0,
        }));

        setSectorData(normalized);
      })
      .finally(() => setLoading(false));
  }, [country, view]);

  /* ===============================
     HELPERS
  =============================== */
  const latest = (arr: any[]) =>
    arr.length ? arr[arr.length - 1].value : null;

  const gdpPerCapita =
    latest(gdp) && latest(population)
      ? (latest(gdp) * 1_000_000) / latest(population)
      : null;

  const market = country ? getMarketProfile(country) : null;

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className={`first-page-root ${enter ? "enter" : ""}`}>
      <TopBar />

      {/* ===== COUNTRY SELECT ===== */}
      {view === "select" && (
        <div className="country-select-screen country-enter">
          <h2>Select a country</h2>
          <div className="country-grid">
            {countries.map((c) => (
              <button
                key={c.code}
                className="country-btn big"
                onClick={() => {
                  setCountry(c.code);
                  setView("dashboard");
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== DASHBOARD ===== */}
      {view === "dashboard" && country && (
        <div className="dashboard-screen">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
              <div className="loading-text">Loading country data…</div>
            </div>
          )}

          {!loading && (
            <div className="dashboard-container">
              <div className="dashboard-main">

                <div className="kpi-column">
                  <KPI label="GDP" value={`${latest(gdp)?.toLocaleString()} €`} />
                  <KPI label="GDP / capita" value={`${Math.round(gdpPerCapita || 0).toLocaleString()} €`} />
                  <KPI label="Population" value={latest(population)?.toLocaleString()} />
                  <KPI label="Median income" value={`${latest(income)?.toLocaleString()} €`} />
                  <KPI label="Inflation" value={`${latest(inflation)} %`} />
                  <KPI label="Unemployment" value={`${latest(unemployment)} %`} />
                  <KPI label="EU" value={market?.isEU ? "Yes" : "No"} />
                  <KPI label="Eurozone" value={market?.isEurozone ? "Yes" : "No"} />
                  <KPI label="Single Market" value={market?.inSingleMarket ? "Yes" : "No"} />

                  <NavLinkButton
                    onClick={() => {
                      setCountry(null);
                      setView("select");
                    }}
                  >
                    ← Back to countries
                  </NavLinkButton>
                </div>

                <div className="charts-area">
                  <div className="charts-col">
                    <ChartBox title="Economic structure">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={sectorData} dataKey="value" nameKey="name" outerRadius={120} labelLine={false}>
                            {sectorData.map((_, i) => (
                              <Cell key={i} fill={["#00f5d4", "#4cc9f0", "#4895ef"][i % 3]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => `${Number(v).toFixed(1)} %`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartBox>

                    <Chart title="Unemployment" data={unemployment} />
                    <Chart title="Population" data={population} />
                  </div>

                  <div className="charts-col">
                    <Chart title="Inflation" data={inflation} />
                    <Chart title="GDP" data={gdp} />
                    <Chart title="Median income" data={income} />
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ===============================
   SMALL COMPONENTS
=============================== */

function KPI({ label, value }: { label: string; value?: string }) {
  return (
    <div className="kpi">
      <span>{label}</span>
      <strong>{value ?? "—"}</strong>
    </div>
  );
}

function Chart({ title, data }: { title: string; data: any[] }) {
  return (
    <ChartBox title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#00f5d4" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

function ChartBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="chart-box">
      <h3>{title}</h3>
      <div className="chart-inner">{children}</div>
    </div>
  );
}
