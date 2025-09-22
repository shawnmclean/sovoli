import type { OrgInstance } from "~/modules/organisations/types";
import { OrgLocationFeature } from "~/modules/organisations/types";

import { VAZ_PREP_ACADEMIC } from "./academic";
import { ORG_USERNAME } from "./constants";

export const VAZ_PREPARATORY_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Vaz Preparatory School",
    categories: ["private-school", "nursery-school", "primary-school"],
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-02-19",
      documents: [],
      notes: "Awaiting official verification documents from the Ministry of Education and Youth (Jamaica).",
    },
    internalCRM: {
      claimStatus: "unclaimed",
      people: [
        {
          name: "Hazel Louise Vaz",
          contacts: [],
          notes: "Founder and first principal (1951–1976); pioneer of preparatory education in Kingston.",
        },
        {
          name: "Karlene Bisnott-Hemmings",
          contacts: [],
          notes: "Principal since 2008 and third head of the institution.",
        },
      ],
    },
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "11 1/2 Dunoon Road",
          line2: "Rollington Town",
          city: "Kingston",
          postalCode: "Kingston 2",
          countryCode: "JM",
        },
        coordinates: {
          lat: 17.976101,
          lng: -76.766762,
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-928-2645",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "phone",
            value: "+1-876-938-3241",
            label: "Office",
            isPublic: true,
          },
          {
            type: "phone",
            value: "+1-876-928-1226",
            label: "Office",
            isPublic: true,
          },
          {
            type: "email",
            value: "vazprep2@hotmail.com",
            label: "Admissions",
            isPublic: true,
            primary: true,
          },
        ],
        features: [OrgLocationFeature.ONSITE_PARKING],
      },
    ],
    socialLinks: [
      { platform: "website", url: "https://www.vazprep.edu.jm" },
      { platform: "facebook", url: "https://www.facebook.com/vazprepcommunity" },
      { platform: "instagram", url: "https://www.instagram.com/vazprep" },
      { platform: "x", url: "https://twitter.com/VazPreparatory" },
      {
        platform: "other",
        label: "Ministry Directory Listing",
        url: "https://moey.gov.jm/wp-content/uploads/2020/05/Directory-of-Educational-Institutions-2018-19-1.pdf",
      },
    ],
    techStack: {
      enrollment: {
        name: "Online Registration Portal",
        method: "external-form",
        url: "https://www.vazprep.edu.jm/enroll",
        notes: "Parents complete the admissions form through the school website.",
      },
      sis: {
        name: "SmartTerm",
        url: "https://vaz.mysmartterm.com",
        type: "external",
        notes: "Student information system and parent portal.",
      },
    },
  },
  websiteModule: null,
  academicModule: VAZ_PREP_ACADEMIC,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
