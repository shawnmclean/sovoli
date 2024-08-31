import type { User } from "@sovoli/auth";
import { tsr, TsRestResponse } from "@ts-rest/serverless/fetch";

import type { TSRContext } from "../../types";
import { meContract } from "./meContract";

export const meRouter = tsr.router(meContract, {
  getMe: tsr.routeWithMiddleware(meContract.getMe)<TSRContext, { user: User }>({
    middleware: [
      (request) => {
        if (!request.session) {
          return TsRestResponse.fromJson({
            status: 401,
            body: {
              message: "Unauthorized",
            },
          });
        }
        request.user = request.session.user;
      },
    ],
    handler: (_, { request: { user } }) => {
      console.log(user);
      return {
        status: 200,
        body: {
          email: user.email,
        },
      };
    },
  }),
});
