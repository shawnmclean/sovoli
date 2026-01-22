import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const ANAIS_PRIVATE_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Anais Private School",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "149 Crown Street",
          line2: "Queenstown",
          city: "Georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "phone", value: "+592-227-7757", isPublic: true },
          {
            type: "phone",
            value: "+592-667-2965",
            label: "Facebook",
            isPublic: true,
          },
          { type: "email", value: "amsteron@yahoo.com", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/profile.php/?id=61561711731990",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
