import { getRule } from "../../lib/getRule";
import { matchCountrySuffix } from "../../lib/matchCountryDomain";
import type { OrgScoreRule } from "../../types";
import { sharedRules } from "../shared/rules";

export const privateSchoolRules: Record<string, OrgScoreRule> = {
  // Shared rules reused
  verified: getRule(sharedRules, "verified"),
  hasWebsite: getRule(sharedRules, "hasWebsite"),
  hasEmail: getRule(sharedRules, "hasEmail"),
  hasPhone: getRule(sharedRules, "hasPhone"),
  hasWhatsapp: getRule(sharedRules, "hasWhatsapp"),
  hasGoogleProfile: getRule(sharedRules, "hasGoogleProfile"),

  // Country-specific EDU domain on website
  hasWebsiteEduDomain: {
    key: "hasWebsiteEduDomain",
    label: "Has Education Domain Matching Country",
    maxScore: 10,
    note: "Checks domain suffix against country-specific education domains",
    compute: ({ org }) => {
      const primary =
        org.locations.find((l) => l.isPrimary) ?? org.locations[0];
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
  },

  // Country-specific EDU domain on email
  hasEmailEduDomain: {
    key: "hasEmailEduDomain",
    label: "Has Education Email Domain Matching Country",
    maxScore: 10,
    note: "Checks email domain suffix against country-specific education domains",
    compute: ({ org }) => {
      const primary =
        org.locations.find((l) => l.isPrimary) ?? org.locations[0];
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
  },
};
