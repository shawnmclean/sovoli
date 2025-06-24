import { verified } from "./verified";
import { hasWebsite } from "./hasWebsite";
import { hasFacebook } from "./hasFacebook";
import { hasEmail } from "./hasEmail";
import { hasPhone } from "./hasPhone";
import { hasWhatsapp } from "./hasWhatsapp";
import { hasGoogleProfile } from "./hasGoogleProfile";
import { hasWebsiteEduDomain } from "./hasWebsiteEduDomain";
import { hasEmailEduDomain } from "./hasEmailEduDomain";
import { hasAcademicPrograms } from "./hasAcademicPrograms";
import { hasLogo } from "./hasLogo";
import { hasFees } from "./hasFees";

export const rules = {
  verified,
  hasLogo,
  hasWebsite,
  hasFacebook,
  hasEmail,
  hasPhone,
  hasWhatsapp,
  hasGoogleProfile,
  hasWebsiteEduDomain,
  hasEmailEduDomain,
  hasAcademicPrograms,
  hasFees,
};

export type RuleKey = keyof typeof rules;
