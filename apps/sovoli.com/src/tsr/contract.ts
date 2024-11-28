import { initContract } from "@ts-rest/core";

import { knowledgeContract } from "./router/knowledge/knowledgeContract";

const c = initContract();

export const contract = c.router({
  knowledge: knowledgeContract,
});
