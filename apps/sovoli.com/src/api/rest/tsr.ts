import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { contract } from "@sovoli/api/rest";
import { getBaseUrl } from "~/utils/getBaseUrl";

export const tsr = initTsrReactQuery(contract, {
  baseUrl: getBaseUrl() + "/api/v1",
  baseHeaders: {},
});
