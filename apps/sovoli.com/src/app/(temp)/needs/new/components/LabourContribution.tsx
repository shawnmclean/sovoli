"use client";

import { Input } from "@sovoli/ui/components/input";
import { CustomRadio, RadioGroup } from "@sovoli/ui/components/radio";

interface LabourContributionProps {
  availability: "now" | "end-of-nov" | "other" | "";
  availabilityOther: string;
  onAvailabilityChange: (value: "now" | "end-of-nov" | "other" | "") => void;
  onAvailabilityOtherChange: (value: string) => void;
}

export function LabourContribution({
  availability,
  availabilityOther,
  onAvailabilityChange,
  onAvailabilityOtherChange,
}: LabourContributionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">When are you available?</h2>
      <RadioGroup
        value={availability}
        onValueChange={(value) =>
          onAvailabilityChange(value as "now" | "end-of-nov" | "other" | "")
        }
        classNames={{
          wrapper: "grid gap-4 md:grid-cols-3",
        }}
      >
        <CustomRadio value="now">Now</CustomRadio>
        <CustomRadio value="end-of-nov">End of November</CustomRadio>
        <CustomRadio value="other">Other</CustomRadio>
      </RadioGroup>
      {availability === "other" && (
        <Input
          size="lg"
          label="Please specify"
          placeholder="Enter your availability"
          value={availabilityOther}
          onValueChange={onAvailabilityOtherChange}
        />
      )}
    </div>
  );
}
