import { matchCountrySuffix } from "../lib/matchCountryDomain";
import type { OrgScoreRule } from "../types";

export const hasEmailEduDomain: OrgScoreRule = {
  key: "hasEmailEduDomain",
  label: "Has Education Email Domain Matching Country",
  maxScore: 10,
  note: "Checks email domain suffix against country-specific education domains",
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
        ? `Email domain is valid.`
        : `Schools in ${primary.address.countryCode} should use an email like: example@school${expected[0]}.`,
    });
  },
};
