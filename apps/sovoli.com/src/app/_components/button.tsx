"use client";

import { Button } from "@sovoli/ui/components/button";

export function ButtonComponent() {
  return (
    <Button
      variant="destructive"
      className="bg-blue-600"
      onPress={() => alert("clicked")}
    >
      Click me
    </Button>
  );
}
