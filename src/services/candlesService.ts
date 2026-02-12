const CC_BASE = "https://min-api.cryptocompare.com/data/v2";

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

/**
 * CryptoCompare candles (multi-exchange aggregated)
 * Works for MOST coins (BTC, ETH, SOL, ADA, MATIC, AVAX, DOT, XRP, DOGE, SHIB, ATOM, etc.)
 */
export async function fetchCandles(
  symbol: string,
  days: number,
  apiKey?: string
): Promise<Candle[]> {
  const url =
    `${CC_BASE}/histoday?fsym=${symbol.toUpperCase()}` +
    `&tsym=USD&limit=${days}` +
    (apiKey ? `&api_key=${apiKey}` : "");

  const res = await fetch(url);

  if (!res.ok) {
    console.warn("CryptoCompare error", res.status);
    return [];
  }

  const json = await res.json();

  if (!json?.Data?.Data) return [];

  return json.Data.Data.map((d: any) => ({
    time: d.time * 1000, // seconds → ms
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
  }));
}
export async function hasCandles(symbol: string): Promise<boolean> {
  const url =
    `https://min-api.cryptocompare.com/data/v2/histoday` +
    `?fsym=${symbol.toUpperCase()}&tsym=USD&limit=10`;

  try {
    const res = await fetch(url);
    if (!res.ok) return false;

    const json = await res.json();
    const data = json?.Data?.Data;

    // ✅ accept coin if ANY candle exists
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}


