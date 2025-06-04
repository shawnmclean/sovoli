import { ORGS } from "./index";

export const DOMAIN_TO_USERNAME = new Map<string, string>();

for (const entry of ORGS) {
  const username = entry.org.username;
  const domains = entry.websiteModule?.website.domain
    ? [entry.websiteModule.website.domain]
    : [];

  for (const rawDomain of domains) {
    const domain = rawDomain.toLowerCase();

    if (DOMAIN_TO_USERNAME.has(domain)) {
      throw new Error(`Domain conflict: "${domain}" is already assigned.`);
    }

    DOMAIN_TO_USERNAME.set(domain, username);
  }
}
