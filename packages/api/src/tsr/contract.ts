import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { bookContract } from "./router/book/bookContract";
import { knowledgeContract } from "./router/knowledge/knowledgeContract";
import { myBookContract } from "./router/myBook/myBookContract";
import { userContract } from "./router/user/userContract";
import { usersContract } from "./router/users/usersContract";

const c = initContract();

export const contract = c.router({
  users: usersContract,
  myBook: myBookContract,
  book: bookContract,
  user: userContract,
  knowledge: knowledgeContract,
});
