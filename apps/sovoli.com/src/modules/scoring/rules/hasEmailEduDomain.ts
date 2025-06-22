import { matchCountrySuffix } from "../lib/matchCountryDomain";
import type { OrgScoreRule } from "../types";

export const hasEmailEduDomain: OrgScoreRule = {
  key: "hasEmailEduDomain",
  label: "Has Education Email Domain Matching Country",
  maxScore: 10,

  consumerDescription:
    "An education-specific email domain (like .edu.gy) shows that the school operates within its country’s formal education system.",

  adminDescription:
    "Use a professional email with your country’s education domain (e.g. example@school.edu.gy) to increase credibility and match Sovoli's verified formats.",

  compute: ({ org }) => {
    const primary = org.locations.find((l) => l.isPrimary) ?? org.locations[0];
    const emails = org.locations
      .flatMap((l) => l.contacts)
      .filter((c) => c.type === "email")
      .map((c) => c.value);

    if (!primary?.address.countryCode || emails.length === 0) {
      return Promise.resolve({
        score: 0,
        note: "Missing primary country or email address.",
      });
    }

    const { matched, expected } = matchCountrySuffix({
      values: emails,
      countryCode: primary.address.countryCode,
    });

    return Promise.resolve({
      score: matched ? 10 : 0,
      note: matched
        ? "Email domain matches the expected education format."
        : `Email domain does not match expected format. Try using example@school${expected[0]}.`,
    });
  },
};
