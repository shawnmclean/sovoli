import { initContract } from "@ts-rest/core";
import { userContract } from "./router/user/userContract";
import { furnitureContract } from "./router/furniture/furnitureContract";

const c = initContract();

export const contract = c.router({ ...userContract, ...furnitureContract });
