import { contract } from "@sovoli/api/tsr/contract";
import { initTsrReactQuery } from "@ts-rest/react-query/v5";

import { getBaseUrl } from "~/utils/getBaseUrl";

export const tsr = initTsrReactQuery(contract, {
  baseUrl: getBaseUrl() + "/api/v1",
  baseHeaders: {},
});
