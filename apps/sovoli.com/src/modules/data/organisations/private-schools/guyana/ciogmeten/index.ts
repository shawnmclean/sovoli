import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const CIOGMETEN_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "CIOG-Meten Meer Zorg Islamic Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { countryCode: "GY" },
        contacts: [{ type: "phone", value: "+592-689-5420", isPublic: true }],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/people/CIOG-Meten-Meer-Zorg-Islamic-Academy/100089279011270/",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
