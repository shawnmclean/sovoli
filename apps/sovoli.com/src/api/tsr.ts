import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { contract } from "@sovoli/api/rest";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { cache } from "react";
import { getQueryClient } from "./query-client";

const tsr = initTsrReactQuery(contract, {
  baseUrl: getBaseUrl() + "/api/v1",
  baseHeaders: {},
});

const queryClient = cache(getQueryClient);

export { tsr, queryClient };
