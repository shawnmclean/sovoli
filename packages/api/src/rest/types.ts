import type { TsRestRequest } from "@ts-rest/serverless";

export interface Context {
  user: string;
}

export type ExtendedRequest = TsRestRequest & Context;
