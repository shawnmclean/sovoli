import { env } from "~/env";
import { getBaseUrl } from "./getBaseUrl";

export const config = {
  title: "Sovoli: Guyana’s #1 Private School Directory",
  siteName: "Sovoli",
  description:
    "Sovoli helps parents in Guyana discover, compare, and apply to private schools — all in one place. Each school has a verified profile, digital readiness score, and clear application options. We’re starting in Guyana with plans to expand soon.",
  url: getBaseUrl(),
  contact: {
    whatsapp: "+5926082743",
    email: "info@sovoli.com",
  },
  images: [
    {
      url: "/images/og.webp",
      width: 1200,
      height: 630,
      alt: "Sovoli: Guyana’s #1 Private School Directory",
    },
  ],
  rootDomain: env.NODE_ENV === "development" ? "localhost:3000" : "sovoli.com",
  /**
   * Company information for invoicing and billing.
   * This is the entity that issues invoices and collects payments.
   */
  company: {
    name: "Carbon Technologies LLC",
    address: {
      line1: "78 Spring Way",
      city: "Kingston 10",
      state: "St. Andrew",
      country: "Jamaica",
    },
    email: "hi@sovoli.com",
  },
};
