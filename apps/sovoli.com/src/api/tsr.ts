import { cache } from "react";
import { contract } from "@sovoli/api/tsr";
import { initTsrReactQuery } from "@ts-rest/react-query/v5";

import { getBaseUrl } from "~/utils/getBaseUrl";
import { getQueryClient } from "./query-client";

const tsr = initTsrReactQuery(contract, {
  baseUrl: getBaseUrl() + "/api/v1",
  baseHeaders: {},
});

const queryClient = cache(getQueryClient);

export { tsr, queryClient };
