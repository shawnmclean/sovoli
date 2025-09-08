export interface Service {
  name: string;
  description: string;
  image: string;
  url: string;
}

export interface ServiceModule {
  services: Service[];
}
