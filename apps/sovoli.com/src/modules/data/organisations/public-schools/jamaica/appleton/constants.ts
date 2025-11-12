import { env } from "~/env";

export const ORG_USERNAME = "absjm";
export const ORG_DOMAIN =
  env.NODE_ENV === "development" ? "absjm.localhost:3000" : "absjm.sovoli.com";
