import { useEffect, useRef, useState } from "react";
import { TopBar } from "../components/TopBar";
import "../styles/crypto.css";

import {
  fetchTopCryptos,
  fetchCryptoHistory,
  parseSeries,
} from "../services/cryptoService";

import { fetchCandles, hasCandles } from "../services/candlesService";

import type { CryptoMarket, ChartPoint } from "../services/cryptoService";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  createChart,
  ColorType,
  CandlestickSeries,
} from "lightweight-charts";

import type { UTCTimestamp } from "lightweight-charts";

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
  const [period] = useState<number>(30);

  const [capData, setCapData] = useState<ChartPoint[]>([]);
  const [volumeData, setVolumeData] = useState<ChartPoint[]>([]);
  const [candleData, setCandleData] = useState<any[]>([]);

  const [listLoading, setListLoading] = useState(true);
  const [coinLoading, setCoinLoading] = useState(false);
  const [hasData, setHasData] = useState(true);

  const candleRef = useRef<HTMLDivElement>(null);

  /* ===============================
     LOAD LIST
  =============================== */
  useEffect(() => {
    async function loadCoins() {
      setListLoading(true);

      const data = await fetchTopCryptos(50);
      if (!data) {
        setListLoading(false);
        return;
      }

      const supported: CryptoMarket[] = [];

      for (const coin of data) {
        const ok = await hasCandles(coin.symbol);
        if (ok) supported.push(coin);
        await new Promise((r) => setTimeout(r, 120));
      }

      setCryptos(supported);
      setSelected(supported[0] ?? null);
      setListLoading(false);
    }

    loadCoins();
  }, []);

  /* ===============================
     LOAD COIN DATA (BULLETPROOF)
  =============================== */
  useEffect(() => {
    if (!selected) return;

    let alive = true;

    setCoinLoading(true);
    setHasData(true);

    // reset everything immediately
    setCapData([]);
    setVolumeData([]);
    setCandleData([]);

    Promise.all([
      fetchCryptoHistory(selected.id, period),
      fetchCandles(selected.symbol, period),
    ])
      .then(([history, candles]) => {
        if (!alive) return;

        if (!history || !candles || candles.length === 0) {
          setHasData(false);
          return;
        }

        setCapData(parseSeries(history.market_caps));
        setVolumeData(parseSeries(history.total_volumes));
        setCandleData(candles);
        setHasData(true);
      })
      .catch(() => {
        if (!alive) return;
        setHasData(false);
      })
      .finally(() => {
        if (alive) setCoinLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [selected?.id, period]);

  /* ===============================
     CANDLE CHART (NO GHOSTS)
  =============================== */
  useEffect(() => {
    if (!candleRef.current) return;

    candleRef.current.innerHTML = "";

    if (!hasData || candleData.length === 0) return;

    const chart = createChart(candleRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#8fafb3",
      },
      width: candleRef.current.clientWidth,
      height: candleRef.current.clientHeight,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#00f5d4",
      downColor: "#ef476f",
      borderVisible: false,
    });

    series.setData(
      candleData.map((d) => ({
        time: (d.time / 1000) as UTCTimestamp,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
    );

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [candleData, hasData]);

  return (
    <div className="crypto-root">
      <TopBar />

      <div className="crypto-layout">
        {(listLoading || coinLoading) && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
            <div className="loading-text">
              {listLoading
                ? "Loading cryptocurrencies…"
                : "Loading market data…"}
            </div>
          </div>
        )}

        {/* LEFT */}
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

        {/* RIGHT */}
        <main className="crypto-main">
          {!coinLoading && !hasData && (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8fafb3",
                fontSize: 15,
              }}
            >
              No market data available for this asset
            </div>
          )}

          {hasData && (
            <>
              <div className="crypto-chart-wrapper">
                <div className="crypto-chart-title">Price</div>
                <div className="crypto-chart large" ref={candleRef} />
              </div>

              <div className="crypto-chart-wrapper">
                <div className="crypto-chart-title">
                  Market Capitalization
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={capData}>
                    <XAxis dataKey="time" tickFormatter={formatDate} />
                    <YAxis tickFormatter={formatNumber} />
                    <Tooltip />
                    <Area
                      dataKey="value"
                      stroke="#4cc9f0"
                      fill="rgba(76,201,240,0.3)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="crypto-chart-wrapper">
                <div className="crypto-chart-title">Trading Volume</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={volumeData}>
                    <XAxis dataKey="time" tickFormatter={formatDate} />
                    <YAxis tickFormatter={formatNumber} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4895ef" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
