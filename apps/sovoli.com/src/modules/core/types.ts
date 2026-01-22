export interface Contact {
  type: "email" | "phone" | "whatsapp" | "other";
  label?: string;
  value: string;
  isPublic: boolean;
  primary?: boolean;
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "youtube" | "x" | "website" | "other";
  label?: string;
  url: string;
}

export type CountryCode = "GY";
