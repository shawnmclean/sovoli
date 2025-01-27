"use server";

import { signOut } from "~/core/auth";

export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}
