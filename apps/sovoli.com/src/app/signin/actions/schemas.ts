import { z } from "zod";

/**
 * For usage with the form action and form
 */
export const whatsAppOTPFormSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
});
export type WhatsAppOTPFormSchema = z.infer<typeof whatsAppOTPFormSchema>;
