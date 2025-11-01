"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Divider } from "@sovoli/ui/components/divider";
import { Input } from "@sovoli/ui/components/input";
import { CustomRadio, RadioGroup } from "@sovoli/ui/components/radio";
import { Confirmation } from "./Confirmation";
import { FinancialContribution } from "./FinancialContribution";
import { Hero } from "./Hero";
import { LabourContribution } from "./LabourContribution";
import { SuppliesContribution } from "./SuppliesContribution";

export interface ReliefFormData {
  contributionType: "labour" | "supplies" | "financial" | "";
  labourAvailability: "now" | "end-of-nov" | "other" | "";
  labourAvailabilityOther: string;
  suppliesItems: Record<string, number>; // itemId -> quantity
  suppliesItemNotes: Record<string, string>; // itemId -> notes
  suppliesOther: string;
  financialAmount: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateCountry: string;
}

const initialFormData: ReliefFormData = {
  contributionType: "",
  labourAvailability: "",
  labourAvailabilityOther: "",
  suppliesItems: {},
  suppliesItemNotes: {},
  suppliesOther: "",
  financialAmount: "",
  name: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  stateCountry: "",
};

const STEPS = {
  CONTRIBUTION: "contribution",
  CONTRIBUTION_DETAILS: "contribution_details",
  CONTACT: "contact",
  CONFIRM: "confirm",
} as const;

type StepKey = (typeof STEPS)[keyof typeof STEPS];

interface StepDefinition {
  key: StepKey;
  label: string;
}

export function ReliefForm() {
  const [formData, setFormData] = useState<ReliefFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);

  const stepSequence: StepDefinition[] = useMemo(() => {
    const steps: StepDefinition[] = [
      { key: STEPS.CONTRIBUTION, label: "Contribution" },
    ];

    if (formData.contributionType) {
      steps.push({
        key: STEPS.CONTRIBUTION_DETAILS,
        label:
          formData.contributionType === "labour"
            ? "Availability"
            : formData.contributionType === "supplies"
              ? "Supplies"
              : "Amount",
      });
    }

    steps.push(
      { key: STEPS.CONTACT, label: "Your Details" },
      { key: STEPS.CONFIRM, label: "Confirmation" },
    );

    return steps;
  }, [formData.contributionType]);

  useEffect(() => {
    if (currentStep > stepSequence.length - 1) {
      setCurrentStep(stepSequence.length - 1);
    }
  }, [currentStep, stepSequence]);

  const currentStepKey = stepSequence[currentStep]?.key ?? STEPS.CONTRIBUTION;

  const isStepComplete = (stepKey: StepKey) => {
    switch (stepKey) {
      case STEPS.CONTRIBUTION:
        return formData.contributionType !== "";
      case STEPS.CONTRIBUTION_DETAILS:
        if (formData.contributionType === "labour") {
          if (formData.labourAvailability === "other") {
            return formData.labourAvailabilityOther.trim().length > 0;
          }
          return formData.labourAvailability !== "";
        }
        if (formData.contributionType === "supplies") {
          const hasSelectedItems =
            Object.keys(formData.suppliesItems).length > 0;
          return hasSelectedItems || formData.suppliesOther.trim().length > 0;
        }
        if (formData.contributionType === "financial") {
          const amount = Number(formData.financialAmount);
          return !Number.isNaN(amount) && amount > 0;
        }
        return false;
      case STEPS.CONTACT:
        return (
          formData.name.trim().length > 0 &&
          formData.phone.trim().length > 0 &&
          formData.addressLine1.trim().length > 0 &&
          formData.city.trim().length > 0 &&
          formData.stateCountry.trim().length > 0
        );
      case STEPS.CONFIRM:
        return true;
      default:
        return false;
    }
  };

  const canProceed = isStepComplete(currentStepKey);

  const goToNextStep = () => {
    if (!canProceed) return;
    setCurrentStep((prev) => Math.min(prev + 1, stepSequence.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const updateFormData = <K extends keyof ReliefFormData>(
    key: K,
    value: ReliefFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateSuppliesItemQuantity = (itemId: string, quantity: number) => {
    setFormData((prev) => {
      const newItems = { ...prev.suppliesItems };
      if (quantity > 0) {
        newItems[itemId] = quantity;
      } else {
        delete newItems[itemId];
        // Also remove the note when quantity is 0
        const newNotes = { ...prev.suppliesItemNotes };
        delete newNotes[itemId];
        return {
          ...prev,
          suppliesItems: newItems,
          suppliesItemNotes: newNotes,
        };
      }
      return {
        ...prev,
        suppliesItems: newItems,
      };
    });
  };

  const updateSuppliesItemNote = (itemId: string, note: string) => {
    setFormData((prev) => {
      const newNotes = { ...prev.suppliesItemNotes };
      if (note.trim()) {
        newNotes[itemId] = note;
      } else {
        delete newNotes[itemId];
      }
      return {
        ...prev,
        suppliesItemNotes: newNotes,
      };
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
  };

  const getStepTitle = () => {
    switch (currentStepKey) {
      case STEPS.CONTRIBUTION:
        return "What are you contributing?";
      case STEPS.CONTRIBUTION_DETAILS:
        if (formData.contributionType === "labour") return "Availability";
        if (formData.contributionType === "supplies") return "Select supplies";
        if (formData.contributionType === "financial") return "Amount";
        return "";
      case STEPS.CONTACT:
        return "Your Details";
      case STEPS.CONFIRM:
        return "Thank you for standing with Jamaica";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (currentStepKey) {
      case STEPS.CONTRIBUTION:
        return (
          <div className="space-y-6">
            <RadioGroup
              value={formData.contributionType}
              onValueChange={(value) =>
                updateFormData(
                  "contributionType",
                  value as ReliefFormData["contributionType"],
                )
              }
              classNames={{
                wrapper: "grid gap-4 md:grid-cols-3",
              }}
            >
              <CustomRadio value="supplies">Supplies</CustomRadio>
              <CustomRadio value="labour">Labour</CustomRadio>
              <CustomRadio value="financial">Financial</CustomRadio>
            </RadioGroup>
          </div>
        );
      case STEPS.CONTRIBUTION_DETAILS:
        if (formData.contributionType === "labour") {
          return (
            <LabourContribution
              availability={formData.labourAvailability}
              availabilityOther={formData.labourAvailabilityOther}
              onAvailabilityChange={(value) =>
                updateFormData("labourAvailability", value)
              }
              onAvailabilityOtherChange={(value) =>
                updateFormData("labourAvailabilityOther", value)
              }
            />
          );
        }
        if (formData.contributionType === "supplies") {
          return (
            <SuppliesContribution
              suppliesItems={formData.suppliesItems}
              suppliesOther={formData.suppliesOther}
              suppliesItemNotes={formData.suppliesItemNotes}
              onItemQuantityChange={updateSuppliesItemQuantity}
              onOtherChange={(value) => updateFormData("suppliesOther", value)}
              onItemNoteChange={updateSuppliesItemNote}
            />
          );
        }
        if (formData.contributionType === "financial") {
          return (
            <FinancialContribution
              amount={formData.financialAmount}
              onAmountChange={(value) =>
                updateFormData("financialAmount", value)
              }
            />
          );
        }
        return null;
      case STEPS.CONTACT:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-base text-default-500">
                We'll use this information to coordinate your contribution.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                size="lg"
                label="Full name"
                placeholder="Enter your name"
                value={formData.name}
                onValueChange={(value) => updateFormData("name", value)}
              />
              <Input
                size="lg"
                label="Contact number"
                type="tel"
                placeholder="e.g. 876-555-0123"
                value={formData.phone}
                onValueChange={(value) => updateFormData("phone", value)}
              />
            </div>
            <div className="space-y-4">
              <Input
                size="lg"
                label="Address Line 1"
                placeholder="Street address"
                value={formData.addressLine1}
                onValueChange={(value) => updateFormData("addressLine1", value)}
              />
              <Input
                size="lg"
                label="Address Line 2"
                placeholder="Apartment, suite, etc. (optional)"
                value={formData.addressLine2}
                onValueChange={(value) => updateFormData("addressLine2", value)}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  size="lg"
                  label="City"
                  placeholder="City"
                  value={formData.city}
                  onValueChange={(value) => updateFormData("city", value)}
                />
                <Input
                  size="lg"
                  label="State/Country"
                  placeholder="State or Country"
                  value={formData.stateCountry}
                  onValueChange={(value) =>
                    updateFormData("stateCountry", value)
                  }
                />
              </div>
            </div>
          </div>
        );
      case STEPS.CONFIRM:
        return (
          <Confirmation
            formData={formData}
            onResetForm={resetForm}
            onReviewAnswers={() => setCurrentStep(0)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-12 pb-24">
      {currentStep === 0 && <Hero />}
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-center">{getStepTitle()}</h1>
        <Divider />
        <div className="space-y-8">{renderStepContent()}</div>
      </div>
      {currentStepKey !== STEPS.CONFIRM && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-default-200 p-4 z-10">
          <div className="max-w-7xl mx-auto flex flex-row gap-3 items-center justify-between">
            <span className="text-sm font-medium text-default-600">
              Step {currentStep + 1} of {stepSequence.length}
            </span>
            <div className="flex flex-row gap-3">
              <Button
                variant="flat"
                color="default"
                onPress={goToPreviousStep}
                isDisabled={currentStep === 0}
              >
                Back
              </Button>
              <Button
                color="primary"
                onPress={goToNextStep}
                isDisabled={!canProceed}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
