"use server";

import { revalidateTag } from "next/cache";

// eslint-disable-next-line @typescript-eslint/require-await
export async function invalidateCacheAction(formData: FormData) {
  const username = formData.get("username") as string;
  if (!username) return;

  revalidateTag("posts");
}
