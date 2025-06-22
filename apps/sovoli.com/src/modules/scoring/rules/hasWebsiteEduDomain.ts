import { matchCountrySuffix } from "../lib/matchCountryDomain";
import type { OrgScoreRule } from "../types";

export const hasWebsiteEduDomain: OrgScoreRule = {
  key: "hasWebsiteEduDomain",
  label: "Has Education Domain Matching Country",
  maxScore: 10,
  note: "Checks domain suffix against country-specific education domains",
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
        ? `Website domain is valid.`
        : `Schools in ${primary.address.countryCode} should use a domain like: ${expected.join(", ")}.`,
    });
  },
};
