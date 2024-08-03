import { tsr } from "@ts-rest/serverless/next";
import { contract } from "./contract";
import { userRouter } from "./router/user/userRouter";
import { furnitureRouter } from "./router/furniture/furnitureRouter";
import { shelfRouter } from "./router/shelf/shelfRouter";
import { myBookRouter } from "./router/myBook/myBookRouter";

export const router = tsr.router(contract, {
  ...userRouter,
  ...furnitureRouter,
  ...shelfRouter,
  ...myBookRouter,
});
