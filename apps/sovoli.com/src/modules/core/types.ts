export interface Contact {
  type: "email" | "phone" | "whatsapp" | "other";
  label?: string;
  value: string;
  isPublic: boolean;
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "youtube" | "x" | "website" | "other";
  label?: string;
  url: string;
}
