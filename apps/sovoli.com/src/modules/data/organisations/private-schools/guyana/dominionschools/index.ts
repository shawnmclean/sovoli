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
        url: "https://www.facebook.com/people/Dominion-Schools/100044258427036/",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "RR5W+F74, Regent St",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJzyj03p7vr40RXk47iTW-wqs",
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
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
