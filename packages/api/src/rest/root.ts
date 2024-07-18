import { tsr } from "@ts-rest/serverless/next";
import { contract } from "./contract";
import { usersRouter } from "./router/user";
import type { Context } from "./types";

export const router = tsr.router<typeof contract, Context>(contract, {
  users: usersRouter,
});
