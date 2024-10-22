import { initContract } from "@ts-rest/core";

import { bookContract } from "./router/book/bookContract";
import { knowledgeContract } from "./router/knowledge/knowledgeContract";
import { userContract } from "./router/user/userContract";
import { usersContract } from "./router/users/usersContract";

const c = initContract();

export const contract = c.router({
  users: usersContract,
  book: bookContract,
  user: userContract,
  knowledge: knowledgeContract,
});
