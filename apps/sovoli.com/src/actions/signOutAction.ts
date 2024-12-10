"use server";

import { signOut } from "@sovoli/auth";

export async function signOutAction() {
  await signOut();
}
