"use server";

import { signIn } from "~/core/auth";

export async function signInAction() {
  await signIn();
}
