import { initContract } from "@ts-rest/core";
import { userContract } from "./router/user/userContract";

const c = initContract();

export const contract = c.router({ ...userContract });
