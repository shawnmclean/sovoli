import type { CategoryRuleSet } from "../types";

export const privateSchoolRuleSet: CategoryRuleSet = {
  category: "private-school",

  groups: [
    {
      key: "visibility",
      label: "Visibility & Trust",
      weight: 2,
      rules: [
        "verified",
        "hasLogo",
        "hasWebsite",
        "hasWebsiteEduDomain",
        "hasEmailEduDomain",
        "hasGoogleProfile",
      ],
      descriptions: {
        admin:
          "Increase your school's credibility and discoverability with a verified profile, branded logo, and official domains.",
        parent:
          "These signals help you know if the school is officially recognized, findable online, and professionally managed.",
      },
    },
    {
      key: "transparency",
      label: "Transparency of Information",
      weight: 2,
      rules: ["hasFees", "hasTeachers", "hasAcademicPrograms"],
      descriptions: {
        admin:
          "Publishing fee structures, staff, student numbers, and academic programs builds parent trust and reduces inbound questions.",
        parent:
          "This tells you what the school costs, who teaches, how many students attend, and what is taught.",
      },
    },
    {
      key: "communication",
      label: "Communication & Parent Support",
      weight: 1.5,
      rules: ["hasPhone", "hasEmail", "hasWhatsapp", "hasParentPortal"],
      descriptions: {
        admin:
          "Strong communication channels and parent portals improve engagement and reduce confusion.",
        parent:
          "Lets you know how you'll get updates, speak with staff, and access school information.",
      },
    },
    {
      key: "enrollment",
      label: "Enrollment Experience",
      weight: 1.5,
      rules: ["enrollmentMethod"],
      descriptions: {
        admin:
          "A smooth enrollment experience makes it easier to attract and retain families. Add clear instructions and timelines.",
        parent:
          "Tells you how to apply, what the process is like, and whether it's simple or frustrating.",
      },
    },
    {
      key: "systems",
      label: "Digital Infrastructure",
      weight: 1,
      rules: [],
      descriptions: {
        admin:
          "Shows your level of digital maturity across operations like student records, billing, transport, and more.",
        parent:
          "Indicates whether the school uses modern systems for safety, academics, and administration.",
      },
    },
  ],

  ruleMetadata: {
    verified: {
      key: "verified",
      defaultLabel: "Verified Organization",
      audienceViews: {
        parent: {
          description:
            "Indicates the school is officially recognized by the government.",
        },
        admin: {
          description: [
            "Send your business registration (PDF or photo). We’ll handle the rest and mark you verified.",
            "Verification unlocks access to grants and increases parent trust.",
          ],
        },
      },
    },
    hasLogo: {
      key: "hasLogo",
      defaultLabel: "Logo Available",
      audienceViews: {
        parent: {
          description: "Shows the school has a logo.",
        },
        admin: {
          description: "Add a logo to improve your online visibility.",
        },
      },
    },
    hasGoogleProfile: {
      key: "hasGoogleProfile",
      defaultLabel: "Google Business Profile",
      audienceViews: {
        parent: {
          description: "Helps parents find the school easily on Google Maps.",
        },
        admin: {
          description:
            "This puts your school on Google Maps — free and fast. Parents search here first.",
        },
      },
    },
    hasWebsiteEduDomain: {
      key: "hasWebsiteEduDomain",
      defaultLabel: "Has Education Website Domain",
      audienceViews: {
        parent: {
          description:
            "Shows the school uses an official education domain tied to the country.",
        },
        admin: {
          description: [
            "Use a website with your country's .edu domain (e.g., .edu.gy).",
            "An .edu domain is a sign of legitimacy and trust.",
            "Some banks and funds require a .edu domain to be eligible for loans.",
          ],
        },
      },
    },
    hasEmailEduDomain: {
      key: "hasEmailEduDomain",
      defaultLabel: "Has Education Email Domain",
      audienceViews: {
        parent: {
          description:
            "Signals that the school is using a professional education-based email.",
        },
        admin: {
          description:
            "Use a school-branded email (e.g., info@school.edu.gy) to look more official and build trust.",
        },
      },
    },
    hasAcademicPrograms: {
      key: "hasAcademicPrograms",
      defaultLabel: "Academic Programs Listed",
      audienceViews: {
        parent: {
          description:
            "Helps parents understand what levels and subjects are available.",
        },
        admin: {
          description:
            "List the school's academic programs to better inform prospective families.",
        },
      },
    },
    hasPhone: {
      key: "hasPhone",
      defaultLabel: "Phone Number Available",
      audienceViews: {
        parent: {
          description: "Allows direct voice communication with the school.",
        },
        admin: {
          description:
            "Add a valid phone number so parents can call your school directly.",
        },
      },
    },
    hasEmail: {
      key: "hasEmail",
      defaultLabel: "Email Address Available",
      audienceViews: {
        parent: {
          description: "Enables direct written communication with the school.",
        },
        admin: {
          description:
            "Add a valid school email address so parents and institutions can reach you.",
        },
      },
    },
    hasWhatsapp: {
      key: "hasWhatsapp",
      defaultLabel: "WhatsApp Contact Available",
      audienceViews: {
        parent: {
          description: "Lets you message the school easily on WhatsApp.",
        },
        admin: {
          description:
            "Most parents use WhatsApp first. Just add a number so they can message easily.",
        },
      },
    },
    hasWebsite: {
      key: "hasWebsite",
      defaultLabel: "Website Available",
      audienceViews: {
        parent: {
          description:
            "Shows the school has an online presence with a website.",
        },
        admin: {
          description:
            "Parents search online — even a simple site with your contact info builds trust and helps you show up on Google.",
        },
      },
    },
    hasFacebook: {
      key: "hasFacebook",
      defaultLabel: "Facebook Page Available",
      audienceViews: {
        parent: {
          description:
            "Indicates the school has a social media presence on Facebook.",
        },
        admin: {
          description:
            "Add a Facebook page link to improve social media presence.",
        },
      },
    },
    enrollmentMethod: {
      key: "enrollmentMethod",
      defaultLabel: "Enrollment Method",
      audienceViews: {
        parent: {
          description: "Shows the school has a parent portal.",
        },
        admin: {
          description:
            "Add an enrollment method to improve communication with parents.",
        },
      },
    },
    hasFees: {
      key: "hasFees",
      defaultLabel: "Fees Available",
      audienceViews: {
        parent: {
          description: "Shows the school has fees.",
        },
        admin: {
          description:
            "Add fees to improve enrollment and financial transparency.",
        },
      },
    },
    hasParentPortal: {
      key: "hasParentPortal",
      defaultLabel: "Parent Portal Available",
      audienceViews: {
        parent: {
          description: "Shows the school has a parent portal.",
        },
        admin: {
          description:
            "Add a parent portal to improve communication with parents.",
        },
      },
    },
    hasTeachers: {
      key: "hasTeachers",
      defaultLabel: "Teachers Listed",
      audienceViews: {
        parent: {
          description: "Shows the school has teachers listed.",
        },
        admin: {
          description: "Add teachers to improve communication with parents.",
        },
      },
    },
  },
};
