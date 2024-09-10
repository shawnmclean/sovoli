import { TsRestResponse } from "@ts-rest/serverless/fetch";

import type { TSRAuthContext } from "../types";

export const authMiddleware = (req: TSRAuthContext) => {
  if (!req.session) {
    return TsRestResponse.fromJson(
      {
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  req.user = req.session.user;
};
