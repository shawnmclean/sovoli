import { enrollmentMethod } from "./enrollmentMethod";
import { hasAcademicPrograms } from "./hasAcademicPrograms";
import { hasEmail } from "./hasEmail";
import { hasEmailEduDomain } from "./hasEmailEduDomain";
import { hasFacebook } from "./hasFacebook";
import { hasFees } from "./hasFees";
import { hasGoogleProfile } from "./hasGoogleProfile";
import { hasLogo } from "./hasLogo";
import { hasParentPortal } from "./hasParentPortal";
import { hasPhone } from "./hasPhone";
import { hasTeachers } from "./hasTeachers";
import { hasWebsite } from "./hasWebsite";
import { hasWebsiteEduDomain } from "./hasWebsiteEduDomain";
import { hasWhatsapp } from "./hasWhatsapp";
import { isClaimed } from "./isClaimed";
import { isVerified } from "./isVerified";

export const rules = {
  isVerified,
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
  enrollmentMethod,
  hasParentPortal,
  hasTeachers,
  isClaimed,
};

export type RuleKey = keyof typeof rules;
