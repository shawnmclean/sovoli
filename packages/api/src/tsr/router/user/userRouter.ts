import { TSRAuthContext, TSRGlobalContext } from "@sovoli/api/tsr";
import { count, db, eq, inArray, schema, sql } from "@sovoli/db";
import { SelectUserSchema } from "@sovoli/db/schema";
import { tsr } from "@ts-rest/serverless/fetch";

import { userContract } from "./userContract";

export const userRouter = tsr.routerBuilder(userContract).fullRouter({
  getUser: async (_, req) => {
    console.log("router req", req);
    return {
      status: 200,
      body: {
        name: "John Doe",
      },
    };
  },
});
