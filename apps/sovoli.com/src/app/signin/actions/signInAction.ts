"use server";

import { withZod } from "@rvf/zod";
import { whatsAppOTPFormSchema } from "./schemas";

export type State = {
  status: "error" | "success";
  message: string;
  errors?: Record<string, string>;
} | null;

const validator = withZod(whatsAppOTPFormSchema);

export async function signInAction(
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

  // short circuit for now until we need to auth
  return {
    status: "success",
    message: "WhatsApp message sent successfully!",
  };

  try {
    // Clean the phone number (remove non-digits)
    const cleanNumber = phone.replace(/\D/g, "");

    // Send WhatsApp message using Facebook Graph API
    const response = await fetch(
      "https://graph.facebook.com/v22.0/806683995853838/messages",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: cleanNumber,
          type: "template",
          template: {
            name: "otp_template",
            language: {
              code: "en",
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: "123456",
                  },
                ],
              },
              {
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [
                  {
                    type: "text",
                    text: "123456",
                  },
                ],
              },
            ],
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("WhatsApp API error:", errorData);
      return {
        status: "error",
        message: "Failed to send WhatsApp message. Please try again.",
      };
    }

    return {
      status: "success",
      message: "WhatsApp message sent successfully!",
    };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return {
      status: "error",
      message: "An error occurred while sending the message. Please try again.",
    };
  }
}
