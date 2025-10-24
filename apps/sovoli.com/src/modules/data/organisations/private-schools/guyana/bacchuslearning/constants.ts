import { env } from "~/env";

export const ORG_USERNAME = "blcgy";
export const ORG_DOMAIN =
  env.NODE_ENV === "development" ? "blcgy.localhost:3000" : "www.blc.edu.gy";
