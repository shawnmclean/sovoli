import { initContract } from "@ts-rest/core";

import { bookContract } from "./router/book/bookContract";
import { furnitureContract } from "./router/furniture/furnitureContract";
import { identityContract } from "./router/identity/identityContract";
import { myBookContract } from "./router/myBook/myBookContract";
import { shelfContract } from "./router/shelf/shelfContract";
import { userContract } from "./router/user/userContract";

const c = initContract();

export const contract = c.router({
  ...userContract,
  ...furnitureContract,
  ...shelfContract,
  ...myBookContract,
  ...bookContract,
  ...identityContract,
});
