import { TsRestResponse } from "@ts-rest/serverless/fetch";

import type { AuthUser, TSRAuthContext } from "../types";

export const authMiddleware = (req: TSRAuthContext) => {
  if (!req.session?.user?.id) {
    return TsRestResponse.fromJson(
      {
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  req.user = req.session.user as AuthUser;
};
