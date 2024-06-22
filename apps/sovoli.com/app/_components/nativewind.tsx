"use client";

import { Button, Text } from "@sovoli/ui";

export function ButtonComponent() {
  return (
    <div>
      <span>
        RN: <Button onClick={() => alert("clicked")} text="Boop" />
      </span>
      <span>
        NW: <Text>NW Text</Text>
      </span>
    </div>
  );
}
