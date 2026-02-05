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
    .map((time) => ({
      time,
      value: values[timeIndex[time]] ?? null,
    }))
    .filter((d) => d.value !== null);
}

export function extractCountries(data: any): { code: string; name: string }[] {
  const geoLabels = data.dimension.geo.category.label as Record<string, string>;

  return Object.entries(geoLabels)
    // ❌ REMOVE EU / EURO AREA AGGREGATES BY NAME
    .filter(([, name]) => {
      const lower = name.toLowerCase();
      return (
        !lower.includes("euro area") &&
        !lower.includes("european union")
      );
    })
    // ✅ KEEP ONLY REAL COUNTRIES (ISO-2)
    .filter(([code]) => /^[A-Z]{2}$/.test(code))
    // ✅ SORT CLEANLY
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([code, name]) => ({
      code,
      name,
    }));
}