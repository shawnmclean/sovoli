"use server";

import { redirect } from "next/navigation";
import { withZod } from "@rvf/zod";
import { AuthError } from "next-auth";

import { signIn } from "~/core/auth";
import { formSigninSchema } from "./schemas";

export type State = {
  status: "error";
  message: string;
  errors?: Record<string, string>;
} | null;

const validator = withZod(formSigninSchema);

export async function signinAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const result = await validator.validate(formData);

  if (result.error) {
    return {
      status: "error",
      message: "Failed to create note",
      errors: result.error.fieldErrors,
    };
  }

  try {
    return await signIn("resend", {
      redirectTo: result.data.callbackUrl,
      email: result.data.email,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(`/error?error=${error.type}`);
    }
    throw error;
  }
}
