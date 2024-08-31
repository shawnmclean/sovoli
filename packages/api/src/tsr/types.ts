import type { Session } from "@sovoli/auth";
import type { TsRestRequest } from "@ts-rest/serverless";

export interface TSRContext {
  session: Session | null;
}

export type ExtendedRequest = TsRestRequest & TSRContext;
