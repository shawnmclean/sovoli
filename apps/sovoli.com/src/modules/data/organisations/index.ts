import type { OrgInstance } from "~/modules/organisations/types";

import { PRIVATE_SCHOOLS } from "./private-schools";
import { PUBLIC_SCHOOLS } from "./public-schools";
import { STATIONARY_ORGS } from "./stationary";
import { VOCATIONAL_SCHOOLS } from "./vocational-school";

const orgs: OrgInstance[] = [
  ...PRIVATE_SCHOOLS,
  ...PUBLIC_SCHOOLS,
  ...STATIONARY_ORGS,
  ...VOCATIONAL_SCHOOLS,
];

export const DOMAIN_TO_USERNAME = new Map<string, string>();

for (const entry of orgs) {
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

export const ORGS = orgs;
