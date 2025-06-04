export interface Offering {
  name: string;
  description: string;
  image: string;
  url: string;
}

export interface OfferingModule {
  offerings: Offering[];
}
