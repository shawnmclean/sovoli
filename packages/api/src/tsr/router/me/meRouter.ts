import type {
  AppRoute,
  ServerInferRequest,
  ServerInferResponses,
} from "@ts-rest/core";
import type { TsRestRequest } from "@ts-rest/serverless/fetch";
import { tsr, TsRestResponse } from "@ts-rest/serverless/fetch";

import type { TSRAuthContext, TSRGlobalContext } from "../../types";
import { meContract } from "./meContract";

export type AppRouteImplementation<
  T extends AppRoute,
  TPlatformArgs,
  TRequestExtension,
> = (
  args: ServerInferRequest<T>,
  context: TPlatformArgs & {
    appRoute: T;
    request: TsRestRequest & TRequestExtension;
    responseHeaders: Headers;
  },
) => Promise<ServerInferResponses<T>>;

const protectedRoute = <
  TContract extends AppRoute,
  TPlatformContext,
  TRequestGlobalExtension extends TSRGlobalContext = TSRGlobalContext,
  TRequestLocalExtension extends TSRAuthContext = TSRAuthContext,
>(
  contractEndpoint: TContract,
  handler: AppRouteImplementation<
    TContract,
    TPlatformContext,
    TRequestLocalExtension & TRequestGlobalExtension
  >,
) => {
  return tsr.routeWithMiddleware(contractEndpoint)<
    TRequestGlobalExtension,
    TRequestLocalExtension
  >({
    middleware: [
      (req) => {
        if (!req.session) {
          return TsRestResponse.fromJson({
            status: 401,
            body: { message: "Unauthorized" },
          });
        }
        req.user = req.session.user;
      },
    ],
    handler,
  });
};

export const meRouter = tsr.router(meContract, {
  getMe: protectedRoute(
    meContract.getMe,
    async (props, { request: { user } }) => {
      console.log(user);

      return Promise.resolve({
        status: 200,
        body: {
          email: user.email,
        },
      });
    },
  ),
});
