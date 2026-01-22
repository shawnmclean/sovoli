import { env } from "~/env";

export const ORG_USERNAME = "magy";
export const ORG_DOMAIN =
  env.NODE_ENV === "development" ? "magy.localhost:3000" : "www.ma.edu.gy";
