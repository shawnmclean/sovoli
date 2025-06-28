import { env } from "../env";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  // this is pointing to ma.edu.gy, which is set in vercel. Multi tenancy domains is overriding our env.
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://www.sovoli.com`;
  return `https://localhost:${env.PORT ?? 3000}`;
};
