import { env } from "~/env";

export const ORG_USERNAME = "argosybookstoregy";
export const ORG_DOMAIN =
  env.NODE_ENV === "development"
    ? "argosybookstoregy.localhost:3000"
    : "argosybookstoregy.sovoli.com";
