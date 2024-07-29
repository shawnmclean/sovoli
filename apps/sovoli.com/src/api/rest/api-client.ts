import { initQueryClient } from "@ts-rest/react-query";
import { contract } from "@sovoli/api/rest";
import { getBaseUrl } from "~/utils/getBaseUrl";

export const api = initQueryClient(contract, {
  baseUrl: getBaseUrl() + "/api/v1",
  baseHeaders: {},
});
