import { env } from "~/env";

export const ORG_USERNAME = "mongolsbuildersdepotjm";
export const ORG_DOMAIN =
  env.NODE_ENV === "development"
    ? "mongolsbuildersdepotjm.localhost:3000"
    : "mongolsbuildersdepotjm.sovoli.com";
