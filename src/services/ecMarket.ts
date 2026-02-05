/**
 * European Commission – Market & Regulatory Information
 *
 * This file provides STRUCTURAL economic indicators:
 * - EU membership
 * - Eurozone membership
 * - Single Market participation
 * - Customs Union participation
 *
 * These are derived from official EC rules (static, stable).
 */

/** EU Member States (ISO-2) */
const EU_COUNTRIES = [
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","EL",
  "HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK",
  "SI","ES","SE"
];

/** Eurozone members (as of 2024) */
const EUROZONE_COUNTRIES = [
  "AT","BE","HR","CY","EE","FI","FR","DE","GR","IE","IT","LV",
  "LT","LU","MT","NL","PT","SK","SI","ES"
];

/** Countries participating in the EU Single Market */
const SINGLE_MARKET_COUNTRIES = [
  ...EU_COUNTRIES,
  "IS","LI","NO" // EEA
];

/** EU Customs Union participants */
const CUSTOMS_UNION_COUNTRIES = [
  ...EU_COUNTRIES,
  "TR" // Turkey
];

/**
 * Get market/regulatory profile for a country
 */
export function getMarketProfile(countryCode: string) {
  return {
    isEU: EU_COUNTRIES.includes(countryCode),
    isEurozone: EUROZONE_COUNTRIES.includes(countryCode),
    inSingleMarket: SINGLE_MARKET_COUNTRIES.includes(countryCode),
    inCustomsUnion: CUSTOMS_UNION_COUNTRIES.includes(countryCode),
  };
}