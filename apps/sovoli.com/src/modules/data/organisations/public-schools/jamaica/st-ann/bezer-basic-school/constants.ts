import { env } from "~/env";

export const ORG_USERNAME = "bezer-basic-school";
export const ORG_DOMAIN =
  env.NODE_ENV === "development"
    ? "bezer-basic-school.localhost:3000"
    : "bezer-basic-school.sovoli.com";

