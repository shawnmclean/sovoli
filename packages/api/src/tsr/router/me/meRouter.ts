import { tsr, TsRestResponse } from "@ts-rest/serverless/fetch";

import type { TSRAuthContext, TSRGlobalContext } from "../../types";
import { meContract } from "./meContract";

export const meRouter = tsr.router(meContract, {
  getMe: tsr.routeWithMiddleware(meContract.getMe)<
    TSRGlobalContext,
    TSRAuthContext
  >({
    middleware: [
      (req) => {
        if (!req.session) {
          return TsRestResponse.fromJson({
            status: 401,
            body: {
              message: "Unauthorized",
            },
          });
        }
        req.user = req.session.user;
      },
    ],
    handler: async (_, { request: { user } }) => {
      console.log(user);
      return Promise.resolve({
        status: 200,
        body: {
          email: user.email,
        },
      });
    },
  }),
});
