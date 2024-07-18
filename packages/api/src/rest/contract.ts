import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string(),
});

export const contract = c.router({
  users: c.router({
    getUser: {
      method: "GET",
      path: `/users/:username`,
      pathParams: z.object({
        username: z.coerce.string(),
      }),
      responses: {
        200: UserSchema.nullable(),
      },
      summary: "Get a user by username",
    },
  }),
});
