import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { FITRIGHT_ACADEMY_WEBSITE } from "./website";
import { FITRIGHT_ACADEMIC } from "./academic";
import { FITRIGHT_WORKFORCE } from "./workforce";

export const FITRIGHT_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Fit Right",
    logo: "/orgs/vocational-training/guyana/fitright/logo.png",
    categories: ["vocational-school"],
    locations: [
      {
        key: "main-location",
        address: {
          line1: "Charlotte Street",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJMTbWJMjvr40RqnbyaycDRFw",
        contacts: [
          {
            type: "whatsapp",
            value: "+13862798247",
            isPublic: false,
          },
        ],
        isPrimary: true,
      },
    ],
  },
  websiteModule: FITRIGHT_ACADEMY_WEBSITE,
  academicModule: FITRIGHT_ACADEMIC,
  offeringModule: null,
  workforceModule: FITRIGHT_WORKFORCE,
  scoringModule: null,
};
