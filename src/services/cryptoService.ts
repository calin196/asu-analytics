const BASE_URL = "https://api.coingecko.com/api/v3";

/* ===============================
   TYPES
================================ */
export type CryptoMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
};

export type ChartPoint = {
  time: number;
  value: number;
};

export type CryptoHistoryResponse = {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
};

/* ===============================
   SAFE FETCH
================================ */
async function safeFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);

    if (res.status === 429 || !res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ===============================
   LIST
================================ */
export async function fetchTopCryptos(
  limit = 50,
  currency = "usd"
): Promise<CryptoMarket[] | null> {
  return safeFetch<CryptoMarket[]>(
    `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
  );
}

/* ===============================
   HISTORY
================================ */
export async function fetchCryptoHistory(
  id: string,
  days: number | "max",
  currency = "usd"
): Promise<CryptoHistoryResponse | null> {
  return safeFetch<CryptoHistoryResponse>(
    `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
  );
}

/* ===============================
   PARSER
================================ */
export function parseSeries(
  series?: [number, number][]
): ChartPoint[] {
  if (!series) return [];
  return series.map(([time, value]) => ({ time, value }));
}
