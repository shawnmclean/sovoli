import { initQueryClient } from "@ts-rest/react-query";
import { contract } from "@sovoli/api/rest";

export const edgeApi = initQueryClient(contract, {
  baseUrl: "http://localhost:4200/api/edge",
  baseHeaders: {},
});
