import { verified } from "./verfied";
import { hasWebsite } from "./hasWebsite";
import { hasFacebook } from "./hasFacebook";
import { hasEmail } from "./hasEmail";
import { hasPhone } from "./hasPhone";
import { hasWhatsapp } from "./hasWhatsapp";
import { hasGoogleProfile } from "./hasGoogleProfile";
import { hasWebsiteEduDomain } from "./hasWebsiteEduDomain";
import { hasEmailEduDomain } from "./hasEmailEduDomain";
import { hasAcademicPrograms } from "./hasAcademicPrograms";

export const rules = {
  verified,
  hasWebsite,
  hasFacebook,
  hasEmail,
  hasPhone,
  hasWhatsapp,
  hasGoogleProfile,
  hasWebsiteEduDomain,
  hasEmailEduDomain,
  hasAcademicPrograms,
};

export type RuleKey = keyof typeof rules;
