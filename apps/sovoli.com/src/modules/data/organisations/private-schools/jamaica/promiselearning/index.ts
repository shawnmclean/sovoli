import type { OrgInstance } from "~/modules/organisations/types";

import { PROMISE_LEARNING_ACADEMIC } from "./academic";
import { ORG_USERNAME } from "./constants";

export const PROMISE_LEARNING_CENTRE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Promise Learning Centre",
    categories: ["private-school", "special-education-school"],
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-02-19",
      documents: [],
      notes: "Awaiting updated non-profit registration documents from the centre.",
    },
    internalCRM: {
      claimStatus: "unclaimed",
      people: [
        {
          name: "Marcia Jarrett",
          contacts: [],
          notes: "Founder and director; special educator who established the centre in 1993.",
        },
      ],
    },
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "58 Hagley Park Road",
          city: "Kingston",
          state: "St. Andrew",
          postalCode: "Kingston 10",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-906-8283",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "phone",
            value: "+1-876-631-5201",
            label: "Office",
            isPublic: true,
          },
        ],
      },
    ],
    socialLinks: [
      { platform: "website", url: "https://www.promiselearningcentre.com" },
      { platform: "facebook", url: "https://www.facebook.com/promiselearningcentre" },
      { platform: "instagram", url: "https://www.instagram.com/promiselearningcentre" },
    ],
  },
  websiteModule: null,
  academicModule: PROMISE_LEARNING_ACADEMIC,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
