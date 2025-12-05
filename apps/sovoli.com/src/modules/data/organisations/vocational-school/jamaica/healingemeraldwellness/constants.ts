import { env } from "~/env";

export const ORG_USERNAME = "healingemeraldwellness";
export const ORG_DOMAIN =
	env.NODE_ENV === "development"
		? "healingemeraldwellness.localhost:3000"
		: "healingemeraldwellness.sovoli.com";
