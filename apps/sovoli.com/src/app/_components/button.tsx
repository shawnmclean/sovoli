"use client";

import { Button } from "@sovoli/ui/components/button";

export function ButtonComponent() {
  return <Button onClick={() => alert("clicked")} text="Boop" />;
}
