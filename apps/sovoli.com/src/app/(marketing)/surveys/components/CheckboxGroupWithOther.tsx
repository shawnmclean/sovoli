"use client";

import React, { useState } from "react";
import { Checkbox, CheckboxGroup } from "@sovoli/ui/components/checkbox";
import { Input } from "@sovoli/ui/components/input";

interface Option {
  label: string;
  value: string;
}

interface CheckboxGroupWithOtherProps {
  name: string;
  label: string;
  options: Option[];
  otherLabel?: string;
  otherName?: string;
}

export function CheckboxGroupWithOther({
  name,
  label,
  options,
  otherLabel = "Please specify other",
  otherName = `${name}Other`,
}: CheckboxGroupWithOtherProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (values: string[]) => {
    setSelected(values);
  };

  return (
    <div className="w-full space-y-6">
      <CheckboxGroup
        name={name}
        label={label}
        value={selected}
        onValueChange={handleChange}
        className="w-full"
      >
        <div className="flex w-full flex-col gap-2">
          {options.map((option) => (
            <Checkbox
              key={option.value}
              value={option.value}
              className="w-full"
            >
              {option.label}
            </Checkbox>
          ))}
          <Checkbox value="other" className="w-full">
            Other
          </Checkbox>
        </div>
      </CheckboxGroup>

      {selected.includes("other") && (
        <Input name={otherName} label={otherLabel} placeholder="Enter other" />
      )}
    </div>
  );
}
