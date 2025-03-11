"use server";

import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/require-await
export async function invalidateCacheAction(formData: FormData) {
  const username = formData.get("username") as string;
  if (!username) return;

  revalidatePath(`/isr/${username}`);
}
