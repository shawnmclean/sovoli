import { env } from "~/env";

export const ORG_USERNAME = "jabneh-christian-academy";
export const ORG_DOMAIN =
  env.NODE_ENV === "development"
    ? "jabneh-christian-academy.localhost:3000"
    : "jabneh-christian-academy.sovoli.com";
