"use client";

import { Input } from "@sovoli/ui/components/input";

export interface BusinessNameStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext?: () => void; // Optional, kept for backward compatibility but not used (button is sticky now)
  error?: string | null;
}

export function BusinessNameStep({
  value,
  onChange,
  onNext,
  error,
}: BusinessNameStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">
          What's the name of your business?
        </h1>
      </div>

      <Input
        name="businessName"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        autoFocus
        type="text"
        size="lg"
        label="Business Name"
        variant="bordered"
        placeholder="Enter your business name"
        isRequired
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim().length >= 2 && onNext) {
            e.preventDefault();
            onNext();
          }
        }}
      />

      {error && (
        <div className="p-3 rounded-lg bg-danger/10 text-danger border border-danger/20">
          {error}
        </div>
      )}
    </div>
  );
}
