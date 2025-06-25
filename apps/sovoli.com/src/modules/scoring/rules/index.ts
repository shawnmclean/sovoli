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
import { enrollmentMethod } from "./enrollmentMethod";
import { hasParentPortal } from "./hasParentPortal";
import { hasTeachers } from "./hasTeachers";
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
