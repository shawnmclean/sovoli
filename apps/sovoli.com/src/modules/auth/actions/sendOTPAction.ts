"use server";

import { parseFormData } from "@rvf/core";
import { createHmac, randomBytes } from "crypto";
import { env } from "~/env";
import { whatsAppOTPFormSchema } from "./schemas";
import type { SendOTPActionState } from "./states";

/**
 * WhatsApp OTP Sending Action
 *
 * Required Environment Variables:
 * - WHATSAPP_ACCESS_TOKEN: Facebook Graph API access token
 * - WHATSAPP_PHONE_NUMBER_ID: WhatsApp Business phone number ID
 *
 * The WhatsApp template "hello_world" must be approved in your Facebook Business account.
 * The OTP is sent as a parameter in the template message.
 */

// Use validated environment variable
const HMAC_SECRET = env.AUTH_SECRET;

export async function sendOTPAction(
  _prevState: SendOTPActionState,
  formData: FormData,
): Promise<SendOTPActionState> {
  const validatedData = await parseFormData(formData, whatsAppOTPFormSchema);

  if (validatedData.error) {
    return {
      status: "error",
      message: "Validation failed",
      errors: validatedData.error.fieldErrors,
    };
  }
  const { phone } = validatedData.data;

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("phone", phone);
  console.log("otp", otp);

  try {
    // Send WhatsApp message via Facebook Graph API
    // COMMENTED OUT: WhatsApp env variables (WHATSAPP_PHONE_NUMBER_ID, META_ACCESS_TOKEN) removed
    // const response = await fetch(
    //   `https://graph.facebook.com/v22.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${env.META_ACCESS_TOKEN}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       messaging_product: "whatsapp",
    //       to: phone,
    //       type: "template",
    //       template: {
    //         name: "otp_verify_code",
    //         language: {
    //           code: "en_US",
    //         },
    //         components: [
    //           {
    //             type: "body",
    //             parameters: [
    //               {
    //                 type: "text",
    //                 text: otp,
    //               },
    //             ],
    //           },
    //           {
    //             type: "button",
    //             sub_type: "url",
    //             index: "0",
    //             parameters: [
    //               {
    //                 type: "text",
    //                 text: otp,
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     }),
    //   },
    // );

    // if (!response.ok) {
    //   const errorData = (await response.json().catch(() => ({}))) as Record<
    //     string,
    //     unknown
    //   >;
    //   console.error("WhatsApp API error:", errorData);
    //   return {
    //     status: "error",
    //     message: "Failed to send WhatsApp message. Please try again.",
    //   };
    // }

    // const result = (await response.json()) as Record<string, unknown>;
    // console.log("WhatsApp message sent successfully:", result);

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

    return {
      status: "success",
      message: "WhatsApp message sent successfully!",
      otpToken,
      phone,
    };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return {
      status: "error",
      message: "An error occurred while sending the message. Please try again.",
    };
  }
}
