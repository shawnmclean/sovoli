"use server";

import { whatsAppOTPFormSchema } from "./schemas";
import { createHmac, randomBytes } from "crypto";
import { env } from "~/env";
import type { FieldErrors } from "@rvf/core";
import { parseFormData } from "@rvf/core";

export type State = {
  status: "error" | "success";
  message: string;
  errors?: FieldErrors;
  otpToken?: string;
} | null;

// Use validated environment variable
const HMAC_SECRET = env.AUTH_SECRET as string;

export async function sendOTPAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedData = await parseFormData(formData, whatsAppOTPFormSchema);

  if (validatedData.error) {
    return {
      status: "error",
      message: "Validation failed",
      errors: validatedData.error.fieldErrors,
    };
  }
  const { phone } = validatedData.data;

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

  return {
    status: "success",
    message: "WhatsApp message sent successfully!",
    otpToken,
  };
}
