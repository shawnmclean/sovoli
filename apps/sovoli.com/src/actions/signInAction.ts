"use server";

import { signIn } from "@sovoli/auth";

export async function signInAction() {
  await signIn();
}
