import type { InitClientArgs } from "@ts-rest/core";
import { contract } from "@sovoli/api/tsr/contract";
import { initClient } from "@ts-rest/core";
import { initTsrReactQuery } from "@ts-rest/react-query/v5";

import { getBaseUrl } from "~/utils/getBaseUrl";

const clientOptions = {
  baseUrl: getBaseUrl() + "/api/v1",
  baseHeaders: {},
  throwOnUnknownStatus: true,
} satisfies InitClientArgs;

export const tsrReactQuery = initTsrReactQuery(contract, clientOptions);

export const api = initClient(contract, clientOptions);
