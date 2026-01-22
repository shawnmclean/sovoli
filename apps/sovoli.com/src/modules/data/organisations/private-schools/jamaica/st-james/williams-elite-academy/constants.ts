import { env } from "~/env";

export const ORG_USERNAME = "williams-elite-academy";
export const ORG_DOMAIN =
  env.NODE_ENV === "development"
    ? "williams-elite-academy.localhost:3000"
    : "williams-elite-academy.sovoli.com";
