"use client";

import { useEffect, useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
export interface NamesFormProps {
  onSuccess?: (firstName: string, lastName: string) => void;
  onError?: (message: string) => void;
  defaultFirstName?: string;
  defaultLastName?: string;
  resetOnSuccess?: boolean;
}

export function NamesForm({
  onSuccess,
  onError,
  defaultFirstName = "",
  defaultLastName = "",
  resetOnSuccess = true,
}: NamesFormProps) {
  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFirstName(defaultFirstName);
  }, [defaultFirstName]);

  useEffect(() => {
    setLastName(defaultLastName);
  }, [defaultLastName]);

  const validateName = (name: string): boolean => {
    const organizationKeywords = [
      "school",
      "college",
      "university",
      "academy",
      "institute",
      "education",
      "high school",
      "elementary",
      "primary",
      "secondary",
      "prep",
      "preparatory",
      "company",
      "corporation",
      "corp",
      "inc",
      "llc",
      "ltd",
      "foundation",
      "organization",
      "association",
      "center",
      "centre",
      "group",
      "services",
      "solutions",
      "consulting",
      "hospital",
      "clinic",
      "medical",
      "church",
      "ministry",
      "department",
      "office",
      "agency",
      "bureau",
      "council",
    ];

    const lowerName = name.toLowerCase();
    return !organizationKeywords.some((keyword) => lowerName.includes(keyword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter both your first name and last name");
      return;
    }

    // Validate that names don't contain organization-related keywords
    if (!validateName(firstName) || !validateName(lastName)) {
      setError(
        "Please enter your personal name, not an organization or company name",
      );
      return;
    }

    // Check if names look like they might be school names (very basic check)
    if (
      firstName.trim().split(" ").length > 2 ||
      lastName.trim().split(" ").length > 2
    ) {
      setError("Please enter your personal first and last name only");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Here you would typically call an API to save the names
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 100));

      onSuccess?.(firstName, lastName);
      if (resetOnSuccess) {
        // Reset form on success
        setFirstName("");
        setLastName("");
      }
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
        <p className="text-base text-gray-600 mb-2">
          Please enter <strong>your personal name</strong>.
        </p>
        <p className="text-sm text-gray-500">
          We need your individual name for your personal profile.
        </p>
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
            label="First name"
            variant="bordered"
            placeholder="Patrice"
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
            placeholder="Gooden"
            label="Last name"
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
