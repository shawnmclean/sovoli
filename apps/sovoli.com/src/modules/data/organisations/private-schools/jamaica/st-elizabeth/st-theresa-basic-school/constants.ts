import { env } from "~/env";

export const ORG_USERNAME = "st-theresa-basic-school";
export const ORG_DOMAIN =
  env.NODE_ENV === "development"
    ? "st-theresa-basic-school.localhost:3000"
    : "st-theresa-basic-school.sovoli.com";
