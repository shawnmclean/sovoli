import { ORGS } from "./index";

// Build a mapping: domain → username
export const DOMAIN_TO_USERNAME = new Map<string, string>();

const seen = new Set<string>();

for (const entry of ORGS) {
  const { username } = entry.org;
  const { domains } = entry.website;

  for (const domain of domains) {
    const key = domain.toLowerCase();

    if (seen.has(key)) {
      throw new Error(`Duplicate domain detected: ${key}`);
    }

    DOMAIN_TO_USERNAME.set(key, username);
    seen.add(key);
  }
}
