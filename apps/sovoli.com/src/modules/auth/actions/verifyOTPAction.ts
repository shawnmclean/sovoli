"use server";

import type { FieldErrors } from "@rvf/core";
import { parseFormData } from "@rvf/core";
import { whatsAppOTPVerifyFormSchema } from "./schemas";
import { createHmac } from "crypto";
import { env } from "~/env";

export type VerifyState = {
  status: "error" | "success";
  message: string;
  errors?: FieldErrors;
} | null;

// Use validated environment variable
const HMAC_SECRET = env.AUTH_SECRET;

// Type for the OTP token payload
interface OTPTokenPayload {
  phone: string;
  otp: string;
  timestamp: number;
  nonce: string;
}

export async function verifyOTPAction(
  _prevState: VerifyState,
  formData: FormData,
): Promise<VerifyState> {
  const result = await parseFormData(formData, whatsAppOTPVerifyFormSchema);

  if (result.error) {
    return {
      status: "error",
      message: "Validation failed",
      errors: result.error.fieldErrors,
    };
  }

  const { otp, phone } = result.data;
  const otpToken = formData.get("otpToken") as string;

  if (!otpToken) {
    return {
      status: "error",
      message: "Invalid verification request. Please try again.",
    };
  }

  try {
    // Verify the HMAC token
    const [payloadB64, signature] = otpToken.split(".");

    if (!payloadB64 || !signature) {
      return {
        status: "error",
        message: "Invalid token format.",
      };
    }

    // Verify signature
    const payload = Buffer.from(payloadB64, "base64").toString("utf-8");
    const expectedSignature = createHmac("sha256", HMAC_SECRET)
      .update(payload)
      .digest("hex");

    if (signature !== expectedSignature) {
      return {
        status: "error",
        message: "Invalid token signature.",
      };
    }

    // Parse payload
    const tokenData = JSON.parse(payload) as OTPTokenPayload;

    // Check if token is expired (5 minutes)
    const now = Date.now();
    const tokenAge = now - tokenData.timestamp;
    const fiveMinutes = 5 * 60 * 1000;

    if (tokenAge > fiveMinutes) {
      return {
        status: "error",
        message: "Verification code has expired. Please request a new one.",
      };
    }

    // Verify OTP and phone match
    if (tokenData.otp !== otp || tokenData.phone !== phone) {
      return {
        status: "error",
        message: "Invalid verification code.",
      };
    }

    console.log("OTP verification successful:", { phone, otp });

    return {
      status: "success",
      message: "Phone number verified successfully!",
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      status: "error",
      message: "Failed to verify code. Please try again.",
    };
  }
}
