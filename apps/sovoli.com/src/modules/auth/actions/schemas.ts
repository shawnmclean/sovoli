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
    .length(6, "Please enter all 6 digits of your verification code"),
  otpToken: z.string().min(1, "OTP token is required"),
  phone: phoneSchema,
});
export type WhatsAppOTPVerifyFormSchema = z.infer<
  typeof whatsAppOTPVerifyFormSchema
>;
