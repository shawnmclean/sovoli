import { z } from "zod";

/**
 * For usage with the form action and form
 */
export const whatsAppOTPFormSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
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
  phone: z.string().min(1, "Phone number is required"),
});
export type WhatsAppOTPVerifyFormSchema = z.infer<
  typeof whatsAppOTPVerifyFormSchema
>;
