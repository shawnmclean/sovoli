import type { InitClientArgs } from "@ts-rest/core";
import { auth } from "@sovoli/auth";
import { isServer } from "@tanstack/react-query";
import { initClient, tsRestFetchApi } from "@ts-rest/core";
import { initTsrReactQuery } from "@ts-rest/react-query/v5";

import { contract } from "~/tsr/contract";
import { getBaseUrl } from "~/utils/getBaseUrl";

const clientOptions = {
  baseUrl: getBaseUrl() + "/api/v1",
  baseHeaders: {
    "x-app-source": "ts-rest",
  },
  throwOnUnknownStatus: true,
  api: async (args) => {
    // dynamically adding the auth header here if this is firing from the server
    // auth() will only fire on the server and since the request from server - server does not pass
    // cookies, we will fall back to the session token
    // We are going this route because TS-REST does not support Server-Side calls
    // See: https://github.com/ts-rest/ts-rest/issues/436
    let authHeader = {};
    if (isServer) {
      const session = await auth();
      if (session) {
        authHeader = {
          Authorization: `Bearer ${session.sessionToken}`,
        };
      }
    }
    return tsRestFetchApi({
      ...args,
      headers: {
        ...args.headers,
        ...authHeader,
      },
    });
  },
} satisfies InitClientArgs;

export const tsrReactQuery = initTsrReactQuery(contract, clientOptions);

export const api = initClient(contract, clientOptions);
