"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { SendIcon } from "lucide-react";

export interface GuidedInputProps {
  inputType: "text" | "buttons" | "date" | "none";
  options?: string[];
  onSubmit: (value: string) => void;
}

export function GuidedInput({
  inputType,
  options,
  onSubmit,
}: GuidedInputProps) {
  const [value, setValue] = useState("");

  if (inputType === "buttons") {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {options?.map((opt) => (
          <Button
            key={opt}
            size="sm"
            variant="bordered"
            onPress={() => onSubmit(opt)}
          >
            {opt}
          </Button>
        ))}
      </div>
    );
  }

  if (inputType === "text") {
    return (
      <div className="flex gap-2 mt-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type here..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) onSubmit(value);
          }}
        />
        <Button
          isIconOnly
          color="primary"
          onPress={() => onSubmit(value)}
          isDisabled={!value.trim()}
        >
          <SendIcon className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return null;
}
