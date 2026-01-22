import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import bingResultImage from "./[category]/components/bing-result.png";
import googleResultImage from "./[category]/components/google-maps.png";
import sovoliDirectoryImage from "./[category]/components/sovoli-directory.png";

export type BusinessCategory =
  | "private-schools"
  | "beauty-schools"
  | "fashion-schools"
  | "farms"
  | "personal-trainers"
  | "music-schools";

export interface BusinessCategoryMeta {
  id: BusinessCategory;
  label: string;
  shortDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  image: string;
  gradient: string;
}

export const BUSINESS_CATEGORIES: BusinessCategoryMeta[] = [
  {
    id: "private-schools",
    label: "Private Schools",
    shortDescription:
      "Help parents find your school and understand your programs before they message you.",
    heroTitle: "Growth Systems for Private Schools",
    heroSubtitle:
      "Get found online, give parents clear information, and make enrollment easier to manage.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
  },
  {
    id: "beauty-schools",
    label: "Beauty Schools",
    shortDescription:
      "Get found by customers searching for beauty and wellness services and convert clicks into bookings.",
    heroTitle: "Growth Systems for Beauty & Wellness Businesses",
    heroSubtitle:
      "Get discovered online, showcase your services, and turn customer searches into appointments and sales.",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    gradient: "from-pink-500 via-rose-500 to-fuchsia-500",
  },
  {
    id: "fashion-schools",
    label: "Fashion Schools",
    shortDescription:
      "Reach customers searching for fashion and sewing services and convert clicks into sales conversations.",
    heroTitle: "Growth Systems for Fashion & Sewing Businesses",
    heroSubtitle:
      "Get discovered online, showcase your products and services, and turn customer searches into inquiries and sales.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
  },
  {
    id: "farms",
    label: "Farms",
    shortDescription:
      "Get found by customers searching for agricultural products and services and convert clicks into sales.",
    heroTitle: "Growth Systems for Agriculture Businesses",
    heroSubtitle:
      "Get discovered online, showcase your products, and turn customer searches into inquiries and sales.",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
  },
  {
    id: "personal-trainers",
    label: "Personal Trainers",
    shortDescription:
      "Get found by customers searching for fitness and sports services and convert clicks into bookings.",
    heroTitle: "Growth Systems for Personal Trainers",
    heroSubtitle:
      "Get discovered online, showcase your services, and turn customer searches into appointments and sales.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
  {
    id: "music-schools",
    label: "Music Schools",
    shortDescription:
      "Reach customers searching for music lessons and services and convert clicks into sales conversations.",
    heroTitle: "Growth Systems for Music Schools",
    heroSubtitle:
      "Get discovered online, showcase your classes and programs, and turn customer searches into inquiries and sales.",
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
  },
];

export function isBusinessCategory(value: string): value is BusinessCategory {
  return BUSINESS_CATEGORIES.some((c) => c.id === value);
}

export function getBusinessCategoryMeta(
  category: BusinessCategory,
): BusinessCategoryMeta {
  const meta = BUSINESS_CATEGORIES.find((c) => c.id === category);
  if (!meta) {
    // Should be impossible when category is typed correctly.
    throw new Error(`Unknown business category: ${category}`);
  }
  return meta;
}

export function businessCategoryHref(category: BusinessCategory) {
  return `/business/${category}`;
}

// Growth System Content Types and Data
interface Screenshot {
  image: StaticImageData;
  footnote?: string;
}

export type IconName = "search" | "target" | "globe" | "message-circle";

interface Feature {
  title: string;
  icon: IconName;
  headline: string;
  description: string;
  features: string[];
  screenshots?: Screenshot[];
  nextFeature?: string;
}

interface Customer {
  company: string;
  title: string;
  quote: string;
  caseStudyLink: string;
  logo: string;
  category?: string;
}

interface FAQ {
  question: string;
  answer: ReactNode;
}

export interface GrowthSystemContent {
  metadata: {
    title: string;
    description: string;
  };
  overview: {
    productName: string;
    businessType: string;
    title: string;
    description: ReactNode;
  };
  customers: {
    title: string;
    customers: Customer[];
  };
  features: {
    title: string;
    features: Record<string, Feature>;
  };
  pricing: {
    title: string;
  };
  answers: {
    title: string;
    subtitle: string;
    faqs: FAQ[];
  };
  cta: {
    title: string;
    description: string;
    message: string;
  };
  tracking: {
    content_name: string;
    content_type: string;
    content_ids: string[];
    value: number;
    currency: string;
    predicted_ltv: number;
    audience: string;
  };
}

const SHARED_CUSTOMERS: Customer[] = [
  {
    company: "Modern Academy",
    title: "Verified private school partner",
    quote: "Sovoli increased our sales-qualified enrollment leads by 300%.",
    caseStudyLink: "https://www.ma.edu.gy",
    logo: "https://res.cloudinary.com/dipyku9mn/image/upload/v1765638251/o/magy/logo/logo.webp",
    category: "K-12 School",
  },
  {
    company: "FitRight Academy",
    title: "Fashion & sewing academy launch",
    quote: "Sovoli launched our school and filled our first two paid programs.",
    caseStudyLink: "https://www.fitright.gy",
    logo: "https://res.cloudinary.com/dipyku9mn/image/upload/v1765638250/o/fitright/logo/logo.webp",
    category: "Vocational School",
  },
];

// Placeholder content - will be expanded
const k12EducationContent: GrowthSystemContent = {
  metadata: {
    title: "Growth System for K-12 Schools – Sovoli",
    description:
      "A complete digital visibility and lead system built for private schools. Turn parent searches into enrollment conversations automatically.",
  },
  overview: {
    productName: "Growth System",
    businessType: "Private School",
    title: "Grow Your Private School With Digital Marketing Systems",
    description: (
      <>
        Sovoli is the only data-driven growth system built specifically for
        private schools in <strong>Guyana</strong> and <strong>Jamaica</strong>.
      </>
    ),
  },
  customers: {
    title: "Private Schools Already Growing With Sovoli",
    customers: SHARED_CUSTOMERS,
  },
  features: {
    title: "Features",
    features: {
      discovery: {
        title: "Discovery",
        icon: "search",
        headline: "Parents are searching.",
        description:
          "A parent opens their phone and types 'private school near me' or 'best primary school.' Your school appears at the top.",
        features: [
          "Show up when parents search online",
          "Appear on Google and Bing maps",
          "Be listed in trusted business directories",
        ],
        screenshots: [
          {
            image: bingResultImage,
            footnote: "We rank on the first pages of Google and Bing.",
          },
          {
            image: googleResultImage,
            footnote:
              "Fully fleshed out Maps listing to show up for more parents.",
          },
          {
            image: sovoliDirectoryImage,
            footnote:
              "Rank up in our directory with over 500+ monthly visitors.",
          },
        ],
        nextFeature: "ads",
      },
      ads: {
        title: "Ads",
        icon: "target",
        headline: "Intelligent Advertising",
        description:
          "A parent nearby is scrolling through Facebook when they see your ad. We put even more potential parents in front of your school.",
        features: [
          "We run and manage Facebook + Instagram ads for you.",
          "Target the right parents in your local area automatically",
          "Ad performance reports (how much did you spend? how many leads did you get? how many enrollments?)",
        ],
        nextFeature: "diagnostics",
      },
      diagnostics: {
        title: "Website",
        icon: "globe",
        headline: "Professional Website Built for Mobile",
        description:
          "Majority of parents are using mobile devices to search for schools, so we build a website that works perfectly on mobile.",
        features: [
          "Programs page to showcase your offerings",
          "Comprehensive program details page",
          "School Calendar to showcase your events and activities",
          "AI Chatbot to answer parent questions",
          "Enrollment and inquiry flows",
        ],
        nextFeature: "leadCapture",
      },
      leadCapture: {
        title: "WhatsApp",
        icon: "message-circle",
        headline: "Convert Visitors Into Conversations",
        description:
          "Caribbean parents prefer to communicate via WhatsApp. So we send high quality leads to your WhatsApp number.",
        features: ["One-click WhatsApp chat", "Follow-up reminders"],
      },
    },
  },
  pricing: {
    title: "Pricing",
  },
  answers: {
    title: "Frequently Asked Questions",
    subtitle:
      "Everything you need to know about the Growth System and how it can help your school grow.",
    faqs: [
      {
        question: "Can I test the system before committing to the full setup?",
        answer: (
          <>
            Yes. We can set up your website with a single program and run ads
            for that program so you can see how the lead-generation system works
            in real time.
            <br />
            <br />
            You only pay for the ad management and advertising budget during
            this test. When you're ready, we can expand the full system with all
            programs and features.
          </>
        ),
      },
      {
        question: "Do I own my website, domain, and content?",
        answer: (
          <>
            Yes. You fully own your domain and everything you publish—text,
            images, programs, services, and branding.
            <br />
            <br />
            Sovoli provides the platform that powers the site, but your content
            and domain always remain yours and can be moved to another developer
            or platform at any time.
          </>
        ),
      },
      {
        question: "What happens if I don't renew?",
        answer: (
          <>
            Your website does not disappear. Your Sovoli subdomain and all of
            your content remain online, and your directory listings stay active.
            <br />
            <br />
            The only thing that goes offline is your custom domain (e.g.,
            yourschool.com) and the Growth System engine—ads, funnels,
            analytics, and the automated customer-generation features.
            <br />
            <br />
            Your content is always yours and can be exported or rebuilt anywhere
            you choose.
          </>
        ),
      },
      {
        question: "How long does setup take?",
        answer: (
          <>
            Setup is iterative. Once you send the content for your first
            program, we can publish an initial version and start generating
            value within <strong>5 hours</strong>.
            <br />
            <br />
            We continue improving the site as we receive more content—updating
            pages, testing messaging, refining layouts, and adjusting the funnel
            until everything performs well.
            <br />
            <br />
            To see real results quickly, we recommend pairing the setup with an
            initial <strong>$50 ad-spend</strong> so you can watch the system
            bring in leads immediately.
            <br />
            <br />A fully polished setup typically completes within{" "}
            <strong>5–7 days</strong>, but you begin seeing meaningful activity
            almost right away.
          </>
        ),
      },
    ],
  },
  cta: {
    title: "Ready to Grow Your Private School?",
    description:
      "Get started today and start converting parent searches into enrollment conversations.",
    message:
      "I would like more information on your growth system for private schools",
  },
  tracking: {
    content_name: "Growth System - K-12 Education",
    content_type: "product",
    content_ids: ["growth-system"],
    value: 80000,
    currency: "GYD",
    predicted_ltv: 1200000,
    audience: "business-owner",
  },
};

// Create similar content for other categories - using k12 as template for now
const beautyWellnessContent: GrowthSystemContent = {
  ...k12EducationContent,
  metadata: {
    title: "Growth System for Beauty & Wellness – Sovoli",
    description:
      "A complete digital visibility and lead system built for beauty and wellness businesses. Turn customer searches into bookings automatically.",
  },
  overview: {
    ...k12EducationContent.overview,
    businessType: "Beauty & Wellness Business",
    title:
      "Grow Your Beauty & Wellness Business With Digital Marketing Systems",
    description: (
      <>
        Sovoli is the only data-driven growth system built specifically for
        beauty and wellness businesses in <strong>Guyana</strong> and{" "}
        <strong>Jamaica</strong>.
      </>
    ),
  },
  customers: {
    title: "Beauty & Wellness Businesses Already Growing With Sovoli",
    customers: SHARED_CUSTOMERS,
  },
  tracking: {
    content_name: "Growth System - Beauty & Wellness",
    content_type: "product",
    content_ids: ["growth-system", "beauty-wellness"],
    value: 80000,
    currency: "GYD",
    predicted_ltv: 1200000,
    audience: "business-owner",
  },
};

const fashionSewingContent: GrowthSystemContent = {
  ...k12EducationContent,
  metadata: {
    title: "Growth System for Fashion & Sewing – Sovoli",
    description:
      "A complete digital visibility and lead system built for fashion and sewing businesses. Turn customer searches into sales conversations automatically.",
  },
  overview: {
    ...k12EducationContent.overview,
    businessType: "Fashion & Sewing Business",
    title: "Grow Your Fashion & Sewing Business With Digital Marketing Systems",
    description: (
      <>
        Sovoli is the only data-driven growth system built specifically for
        fashion and sewing businesses in <strong>Guyana</strong> and{" "}
        <strong>Jamaica</strong>.
      </>
    ),
  },
  customers: {
    title: "Fashion & Sewing Businesses Already Growing With Sovoli",
    customers: SHARED_CUSTOMERS,
  },
  tracking: {
    content_name: "Growth System - Fashion & Sewing",
    content_type: "product",
    content_ids: ["growth-system", "fashion-sewing"],
    value: 80000,
    currency: "GYD",
    predicted_ltv: 1200000,
    audience: "business-owner",
  },
};

const farmContent: GrowthSystemContent = {
  ...k12EducationContent,
  metadata: {
    title: "Growth System for Agriculture – Sovoli",
    description:
      "A complete digital visibility and lead system built for agriculture businesses. Turn customer searches into sales conversations automatically.",
  },
  overview: {
    ...k12EducationContent.overview,
    businessType: "Agriculture Business",
    title: "Grow Your Agriculture Business With Digital Marketing Systems",
    description: (
      <>
        Sovoli is the only data-driven growth system built specifically for
        agriculture businesses in <strong>Guyana</strong> and{" "}
        <strong>Jamaica</strong>.
      </>
    ),
  },
  customers: {
    title: "Agriculture Businesses Already Growing With Sovoli",
    customers: SHARED_CUSTOMERS,
  },
  tracking: {
    content_name: "Growth System - Agriculture",
    content_type: "product",
    content_ids: ["growth-system", "agriculture"],
    value: 80000,
    currency: "GYD",
    predicted_ltv: 1200000,
    audience: "business-owner",
  },
};

const fitnessSportsContent: GrowthSystemContent = {
  ...k12EducationContent,
  metadata: {
    title: "Growth System for Fitness & Sports – Sovoli",
    description:
      "A complete digital visibility and lead system built for fitness and sports businesses. Turn customer searches into bookings automatically.",
  },
  overview: {
    ...k12EducationContent.overview,
    businessType: "Fitness & Sports Business",
    title: "Grow Your Fitness & Sports Business With Digital Marketing Systems",
    description: (
      <>
        Sovoli is the only data-driven growth system built specifically for
        fitness and sports businesses in <strong>Guyana</strong> and{" "}
        <strong>Jamaica</strong>.
      </>
    ),
  },
  customers: {
    title: "Fitness & Sports Businesses Already Growing With Sovoli",
    customers: SHARED_CUSTOMERS,
  },
  tracking: {
    content_name: "Growth System - Fitness & Sports",
    content_type: "product",
    content_ids: ["growth-system", "fitness-sports"],
    value: 80000,
    currency: "GYD",
    predicted_ltv: 1200000,
    audience: "business-owner",
  },
};

const creativeArtsContent: GrowthSystemContent = {
  ...k12EducationContent,
  metadata: {
    title: "Growth System for Creative Arts – Sovoli",
    description:
      "A complete digital visibility and lead system built for creative arts businesses. Turn customer searches into sales conversations automatically.",
  },
  overview: {
    ...k12EducationContent.overview,
    businessType: "Creative Arts Business",
    title: "Grow Your Creative Arts Business With Digital Marketing Systems",
    description: (
      <>
        Sovoli is the only data-driven growth system built specifically for
        creative arts businesses in <strong>Guyana</strong> and{" "}
        <strong>Jamaica</strong>.
      </>
    ),
  },
  customers: {
    title: "Creative Arts Businesses Already Growing With Sovoli",
    customers: SHARED_CUSTOMERS,
  },
  tracking: {
    content_name: "Growth System - Creative Arts",
    content_type: "product",
    content_ids: ["growth-system", "creative-arts"],
    value: 80000,
    currency: "GYD",
    predicted_ltv: 1200000,
    audience: "business-owner",
  },
};

export const contentByCategory: Record<BusinessCategory, GrowthSystemContent> =
  {
    "private-schools": k12EducationContent,
    "beauty-schools": beautyWellnessContent,
    "fashion-schools": fashionSewingContent,
    farms: farmContent,
    "personal-trainers": fitnessSportsContent,
    "music-schools": creativeArtsContent,
  };

export function getContent(category: BusinessCategory): GrowthSystemContent {
  return contentByCategory[category];
}
