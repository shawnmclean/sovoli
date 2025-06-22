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
        "hasGoogleProfile",
        "hasWebsiteEduDomain",
        "hasEmailEduDomain",
      ],
      descriptions: {
        admin:
          "Improving trust signals — such as verification and online presence — helps parents feel confident before contacting your school.",
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
          "Providing valid phone, email, and WhatsApp contact options helps parents reach out easily and builds credibility.",
        parent:
          "These are ways you can directly reach the school to ask questions or schedule a visit.",
      },
    },
  ],

  ruleMetadata: {
    verified: {
      key: "verified",
      defaultLabel: "Verified Organization",
      audienceViews: {
        parent: {
          description: [
            "Indicates the school is officially recognized.",
            "Improves trust with parents, banks, and NGOs.",
          ],
        },
        admin: {
          description: [
            "Submit your business registration document to complete verification.",
            "Verified schools are eligible for grants and financial programs.",
          ],
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
            "Create or claim your Google Business listing to increase visibility.",
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
            "Improves trust, SEO, and eligibility for aid or financial support.",
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
            "Use an email address with your country's education domain (e.g., .edu.gy).",
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
            "Add a WhatsApp contact to improve responsiveness to inquiries.",
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
          description: "Add a website link to improve your online visibility.",
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
