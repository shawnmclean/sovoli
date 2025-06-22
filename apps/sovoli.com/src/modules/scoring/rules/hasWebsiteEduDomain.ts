import { matchCountrySuffix } from "../lib/matchCountryDomain";
import type { OrgScoreRule } from "../types";

export const hasWebsiteEduDomain: OrgScoreRule = {
  key: "hasWebsiteEduDomain",
  maxScore: 10,
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
