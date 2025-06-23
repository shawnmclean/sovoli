import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { DOMINION_SCHOOLS_ACADEMIC } from "./academic";

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
              isPublic: false,
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
          line1: "Lot 112 Regent Road",
          line2: "Bourda",
          city: "georgetown",
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
  websiteModule: null,
  academicModule: DOMINION_SCHOOLS_ACADEMIC,
  offeringModule: null,
  workforceModule: null,
  scoringModule: null,
};
