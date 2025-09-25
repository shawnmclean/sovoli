"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
export interface NamesFormProps {
  onSuccess?: (firstName: string, lastName: string) => void;
  onError?: (message: string) => void;
}

export function NamesForm({ onSuccess, onError }: NamesFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter both first name and last name");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Here you would typically call an API to save the names
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 100));

      onSuccess?.(firstName, lastName);
      // Reset form on success
      setFirstName("");
      setLastName("");
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title and Subtitle */}
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">What's your name?</h1>
        <p className="text-base">Enter your personal first and last name.</p>
      </div>

      {/* Input Fields */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            autoFocus
            type="text"
            size="lg"
            variant="bordered"
            placeholder="First name"
            isRequired
            isDisabled={isSubmitting}
          />
        </div>
        <div className="flex-1">
          <Input
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            type="text"
            size="lg"
            variant="bordered"
            placeholder="Last name"
            isRequired
            isDisabled={isSubmitting}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Next Button */}
      <Button
        type="submit"
        variant="solid"
        color="primary"
        radius="lg"
        fullWidth
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base"
      >
        {isSubmitting ? "Saving..." : "Next"}
      </Button>
    </form>
  );
}
