import { z } from "zod";

/**
 * For usage with the form action and form
 */
export const formSigninSchema = z.object({
  email: z.string().email(),
});
export type FormSigninSchema = z.infer<typeof formSigninSchema>;
