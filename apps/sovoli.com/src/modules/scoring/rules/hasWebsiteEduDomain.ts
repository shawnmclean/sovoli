import { matchCountrySuffix } from "../lib/matchCountryDomain";
import type { OrgScoreRule } from "../types";

export const hasWebsiteEduDomain: OrgScoreRule = {
  key: "hasWebsiteEduDomain",
  label: "Has Education Domain Matching Country",
  maxScore: 10,
  consumerDescription:
    "Schools that use country-specific education domains (like .edu.gy) are more easily recognized by parents, grant providers, and institutions as trusted, official entities.",
  adminDescription: [
    "Register your school's website with a country-specific education domain (e.g., .edu.gy, .edu.jm).",
    "This boosts search visibility and helps Sovoli validate your institution.",
    "It also improves your eligibility for loans, grants, and scholarship directories.",
  ],
  compute: ({ org }) => {
    const primary = org.locations.find((l) => l.isPrimary) ?? org.locations[0];
    const websiteUrl = org.socialLinks?.find(
      (l) => l.platform === "website",
    )?.url;

    if (!primary?.address.countryCode || !websiteUrl) {
      return Promise.resolve({
        score: 0,
        note: "Missing primary country or website URL.",
      });
    }

    const { matched, expected } = matchCountrySuffix({
      values: [websiteUrl],
      countryCode: primary.address.countryCode,
    });

    return Promise.resolve({
      score: matched ? 10 : 0,
      note: matched
        ? "Website domain matches country’s education domain standards."
        : `Website domain does not match expected format. Use a domain like: ${expected.join(", ")}.`,
    });
  },
};
