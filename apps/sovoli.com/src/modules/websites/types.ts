export interface WebsiteModule {
  website: Website;
}

// Navigation item for header
export interface NavItem {
  key:
    | "home"
    | "about"
    | "academics"
    | "offerings"
    | "workforce"
    | "contact"
    | "gallery";
  label: string;
}

// Navigation action (CTA) for header
export interface NavAction {
  key: "apply" | "contact" | "schedule";
  label: string;
}

// Footer link
export interface FooterLink {
  label: string;
  url: string;
}

// Footer section
export interface FooterSection {
  key: "social" | "academics" | "offerings" | "contact" | "other";
  title?: string;
  description?: string;
  links?: FooterLink[];
}

export interface Website {
  siteName: string;
  title: string;
  description: string;
  url: string; // Preferred canonical URL
  domain: string;
  images: {
    url: string;
    width: number;
    height: number;
    alt: string;
  }[];
  header?: {
    layout: "default" | "minimal";
    variant: "default" | "transparent";
    nav: NavItem[];
    actions?: NavAction[];
  };
  footer?: {
    layout: "default" | "minimal";
    variant: "default" | "transparent";
    sections: FooterSection[];
  };
}

// -------

// Shared building block
export interface ContentValue {
  name: string;
  icon?: string;
  body?: string;
}

// Static content store for an org
export interface OrgContent {
  mission: ContentValue;
  vision: ContentValue;
  values: ContentValue[];
}

// Structural metadata for an org
export interface OrgMeta {
  name: string;
  description: string;
  slug: string;
  customDomains?: string[];
  country: string;
  city: string;
  address: string;
  contacts: { email: string; phone: string }[];
  url: string;
  title: string;
  images: { url: string; width: number; height: number; alt: string }[];
}

// Section-level configuration for a rendered page
export interface PageSection {
  type: "hero" | "metrics" | "cards" | "list" | "collection"; // content presentation type
  layout?: string; // "condensed", "default"
  variant?: string; // "image"
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  contentRefs?: string[]; // static content keys (e.g., mission, vision)
  collectionKey?: string; // for dynamic sources (e.g., "programs", "team")
  actions?: { label: string; href: string }[]; // CTA buttons for hero or cards
  metrics?: {
    title: string;
    value: string;
    icon?: string;
    description?: string;
  }[]; // for metrics layout
}

// Represents a full page configuration for one public-facing page
export interface PageConfig {
  title?: string;
  subtitle?: string;
  sections: PageSection[];
}

// Org-specific web configuration
export interface OrgWebConfig {
  home: PageConfig;
  about: PageConfig;

  [key: string]: PageConfig | undefined;
}
