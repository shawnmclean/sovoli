import { tsr } from "@ts-rest/serverless/next";
import { contract } from "./contract";
import { userRouter } from "./router/user/userRouter";

export const router = tsr.router(contract, {
  ...userRouter,
});
