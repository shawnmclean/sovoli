"use client";

import { Button } from "@sovoli/ui";

export function ButtonComponent() {
  return <Button onClick={() => alert("clicked")} text="Boop" />;
}
