import { matchCountrySuffix } from "../lib/matchCountryDomain";
import type { OrgScoreRule } from "../types";

export const hasEmailEduDomain: OrgScoreRule = {
  key: "hasEmailEduDomain",
  maxScore: 10,
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
