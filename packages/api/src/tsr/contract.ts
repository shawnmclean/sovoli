import { initContract } from "@ts-rest/core";

import { bookContract } from "./router/book/bookContract";
import { knowledgeContract } from "./router/knowledge/knowledgeContract";
import { userContract } from "./router/user/userContract";

const c = initContract();

export const contract = c.router({
  book: bookContract,
  user: userContract,
  knowledge: knowledgeContract,
});
