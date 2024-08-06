import { initContract } from "@ts-rest/core";
import { userContract } from "./router/user/userContract";
import { furnitureContract } from "./router/furniture/furnitureContract";
import { shelfContract } from "./router/shelf/shelfContract";
import { myBookContract } from "./router/myBook/myBookContract";

const c = initContract();

export const contract = c.router({
  ...userContract,
  ...furnitureContract,
  ...shelfContract,
  ...myBookContract,
});