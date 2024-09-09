import { initContract } from "@ts-rest/core";

import { bookContract } from "./router/book/bookContract";
import { furnitureContract } from "./router/furniture/furnitureContract";
// import { meContract } from "./router/me/meContract";
import { myBookContract } from "./router/myBook/myBookContract";
import { shelfContract } from "./router/shelf/shelfContract";
import { userContract } from "./router/user/userContract";
import { usersContract } from "./router/users/usersContract";

const c = initContract();

export const contract = c.router({
  // ...usersContract,
  // ...furnitureContract,
  // ...shelfContract,
  // ...myBookContract,
  // ...bookContract,
  user: userContract,
  // ...meContract,
});
