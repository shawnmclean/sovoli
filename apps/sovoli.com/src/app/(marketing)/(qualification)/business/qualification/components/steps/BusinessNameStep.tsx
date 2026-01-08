"use client";

import { Input } from "@sovoli/ui/components/input";
import { Button } from "@sovoli/ui/components/button";

export interface BusinessNameStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  error?: string | null;
}

export function BusinessNameStep({
  value,
  onChange,
  onNext,
  error,
}: BusinessNameStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().length >= 2) {
      onNext();
    }
  };

  const isValid = value.trim().length >= 2;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">What's the name of your business?</h1>
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
      />

      {error && (
        <div className="p-3 rounded-lg bg-danger/10 text-danger border border-danger/20">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="solid"
        color="primary"
        radius="lg"
        fullWidth
        size="lg"
        isDisabled={!isValid}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base"
      >
        Next
      </Button>
    </form>
  );
}
