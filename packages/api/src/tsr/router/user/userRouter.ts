import { tsr } from "@ts-rest/serverless/fetch";

import type { PlatformContext, TSRAuthContext } from "../../types";
import { authMiddleware } from "../authMiddleware";
import { userContract } from "./userContract";

export const userRouter = tsr
  .platformContext<PlatformContext>()
  .routerBuilder(userContract)
  .routeWithMiddleware("me", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async (_, { request: { user } }) => {
        return Promise.resolve({
          status: 200,
          body: {
            name: user.name ?? "Anonymous",
          },
        });
      }),
  )
  .routeWithMiddleware("ping", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async ({ query: { message } }, { request: { user } }) => {
        return Promise.resolve({
          status: 200,
          body: {
            message: `${user.name} says ${message ?? "Hello"}`,
          },
        });
      }),
  );
