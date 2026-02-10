import { useEffect, useState } from "react";
import { TopBar } from "../components/TopBar";
import "../styles/crypto.css";

import {
  fetchTopCryptos,
  fetchCryptoHistory,
  parseSeries,
} from "../services/cryptoService";
import type { CryptoMarket, ChartPoint } from "../services/cryptoService";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/* ===============================
   HELPERS
================================ */

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

const formatNumber = (v: number) =>
  Intl.NumberFormat(undefined, { notation: "compact" }).format(v);

export function Crypto() {
  const [cryptos, setCryptos] = useState<CryptoMarket[]>([]);
  const [selected, setSelected] = useState<CryptoMarket | null>(null);

  const [period, setPeriod] = useState<number | "max">(7);

  const [priceData, setPriceData] = useState<ChartPoint[]>([]);
  const [capData, setCapData] = useState<ChartPoint[]>([]);
  const [volumeData, setVolumeData] = useState<ChartPoint[]>([]);

  const [listLoading, setListLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  /* ===============================
     LOAD LIST
  =============================== */
  useEffect(() => {
    setListLoading(true);

    fetchTopCryptos(50)
      .then((data) => {
        if (!data || data.length === 0) {
          setCryptos([]);
          setSelected(null);
          return;
        }

        setCryptos(data);
        setSelected(data[0]);
      })
      .finally(() => setListLoading(false));
  }, []);

  /* ===============================
     LOAD HISTORY
  =============================== */
  useEffect(() => {
    if (!selected) return;

    setDataLoading(true);

    fetchCryptoHistory(selected.id, period)
      .then((data) => {
        if (!data) {
          setPriceData([]);
          setCapData([]);
          setVolumeData([]);
          return;
        }

        setPriceData(parseSeries(data.prices));
        setCapData(parseSeries(data.market_caps));
        setVolumeData(parseSeries(data.total_volumes));
      })
      .finally(() => setDataLoading(false));
  }, [selected, period]);

  const showOverlay = listLoading || dataLoading;

  return (
    <div className="crypto-root">
      <TopBar />

      {showOverlay && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <div className="loading-text">
            {listLoading ? "Loading markets…" : "Loading crypto data…"}
          </div>
        </div>
      )}

      {!listLoading && (
        <div className="crypto-layout">
          {/* LEFT — LIST */}
          <aside className="crypto-list">
            <div className="crypto-scroll">
              {cryptos.map((c) => (
                <button
                  key={c.id}
                  className={`crypto-item ${
                    selected?.id === c.id ? "active" : ""
                  }`}
                  onClick={() => setSelected(c)}
                >
                  <img src={c.image} className="crypto-icon" />
                  <div className="crypto-info">
                    <span className="crypto-name">{c.name}</span>
                    <span className="crypto-symbol">
                      {c.symbol.toUpperCase()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* RIGHT — CHARTS */}
          <main className="crypto-main">
            {/* PERIOD SELECTOR — ABOVE ALL CHARTS */}
            <div className="crypto-period-bar">
              <div className="period-selector">
                {[1, 7, 30, 365].map((p) => (
                <button
                    key={p}
                    className={period === p ? "active" : ""}
                    onClick={() => setPeriod(p)}
                >
                    {p === 1 ? "1D" : p === 7 ? "7D" : p === 30 ? "1M" : "1Y"}
                </button>
                ))}

              </div>
            </div>

            {/* PRICE */}
            <div className="crypto-chart-wrapper">
              <div className="crypto-chart-title">Price</div>
              <div className="crypto-chart large">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData}>
                    <XAxis dataKey="time" tickFormatter={formatDate} />
                    <YAxis tickFormatter={formatNumber} />
                    <Tooltip
                      labelFormatter={(v) => formatDate(Number(v))}
                      formatter={(v) => `$${formatNumber(Number(v))}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#00f5d4"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* MARKET CAP */}
            <div className="crypto-chart-wrapper">
              <div className="crypto-chart-title">Market Capitalization</div>
              <div className="crypto-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={capData}>
                    <XAxis dataKey="time" tickFormatter={formatDate} />
                    <YAxis tickFormatter={formatNumber} />
                    <Tooltip
                      labelFormatter={(v) => formatDate(Number(v))}
                      formatter={(v) => `$${formatNumber(Number(v))}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#4cc9f0"
                      fill="rgba(76,201,240,0.25)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* VOLUME */}
            <div className="crypto-chart-wrapper">
              <div className="crypto-chart-title">Trading Volume</div>
              <div className="crypto-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <XAxis dataKey="time" tickFormatter={formatDate} />
                    <YAxis tickFormatter={formatNumber} />
                    <Tooltip
                      labelFormatter={(v) => formatDate(Number(v))}
                      formatter={(v) => formatNumber(Number(v))}
                    />
                    <Bar dataKey="value" fill="#4895ef" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
