"use client";

import { useState, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input, Textarea } from "@sovoli/ui/components/input";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { Checkbox } from "@sovoli/ui/components/checkbox";
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
  const [phoneRaw, setPhoneRaw] = useState<string>("");
  const [phoneCountryCode, setPhoneCountryCode] = useState<
    "US" | "GB" | "GY" | "JM" | undefined
  >(undefined);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState<BusinessCategory | null>(
    initialCategory && isBusinessCategory(initialCategory)
      ? initialCategory
      : null,
  );
  const [marketingMethods, setMarketingMethods] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track initial page view
  useEffect(() => {
    posthog.capture("BusinessSignupStarted", {
      category: category ?? undefined,
    });
  }, [category]);

  const handlePhoneSuccess = (
    phoneNumber: string,
    rawPhone?: string,
    countryIso?: string,
  ) => {
    setPhone(phoneNumber);
    setPhoneRaw(rawPhone ?? "");
    setPhoneCountryCode(
      countryIso === "US" ||
        countryIso === "GB" ||
        countryIso === "GY" ||
        countryIso === "JM"
        ? countryIso
        : undefined,
    );
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
          marketingMethods,
          description: description.trim(),
        });

        if (result.success) {
          posthog.capture("CompleteRegistration", {
            type: "business",
            org_name: businessName,
            // TODO: remove this when we hook up the plan
            currency: "JMD",
            value: "40000",
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
              defaultPhone={phoneRaw || undefined}
              defaultCountryCode={phoneCountryCode}
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
                placeholder="Hillel Academy"
                isRequired
              />
            </div>

            {/* Category Selection */}
            <div>
              <Select
                label="Category"
                selectedKeys={category ? [category] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string | undefined;
                  if (selectedKey && isBusinessCategory(selectedKey)) {
                    setCategory(selectedKey);
                  } else {
                    setCategory(null);
                  }
                }}
                placeholder="Select a category"
                size="lg"
                variant="bordered"
                fullWidth
                isRequired
              >
                {BUSINESS_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} textValue={cat.label}>
                    {cat.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Marketing Methods */}
            <div>
              <div className="block text-sm font-medium text-foreground mb-2">
                How are you marketing?
              </div>
              <div className="flex flex-col">
                <div className="mb-4">
                  <Checkbox
                    isSelected={marketingMethods.includes("Word of Mouth")}
                    onValueChange={(checked) => {
                      if (checked) {
                        setMarketingMethods([
                          ...marketingMethods,
                          "Word of Mouth",
                        ]);
                      } else {
                        setMarketingMethods(
                          marketingMethods.filter((m) => m !== "Word of Mouth"),
                        );
                      }
                    }}
                  >
                    Word of Mouth
                  </Checkbox>
                </div>
                <div className="mb-4">
                  <Checkbox
                    isSelected={marketingMethods.includes("Social Media Posts")}
                    onValueChange={(checked) => {
                      if (checked) {
                        setMarketingMethods([
                          ...marketingMethods,
                          "Social Media Posts",
                        ]);
                      } else {
                        setMarketingMethods(
                          marketingMethods.filter(
                            (m) => m !== "Social Media Posts",
                          ),
                        );
                      }
                    }}
                  >
                    Social Media Posts
                  </Checkbox>
                </div>
                <div className="mb-4">
                  <Checkbox
                    isSelected={marketingMethods.includes("Boosting Ads")}
                    onValueChange={(checked) => {
                      if (checked) {
                        setMarketingMethods([
                          ...marketingMethods,
                          "Boosting Ads",
                        ]);
                      } else {
                        setMarketingMethods(
                          marketingMethods.filter((m) => m !== "Boosting Ads"),
                        );
                      }
                    }}
                  >
                    Boosting Ads
                  </Checkbox>
                </div>
                <div>
                  <Checkbox
                    isSelected={marketingMethods.includes(
                      "No marketing efforts",
                    )}
                    onValueChange={(checked) => {
                      if (checked) {
                        setMarketingMethods([
                          ...marketingMethods,
                          "No marketing efforts",
                        ]);
                      } else {
                        setMarketingMethods(
                          marketingMethods.filter(
                            (m) => m !== "No marketing efforts",
                          ),
                        );
                      }
                    }}
                  >
                    No marketing efforts
                  </Checkbox>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <Textarea
                label="Description"
                placeholder="Tell us more about your programs, classes or workshops"
                value={description}
                onValueChange={setDescription}
                minRows={4}
                size="lg"
                variant="bordered"
              />
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
