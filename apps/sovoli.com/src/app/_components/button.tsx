"use client";

import { Button } from "@sovoli/ui/components/button";
import { Text } from "@sovoli/ui/components/text";

export function ButtonComponent() {
  return (
    <Button onPress={() => alert("clicked")}>
      <Text>Click me</Text>
    </Button>
  );
}
