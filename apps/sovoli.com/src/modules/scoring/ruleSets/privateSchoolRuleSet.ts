import type { CategoryRuleSet } from "../types";

export const privateSchoolRuleSet: CategoryRuleSet = {
  category: "private-school",

  groups: [
    {
      key: "trust",
      label: "Trust & Safety",
      weight: 2,
      rules: [
        "verified",
        "hasLogo",
        "hasWebsiteEduDomain",
        "hasEmailEduDomain",
        "hasGoogleProfile",
        "hasWebsite",
      ],
      descriptions: {
        admin:
          "Boost parent confidence by verifying your school and showing you're easy to find online. Simple steps like adding a logo or Google listing can greatly increase trust.",
        parent:
          "These checks help you know if the school is officially recognized and easy to find or verify online.",
      },
    },
    {
      key: "curriculum",
      label: "Learning & Curriculum",
      weight: 2,
      rules: ["hasAcademicPrograms"],
      descriptions: {
        admin:
          "Listing your academic programs clearly demonstrates your school's educational offerings.",
        parent:
          "This shows if the school offers well-defined academic programs for your child's development.",
      },
    },
    {
      key: "communication",
      label: "Communication",
      weight: 1,
      rules: ["hasPhone", "hasEmail", "hasWhatsapp"],
      descriptions: {
        admin:
          "Make it easy for parents to reach you. Add phone, email, and WhatsApp — even one contact helps build trust and makes enrollment easier.",
        parent:
          "These are ways you can directly reach the school to ask questions or schedule a visit.",
      },
    },
    {
      key: "enrollment",
      label: "Enrollment Experience",
      weight: 1,
      rules: ["hasFees"],
      descriptions: {
        admin:
          "A smooth enrollment process makes it easy for parents to join your school. This includes clear fee structures and a user-friendly application process.",
        parent:
          "This shows if the school has a clear and easy enrollment process.",
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
  },
};
