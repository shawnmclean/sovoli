import {
  AppRoute,
  ServerInferRequest,
  ServerInferResponses,
} from "@ts-rest/core";
import { tsr, TsRestRequest, TsRestResponse } from "@ts-rest/serverless/next";

import { identityContract } from "./identityContract";

export interface GlobalRequestContext {
  session: Session | null;
}

interface Session {
  user?: {
    id: string;
  };
}

type RequestWithContext = TsRestRequest & GlobalRequestContext;

export type AppRouteImplementation<T extends AppRoute, TPlatformArgs> = (
  args: ServerInferRequest<T>,
  context: TPlatformArgs & {
    appRoute: T;
    request: RequestWithContext;
    responseHeaders: Headers;
  },
) => Promise<ServerInferResponses<T>>;
interface ProtectedRouteOptions<T extends AppRoute> {
  handler: AppRouteImplementation<T, unknown>;
}

const protectedRoute = <T extends AppRoute>(
  contractEndpoint: T,
  route: ProtectedRouteOptions<T>,
) => {
  return tsr.routeWithMiddleware(contractEndpoint)<
    GlobalRequestContext,
    unknown
  >({
    middleware: [
      (request) => {
        if (!request.session?.user) {
          return TsRestResponse.fromJson({
            status: 401,
            body: {
              message: "Unauthorized",
            },
          });
        }
      },
    ],
    handler: route.handler,
  });
};

export const identityRouter = tsr.router(identityContract, {
  profile: protectedRoute(identityContract.profile, {
    handler: async (props, { request }) => {
      return Promise.resolve({
        status: 200,
        body: {
          message: "hello " + request.session?.user?.id,
        },
      });
    },
  }),
  //   profile: tsr.routeWithMiddleware(identityContract.profile)<
  //     GlobalRequestContext,
  //     unknown
  //   >({
  //     middleware: [
  //       (request) => {
  //         if (!request.session?.user) {
  //           return TsRestResponse.fromJson({
  //             status: 401,
  //             body: {
  //               message: "Unauthorized",
  //             },
  //           });
  //         }
  //       },
  //     ],
  //     handler: async (props, { request }) => {
  //       return Promise.resolve({
  //         status: 200,
  //         body: {
  //           message: "hello " + request.session?.user?.id,
  //         },
  //       });
  //     },
  //   }),
});
