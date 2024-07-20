import { tsr } from "@ts-rest/serverless/next";
import { contract } from "./contract";
import { userRouter } from "./router/user/userRouter";
import type { Context } from "./types";

export const router = tsr.router<typeof contract, Context>(contract, {
  ...userRouter,
});
