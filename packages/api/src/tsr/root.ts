import { tsr } from "@ts-rest/serverless/fetch";

import type { TSRAuthContext, TSRGlobalContext } from "./types";
import { contract } from "./contract";
import { bookRouter } from "./router/book/bookRouter";
import { furnitureRouter } from "./router/furniture/furnitureRouter";
// import { meRouter } from "./router/me/meRouter";
import { myBookRouter } from "./router/myBook/myBookRouter";
import { shelfRouter } from "./router/shelf/shelfRouter";
import { userRouter } from "./router/user/userRouter";
import { usersRouter } from "./router/users/usersRouter";

export const router = tsr
  .routerBuilder<typeof contract>(contract)
  .requestMiddleware<TSRAuthContext>(async (req, ctx) => {
    console.log("middleware req", req);
    console.log("middleware ctx", ctx);
  })
  .subRouter("user", userRouter);
