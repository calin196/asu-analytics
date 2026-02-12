import { useEffect, useRef, useState } from "react";
import { TopBar } from "../components/TopBar";
import "../styles/crypto.css";

import {
  fetchTopCryptos,
  fetchCryptoHistory,
  parseSeries,
} from "../services/cryptoService";

import { fetchCandles, hasCandles } from "../services/candlesService";

import type {
  CryptoMarket,
  ChartPoint,
} from "../services/cryptoService";

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
  const [period, setPeriod] = useState<number>(30);

  const [capData, setCapData] = useState<ChartPoint[]>([]);
  const [volumeData, setVolumeData] = useState<ChartPoint[]>([]);
  const [candleData, setCandleData] = useState<any[]>([]);

  const candleRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);

  /* ===============================
     LOAD LIST (FILTER COINS WITHOUT CANDLES)
  =============================== */
  useEffect(() => {
  async function loadCoins() {
    const data = await fetchTopCryptos(50);
    if (!data) return;

    const supported: CryptoMarket[] = [];

    for (const coin of data) {
      const ok = await hasCandles(coin.symbol);
      if (ok) supported.push(coin);

      // ⏱️ small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 120));
    }

    setCryptos(supported);
    setSelected(supported[0] ?? null);
  }

  loadCoins();
}, []);


  /* ===============================
     RESET CHART DATA ON COIN CHANGE
  =============================== */
  useEffect(() => {
    setCapData([]);
    setVolumeData([]);
    setCandleData([]);
  }, [selected?.id]);

  /* ===============================
     LOAD DATA
  =============================== */
  useEffect(() => {
    if (!selected) return;

    // Market cap + volume (CoinGecko)
    fetchCryptoHistory(selected.id, period).then((history) => {
      if (!history) return;
      setCapData(parseSeries(history.market_caps));
      setVolumeData(parseSeries(history.total_volumes));
    });

    // Candles (CryptoCompare)
    fetchCandles(selected.symbol, period)
      .then(setCandleData)
      .catch(() => setCandleData([]));
  }, [selected?.id, period]);

  /* ===============================
     CANDLE CHART
  =============================== */
  useEffect(() => {
    if (!candleRef.current) return;
    if (candleData.length === 0) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(candleRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#8fafb3",
      },
      width: candleRef.current.clientWidth,
      height: candleRef.current.clientHeight,
    });

    chartRef.current = chart;

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

    return () => {
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, [candleData]);

  return (
    <div className="crypto-root">
      <TopBar />

      <div className="crypto-layout">
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
          {/* PRICE */}
          <div className="crypto-chart-wrapper">
            <div className="crypto-chart-title">Price</div>

            <div className="crypto-chart large" ref={candleRef}>
              {candleData.length === 0 && (
                <div className="crypto-chart">
                  Loading candles…
                </div>
              )}
            </div>
          </div>

          {/* MARKET CAP */}
          <div className="crypto-chart-wrapper">
            <div className="crypto-chart-title">Market Capitalization</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={capData} key={selected?.id}>
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

          {/* VOLUME */}
          <div className="crypto-chart-wrapper">
            <div className="crypto-chart-title">Trading Volume</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={volumeData} key={selected?.id}>
                <XAxis dataKey="time" tickFormatter={formatDate} />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip />
                <Bar dataKey="value" fill="#4895ef" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
}
