import { z } from "zod";

/**
 * For usage with the form action and form
 */
export const formSigninSchema = z.object({
  email: z.string().email(),
  callbackUrl: z.string().url().optional(),
});
export type FormSigninSchema = z.infer<typeof formSigninSchema>;
