// src/services/eurostat.ts

const BASE_URL =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";

export async function fetchEurostat(
  dataset: string,
  params: Record<string, string>
) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}/${dataset}?${query}`);

  if (!response.ok) {
    throw new Error("Eurostat API error");
  }

  return response.json();
}

export function parseTimeSeries(data: any) {
  const timeIndex = data.dimension.time.category.index;
  const values = data.value;

  return Object.keys(timeIndex)
    .map((year) => ({
      year,
      value: values[timeIndex[year]] ?? null,
    }))
    .filter((d) => d.value !== null);
}