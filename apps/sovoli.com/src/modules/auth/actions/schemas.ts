import { z } from "zod";

export const phoneSchema = z.e164({ message: "Invalid phone number" });

/**
 * For usage with the form action and form
 */
export const whatsAppOTPFormSchema = z.object({
  phone: phoneSchema,
});
export type WhatsAppOTPFormSchema = z.infer<typeof whatsAppOTPFormSchema>;

/**
 * For OTP verification form
 */
export const whatsAppOTPVerifyFormSchema = z.object({
  otp: z
    .string()
    .min(4, "OTP must be at least 4 digits")
    .max(6, "OTP must be at most 6 digits"),
  phone: phoneSchema,
});
export type WhatsAppOTPVerifyFormSchema = z.infer<
  typeof whatsAppOTPVerifyFormSchema
>;
