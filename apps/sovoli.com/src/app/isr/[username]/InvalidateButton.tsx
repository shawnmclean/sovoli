"use client";

import { useFormStatus } from "react-dom";

export function InvalidateButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
    >
      {pending ? "Refreshing..." : "Invalidate Cache"}
    </button>
  );
}
