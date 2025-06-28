import { env } from "../env";

export const getBaseUrl = () => {
  // 1. Running in browser – use actual origin (handles subdomains like tenant.sovoli.com)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // 2. Server-side
  // Prefers a custom-defined root domain for production
  if (env.NEXT_PUBLIC_ROOT_DOMAIN) {
    return `https://${env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  }

  // 3. Fallback for Vercel deployments – use VERCEL_URL (no protocol) to build the URL
  if (env.VERCEL_URL) {
    const url = env.VERCEL_URL;
    const hasProtocol = url.startsWith("http");
    return hasProtocol ? url : `https://${url}`;
  }

  // 4. Local development fallback
  return `http://localhost:${env.PORT ?? 3000}`;
};
