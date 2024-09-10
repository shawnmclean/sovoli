import { initContract } from "@ts-rest/core";

import { bookContract } from "./router/book/bookContract";
import { furnitureContract } from "./router/furniture/furnitureContract";
import { myBookContract } from "./router/myBook/myBookContract";
import { shelfContract } from "./router/shelf/shelfContract";
import { userContract } from "./router/user/userContract";
import { usersContract } from "./router/users/usersContract";

const c = initContract();

export const contract = c.router({
  users: usersContract,
  furniture: furnitureContract,
  shelf: shelfContract,
  myBook: myBookContract,
  book: bookContract,
  user: userContract,
});
