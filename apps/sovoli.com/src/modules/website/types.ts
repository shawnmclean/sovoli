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
