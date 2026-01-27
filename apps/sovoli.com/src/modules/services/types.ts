import type { Media } from "../core/media/types";

export interface Service {
  name: string;
  description: string;
  category?: string;
  media?: Media[];
  url: string;
  price?: string;
  slug?: string;
  whatWeDo?: string;
  commonServices?: string[];
  whoThisIsFor?: string[];
  actionText?: string;
}

export interface ServiceModule {
  services: Service[];
}
