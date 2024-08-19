import { initContract } from "@ts-rest/core";

import { bookContract } from "./router/book/bookContract";
import { furnitureContract } from "./router/furniture/furnitureContract";
import { shelfContract } from "./router/shelf/shelfContract";
import { userContract } from "./router/user/userContract";

const c = initContract();

export const contract = c.router({
  ...userContract,
  ...furnitureContract,
  ...shelfContract,
  ...myBookContract,
  ...bookContract,
});
