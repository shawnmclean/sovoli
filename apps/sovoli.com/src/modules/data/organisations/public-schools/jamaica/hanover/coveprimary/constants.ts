import { env } from "~/env";

export const ORG_USERNAME = "cove-primary";
export const ORG_DOMAIN =
  env.NODE_ENV === "development"
    ? "cove-primary.localhost:3000"
    : "cove-primary.sovoli.com";
