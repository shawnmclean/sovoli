import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const DOMINION_SCHOOLS_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Dominion Schools",
    categories: ["private-school"],
    isVerified: false,
    internalCRM: {
      people: [
        {
          name: "Dominion Schools",
          notes:
            "User reached out during first ad run to directory list to get their school added.",
          contacts: [
            {
              type: "whatsapp",
              value: "+592 622-9382",
              isPublic: true,
            },
          ],
        },
      ],
    },
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/profile.php?id=61566083309964",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "112 Regent Street",
          line2: "Bourda",
          city: "Georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "whatsapp", value: "+592 622-9382", isPublic: true },
          {
            type: "email",
            value: "dominionschoolsoffice@gmail.com",
            isPublic: true,
          },
        ],
        isPrimary: true,
      },
    ],
  },
  academicModule: null,
  websiteModule: null,
  offeringModule: null,
  workforceModule: null,
  scoringModule: null,
};
