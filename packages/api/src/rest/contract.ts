import { initContract } from "@ts-rest/core";
import { userContract } from "./router/user/userContract";

const c = initContract();

export const contract = c.router(
  { ...userContract },
  {
    commonResponses: {
      404: c.type<{ message: "Not Found"; reason: string }>(),
    },
  }
);
