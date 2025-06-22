const countryMap: Record<string, string> = {
  Guyana: "GY",
  Jamaica: "JM",
  "United States": "US",
  Canada: "CA",
  "United Kingdom": "GB",
  India: "IN",
  Germany: "DE",
  France: "FR",
  Nigeria: "NG",
  Brazil: "BR",
  // Add more as needed
};

// Normalize names for lookup
function normalize(nameOrCode: string) {
  return nameOrCode.trim().toLowerCase();
}

// Country Name → Code
export function countryNameToCode(name: string): string | undefined {
  const entry = Object.entries(countryMap).find(
    ([countryName]) => normalize(countryName) === normalize(name),
  );
  return entry?.[1];
}

// Country Code → Name
export function countryCodeToName(code: string): string | undefined {
  const entry = Object.entries(countryMap).find(
    ([, countryCode]) => normalize(countryCode) === normalize(code),
  );
  return entry?.[0];
}
