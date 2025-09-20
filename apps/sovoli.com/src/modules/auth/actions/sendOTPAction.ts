"use server";

import { withZod } from "@rvf/zod";
import { whatsAppOTPFormSchema } from "./schemas";
import { createHmac, randomBytes } from "crypto";
import { env } from "~/env";

export type State = {
  status: "error" | "success";
  message: string;
  errors?: Record<string, string>;
  otpToken?: string;
} | null;

const validator = withZod(whatsAppOTPFormSchema);

// Use validated environment variable
const HMAC_SECRET = env.AUTH_SECRET as string;

export async function sendOTPAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const result = await validator.validate(formData);

  if (result.error) {
    return {
      status: "error",
      message: "Validation failed",
      errors: result.error.fieldErrors,
    };
  }

  const { phone } = result.data;

  try {
    // Generate a random OTP (for demo purposes, use a fixed value)
    const otp = "1234"; // In production, generate a random 4-6 digit OTP

    // Create a token with phone and OTP for verification
    const payload = JSON.stringify({
      phone,
      otp,
      timestamp: Date.now(),
      nonce: randomBytes(16).toString("hex"),
    });

    // Create HMAC signature
    const signature = createHmac("sha256", HMAC_SECRET)
      .update(payload)
      .digest("hex");

    const otpToken = Buffer.from(payload).toString("base64") + "." + signature;

    console.log("Sending OTP:", { phone, otp, otpToken });

    // In production, send the actual OTP via WhatsApp API
    // For now, just log it
    console.log(`OTP for ${phone}: ${otp}`);

    return {
      status: "success",
      message: "WhatsApp message sent successfully!",
      otpToken,
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return {
      status: "error",
      message: "Failed to send OTP. Please try again.",
    };
  }
}
