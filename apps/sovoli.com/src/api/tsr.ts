import { contract } from "@sovoli/api/tsr";
import { QueryClient } from "@tanstack/react-query";
import { initTsrReactQuery } from "@ts-rest/react-query/v5";

import { getBaseUrl } from "~/utils/getBaseUrl";

// import { getQueryClient } from "./query-client";

const tsr = initTsrReactQuery(contract, {
  baseUrl: getBaseUrl() + "/api/v1",
  baseHeaders: {},
});

// use our own query cient instead of what trpc is doing so we can avoid caching issue.
// TODO: figure out cache/optimization later
const getQueryClient = () => new QueryClient();

export { tsr, getQueryClient };
