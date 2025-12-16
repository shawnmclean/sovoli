"use client";

import { useState, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { PhoneNumberStep } from "~/modules/auth/components/PhoneNumberStep/PhoneNumberStep";
import { NamesForm } from "~/modules/auth/components/NamesForm";
import type { BusinessCategory } from "../../../(marketing)/(business)/business/categories";
import {
  BUSINESS_CATEGORIES,
  isBusinessCategory,
} from "../../../(marketing)/(business)/business/categories";
import { submitBusinessLead } from "../actions";
import posthog from "posthog-js";
import { CheckCircle2Icon, ArrowLeftIcon } from "lucide-react";
import { Logo } from "~/components/Logo/Logo";
import Link from "next/link";

export interface BusinessSignupWizardProps {
  initialCategory?: string;
}

type WizardStep = "phone" | "name" | "business-info" | "success";

export function BusinessSignupWizard({
  initialCategory,
}: BusinessSignupWizardProps) {
  const [step, setStep] = useState<WizardStep>("phone");
  const [phone, setPhone] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState<BusinessCategory | null>(
    initialCategory && isBusinessCategory(initialCategory)
      ? initialCategory
      : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track initial page view
  useEffect(() => {
    posthog.capture("BusinessSignupStarted", {
      category: category ?? undefined,
    });
  }, [category]);

  const handlePhoneSuccess = (phoneNumber: string) => {
    setPhone(phoneNumber);
    posthog.capture("BusinessPhoneEntered", {
      $set: {
        phone: phoneNumber,
      },
    });
    setStep("name");
  };

  const handleNameSuccess = (
    contactFirstName: string,
    contactLastName: string,
  ) => {
    setFirstName(contactFirstName);
    setLastName(contactLastName);

    posthog.capture("BusinessContactNameEntered", {
      $set: {
        first_name: contactFirstName,
        last_name: contactLastName,
        name: `${contactFirstName} ${contactLastName}`,
      },
    });

    setStep("business-info");
  };

  const handleBack = () => {
    if (step === "name") {
      setStep("phone");
    } else if (step === "business-info") {
      setStep("name");
    }
  };

  const handleBusinessInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!businessName.trim()) {
      setError("Please enter your business name");
      return;
    }

    if (businessName.trim().length < 2) {
      setError("Business name must be at least 2 characters");
      return;
    }

    if (!category) {
      setError("Please select a business category");
      return;
    }

    // Track business name and category
    posthog.capture("BusinessNameEntered", {
      business_name: businessName.trim(),
      category,
    });

    posthog.capture("BusinessCategorySelected", {
      category,
    });

    // Submit to Airtable
    if (phone && firstName && lastName) {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await submitBusinessLead({
          businessName: businessName.trim(),
          category,
          phone,
          firstName,
          lastName,
        });

        if (result.success) {
          posthog.capture("BusinessLeadSubmitted", {
            business_name: businessName,
            category,
          });
          setStep("success");
        } else {
          setError(result.error ?? "Failed to submit. Please try again.");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again.";
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (step === "phone") {
    // Extract phone number without country code for defaultPhone
    // Phone is stored as full number with country code (e.g., "+5921234567")
    // PhoneNumberForm expects just the number part
    let defaultPhoneNumber: string | undefined;
    let defaultCountryCode: "US" | "GB" | "GY" | "JM" | undefined;

    if (phone) {
      if (phone.startsWith("+1")) {
        defaultCountryCode = "US";
        defaultPhoneNumber = phone.slice(2);
      } else if (phone.startsWith("+44")) {
        defaultCountryCode = "GB";
        defaultPhoneNumber = phone.slice(3);
      } else if (phone.startsWith("+592")) {
        defaultCountryCode = "GY";
        defaultPhoneNumber = phone.slice(4);
      } else if (phone.startsWith("+1876")) {
        defaultCountryCode = "JM";
        defaultPhoneNumber = phone.slice(5);
      } else {
        // Fallback: try to extract just the number part
        defaultPhoneNumber = phone.replace(/^\+/, "");
      }
    }

    return (
      <div className="min-h-screen flex flex-col">
        <div className="absolute top-4 left-4 z-10">
          <Button
            as={Link}
            href="/business"
            variant="light"
            isIconOnly
            radius="full"
            className="bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col px-4 py-8 pt-16">
          <h1 className="mb-8 text-center text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            <span className="block text-foreground">
              Sovoli Business Sign up
            </span>
          </h1>
          <div className="flex flex-col">
            <PhoneNumberStep
              mode="lead"
              onSuccess={handlePhoneSuccess}
              defaultPhone={defaultPhoneNumber}
              defaultCountryCode={defaultCountryCode}
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === "name") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="light"
            isIconOnly
            onPress={handleBack}
            radius="full"
            className="bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col px-4 py-8 pt-16">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Logo />
            <h1 className="text-xl font-bold text-foreground">Sovoli</h1>
          </div>
          <div className="flex flex-col">
            <NamesForm
              onSuccess={handleNameSuccess}
              onError={(message) => setError(message)}
              resetOnSuccess={false}
              defaultFirstName={firstName ?? undefined}
              defaultLastName={lastName ?? undefined}
            />
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-danger-50 text-danger-700 border border-danger-200">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === "business-info") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="light"
            isIconOnly
            onPress={handleBack}
            radius="full"
            className="bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </div>
        <form
          onSubmit={handleBusinessInfoSubmit}
          className="flex flex-col px-4 py-8 pt-16"
        >
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Logo />
            <h1 className="text-xl font-bold text-foreground">Sovoli</h1>
          </div>
          <div className="flex flex-col space-y-6">
            {/* Title */}
            <div className="text-left">
              <h2 className="text-2xl font-bold mb-4 sm:text-3xl">
                About your business
              </h2>
            </div>

            {/* Business Name Input */}
            <div>
              <Input
                name="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                fullWidth
                autoFocus
                type="text"
                size="lg"
                label="Business Name"
                variant="bordered"
                placeholder="Acme School"
                isRequired
              />
            </div>

            {/* Category Selection */}
            <div>
              <div className="block text-sm font-medium text-foreground mb-2">
                Category <span className="text-danger">*</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUSINESS_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      category === cat.id
                        ? "border-primary bg-primary-50 dark:bg-primary-950/30"
                        : "border-default-200 hover:border-primary-300 bg-content1"
                    }`}
                  >
                    <div className="font-semibold text-foreground">
                      {cat.label}
                    </div>
                    <div className="text-sm text-default-500 mt-1">
                      {cat.shortDescription}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg bg-danger-50 text-danger-700 border border-danger-200">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="solid"
              color="primary"
              radius="full"
              fullWidth
              size="lg"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // All other steps return early, so this must be success
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (step === "success") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2Icon className="h-16 w-16 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2 sm:text-3xl">
              Thank you, {firstName}!
            </h2>
            <p className="text-base text-default-600 sm:text-lg">
              We&apos;ll contact you at {phone} within 24 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
