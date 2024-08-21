import { z } from "zod";

import { MyBooksResponseSchema, ShelfResponseSchema } from "../../../schema";

export const GetUserMyBooksProfileResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  myBooks: MyBooksResponseSchema,
  shelves: ShelfResponseSchema.array(),
});
