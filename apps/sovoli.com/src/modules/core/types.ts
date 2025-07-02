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

export type CountryCode = "GY";

export type CurrencyCode = "GYD" | "USD";
export type AmountByCurrency = Partial<Record<CurrencyCode, number>>;
