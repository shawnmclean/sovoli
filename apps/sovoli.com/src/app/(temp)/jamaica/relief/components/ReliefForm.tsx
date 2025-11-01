"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Divider } from "@sovoli/ui/components/divider";
import { CustomRadio, RadioGroup } from "@sovoli/ui/components/radio";
import { Confirmation } from "./Confirmation";
import { ContactInfo } from "./ContactInfo";
import { FinancialContribution } from "./FinancialContribution";
import { Hero } from "./Hero";
import { LabourContribution } from "./LabourContribution";
import { SuppliesItemSelection } from "./SuppliesItemSelection";
import { SuppliesQuantityManagement } from "./SuppliesQuantityManagement";
import { Input } from "@sovoli/ui/components/input";
import { submitReliefForm } from "../actions";

export interface ReliefFormData {
  contributionType: "labour" | "supplies" | "financial" | "";
  labourAvailability: "now" | "end-of-nov" | "other" | "";
  labourAvailabilityOther: string;
  suppliesItems: Record<string, number>; // itemId -> quantity
  suppliesItemNotes: Record<string, string>; // itemId -> notes
  suppliesOther: string;
  financialAmount: string;
  financialCurrency: "USD" | "JMD";
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
  financialCurrency: "USD",
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
  SUPPLIES_SELECTION: "supplies_selection",
  SUPPLIES_QUANTITIES: "supplies_quantities",
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
  const [isPending, startTransition] = useTransition();

  const stepSequence: StepDefinition[] = useMemo(() => {
    const steps: StepDefinition[] = [
      { key: STEPS.CONTRIBUTION, label: "Contribution" },
    ];

    if (formData.contributionType) {
      if (formData.contributionType === "supplies") {
        steps.push(
          { key: STEPS.SUPPLIES_SELECTION, label: "Select Items" },
          { key: STEPS.SUPPLIES_QUANTITIES, label: "Set Quantities" },
        );
      } else {
        steps.push({
          key: STEPS.CONTRIBUTION_DETAILS,
          label:
            formData.contributionType === "labour" ? "Availability" : "Amount",
        });
      }
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

  // Auto-navigate when contribution type is selected
  useEffect(() => {
    if (formData.contributionType && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [formData.contributionType, currentStep, stepSequence.length]);

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
        if (formData.contributionType === "financial") {
          const amount = Number(formData.financialAmount);
          return !Number.isNaN(amount) && amount > 0;
        }
        return false;
      case STEPS.SUPPLIES_SELECTION: {
        const selectedItemIds = Object.keys(formData.suppliesItems).filter(
          (key) =>
            formData.suppliesItems[key] && formData.suppliesItems[key] > 0,
        );
        return (
          selectedItemIds.length > 0 || formData.suppliesOther.trim().length > 0
        );
      }
      case STEPS.SUPPLIES_QUANTITIES: {
        const hasSelectedItems = Object.keys(formData.suppliesItems).length > 0;
        return hasSelectedItems || formData.suppliesOther.trim().length > 0;
      }
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

    // If we're on the contact step, submit the form via server action
    if (currentStepKey === STEPS.CONTACT) {
      startTransition(async () => {
        await submitReliefForm(formData);
        setCurrentStep((prev) => Math.min(prev + 1, stepSequence.length - 1));
      });
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, stepSequence.length - 1));
    }
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
        if (formData.contributionType === "financial") return "Amount";
        return "";
      case STEPS.SUPPLIES_SELECTION:
        return "Select Items";
      case STEPS.SUPPLIES_QUANTITIES:
        return "Set Quantities";
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
        if (formData.contributionType === "financial") {
          return (
            <FinancialContribution
              amount={formData.financialAmount}
              currency={formData.financialCurrency}
              onAmountChange={(value) =>
                updateFormData("financialAmount", value)
              }
              onCurrencyChange={(value: "USD" | "JMD") =>
                updateFormData("financialCurrency", value)
              }
            />
          );
        }
        return null;
      case STEPS.SUPPLIES_SELECTION: {
        const selectedItemIds = new Set(
          Object.keys(formData.suppliesItems).filter(
            (key) =>
              formData.suppliesItems[key] && formData.suppliesItems[key] > 0,
          ),
        );

        const handleSelectionChange = (selectedIds: Set<string>) => {
          // Initialize all selected items with quantity 1
          const newItems = { ...formData.suppliesItems };

          // Add newly selected items
          selectedIds.forEach((id) => {
            if (!newItems[id] || newItems[id] === 0) {
              newItems[id] = 1;
            }
          });

          // Remove unselected items
          Object.keys(newItems).forEach((id) => {
            if (!selectedIds.has(id)) {
              delete newItems[id];
              // Also remove notes for unselected items
              if (formData.suppliesItemNotes[id]) {
                const newNotes = { ...formData.suppliesItemNotes };
                delete newNotes[id];
                setFormData((prev) => ({
                  ...prev,
                  suppliesItems: newItems,
                  suppliesItemNotes: newNotes,
                }));
                return;
              }
            }
          });

          setFormData((prev) => ({
            ...prev,
            suppliesItems: newItems,
          }));
        };

        return (
          <div className="space-y-6">
            <SuppliesItemSelection
              selectedItemIds={selectedItemIds}
              onSelectionChange={handleSelectionChange}
            />
            <div>
              <Input
                size="lg"
                label="Other"
                placeholder="Specify other items not listed above"
                value={formData.suppliesOther}
                onValueChange={(value: string) =>
                  updateFormData("suppliesOther", value)
                }
              />
            </div>
          </div>
        );
      }
      case STEPS.SUPPLIES_QUANTITIES: {
        const selectedItemIds = new Set(
          Object.keys(formData.suppliesItems).filter(
            (key) =>
              formData.suppliesItems[key] && formData.suppliesItems[key] > 0,
          ),
        );

        const handleItemRemove = (itemId: string) => {
          const newItems = { ...formData.suppliesItems };
          delete newItems[itemId];

          const newNotes = { ...formData.suppliesItemNotes };
          delete newNotes[itemId];

          setFormData((prev) => ({
            ...prev,
            suppliesItems: newItems,
            suppliesItemNotes: newNotes,
          }));
        };

        return (
          <SuppliesQuantityManagement
            selectedItemIds={selectedItemIds}
            suppliesItems={formData.suppliesItems}
            suppliesItemNotes={formData.suppliesItemNotes}
            onItemQuantityChange={updateSuppliesItemQuantity}
            onItemRemove={handleItemRemove}
            onItemNoteChange={updateSuppliesItemNote}
          />
        );
      }
      case STEPS.CONTACT:
        return (
          <ContactInfo
            name={formData.name}
            phone={formData.phone}
            addressLine1={formData.addressLine1}
            addressLine2={formData.addressLine2}
            city={formData.city}
            stateCountry={formData.stateCountry}
            onNameChange={(value) => updateFormData("name", value)}
            onPhoneChange={(value) => updateFormData("phone", value)}
            onAddressLine1Change={(value) =>
              updateFormData("addressLine1", value)
            }
            onAddressLine2Change={(value) =>
              updateFormData("addressLine2", value)
            }
            onCityChange={(value) => updateFormData("city", value)}
            onStateCountryChange={(value) =>
              updateFormData("stateCountry", value)
            }
          />
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
                isDisabled={!canProceed || isPending}
                isLoading={isPending}
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
