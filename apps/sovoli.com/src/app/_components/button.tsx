"use client";

import { Button } from "@sovoli/ui/components/button";

export function ButtonComponent() {
  return (
    <Button variant="destructive" onPress={() => alert("clicked")}>
      Click me
    </Button>
  );
}
