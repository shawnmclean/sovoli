import { env } from "~/env";

export const ORG_USERNAME = "fitright";
export const ORG_DOMAIN =
  env.NODE_ENV === "development"
    ? "fitright.localhost:3000"
    : "www.fitright.gy";
