const BASE_URL = "https://api.worldbank.org/v2";

export async function fetchSectorShares(countryCode: string) {
  const indicators = {
    agriculture: "NV.AGR.TOTL.ZS",
    industry: "NV.IND.TOTL.ZS",
    services: "NV.SRV.TOTL.ZS",
  };

  const fetchIndicator = async (indicator: string) => {
    const res = await fetch(
      `${BASE_URL}/country/${countryCode}/indicator/${indicator}?format=json&per_page=1`
    );
    const json = await res.json();
    return json[1]?.[0]?.value ?? null;
  };

  const [agriculture, industry, services] = await Promise.all([
    fetchIndicator(indicators.agriculture),
    fetchIndicator(indicators.industry),
    fetchIndicator(indicators.services),
  ]);

  return [
    { name: "Agriculture", value: agriculture },
    { name: "Industry", value: industry },
    { name: "Services", value: services },
  ].filter(d => d.value !== null);
}