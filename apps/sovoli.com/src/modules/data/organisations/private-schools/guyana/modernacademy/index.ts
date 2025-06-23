import type { OrgInstance } from "~/modules/organisations/types";
import { MODERN_ACADEMY_ACADEMIC } from "./academic";
import { ORG_USERNAME } from "./constants";
import { MODERN_ACADEMY_OFFERINGS } from "./offering";
import { MODERN_ACADEMY_WORKFORCE } from "./workforce";
import { MODERN_ACADEMY_WEBSITE } from "./website";

export const MODERN_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Modern Academy",
    logo: "/orgs/magy/logo.webp",
    isVerified: true,
    internalCRM: {
      people: [
        {
          name: "Joel",
          contacts: [
            {
              type: "whatsapp",
              value: "+592 627-1915",
              label: "Joel",
              isPublic: false,
            },
          ],
        },
      ],
    },
    categories: ["private-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        address: {
          line1: "Lot 11, Public Road",
          city: "Mon Repos",
          countryCode: "GY",
        },
        placeId: "ChIJKbqkI_ftr40RoBB0_9AsWAo",
        coordinates: {
          lat: 6.807574377222727,
          lng: -58.053166525904416,
        },
        contacts: [
          {
            type: "email",
            value: "info@ma.edu.gy",
            isPublic: true,
          },
          {
            type: "phone",
            value: "+592 627-1915",
            label: "Joel",
            isPublic: true,
          },
          {
            type: "phone",
            value: "+592 751-3788",
            label: "Nessa",
            isPublic: true,
          },
          {
            type: "whatsapp",
            value: "+592 627-1915",
            label: "Joel",
            isPublic: true,
          },
          {
            type: "whatsapp",
            value: "+592 751-3788",
            label: "Nessa",
            isPublic: true,
          },
        ],
        isPrimary: true,
      },
      // {
      //   key: "secondary-campus",
      //   address: {
      //     line1: "Lot 11, Public Road, Mon Repos",
      //     city: "Georgetown",
      //     countryCode: "GY",
      //   },
      //   contacts: [
      //     {
      //       type: "email",
      //       value: "info@ma.edu.gy",
      //       isPublic: true,
      //     },
      //   ],
      // },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/profile.php?id=100063128446623",
      },
      {
        platform: "website",
        url: "https://www.ma.edu.gy",
      },
    ],
  },
  websiteModule: MODERN_ACADEMY_WEBSITE,
  academicModule: MODERN_ACADEMY_ACADEMIC,
  offeringModule: MODERN_ACADEMY_OFFERINGS,
  workforceModule: MODERN_ACADEMY_WORKFORCE,
  scoringModule: null,
};
