import { tsr } from "@ts-rest/serverless/next";

import { contract } from "./contract";
import { bookRouter } from "./router/book/bookRouter";
import { furnitureRouter } from "./router/furniture/furnitureRouter";
// import { meRouter } from "./router/me/meRouter";
import { myBookRouter } from "./router/myBook/myBookRouter";
import { shelfRouter } from "./router/shelf/shelfRouter";
import { userRouter } from "./router/user/userRouter";

export const router = tsr.router(contract, {
  ...userRouter,
  ...furnitureRouter,
  ...shelfRouter,
  ...myBookRouter,
  ...bookRouter,
  // ...meRouter,
});
