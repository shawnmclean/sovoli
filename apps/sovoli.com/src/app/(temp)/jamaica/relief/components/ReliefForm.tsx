"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Input } from "@sovoli/ui/components/input";
import { CustomRadio, RadioGroup } from "@sovoli/ui/components/radio";
import { FinancialContribution } from "./FinancialContribution";
import { LabourContribution } from "./LabourContribution";
import { SuppliesContribution, SUPPLIES_ITEMS } from "./SuppliesContribution";

interface ReliefFormData {
  contributionType: "labour" | "supplies" | "financial" | "";
  labourAvailability: "now" | "end-of-nov" | "other" | "";
  labourAvailabilityOther: string;
  suppliesItems: Record<string, number>; // itemId -> quantity
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
      }
      return {
        ...prev,
        suppliesItems: newItems,
      };
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    switch (currentStepKey) {
      case STEPS.CONTRIBUTION:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
              What are you contributing?
            </h2>
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
              <CustomRadio value="labour">Labour</CustomRadio>
              <CustomRadio value="supplies">Supplies</CustomRadio>
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
              onItemQuantityChange={updateSuppliesItemQuantity}
              onOtherChange={(value) => updateFormData("suppliesOther", value)}
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
              <h2 className="text-2xl font-semibold">Your Details</h2>
              <p className="mt-2 text-base text-default-500">
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
      case STEPS.CONFIRM: {
        const selectedSuppliesItems = Object.entries(
          formData.suppliesItems,
        ).map(([itemId, quantity]) => {
          const item = SUPPLIES_ITEMS.find((i) => i.id === itemId);
          return item ? `${item.name} (${quantity})` : "";
        });

        return (
          <div className="space-y-8 text-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold">
                Thank you for standing with Jamaica
              </h2>
              <p className="text-base text-default-500">
                Our relief team will reach out shortly to coordinate your
                contribution. We truly appreciate your support during this
                recovery effort.
              </p>
            </div>
            <Card className="rounded-2xl border border-default-200 bg-default-50/80 text-left">
              <CardHeader className="flex flex-col items-start gap-2 px-5 py-4 sm:px-6">
                <h3 className="text-lg font-semibold">Submission summary</h3>
                <p className="text-small text-default-500">
                  Review the details you shared with our relief team.
                </p>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-4 px-5 py-4 text-sm sm:px-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <dt className="font-medium text-default-600">
                    Contribution type
                  </dt>
                  <dd className="text-default-800 capitalize">
                    {formData.contributionType}
                  </dd>
                </div>
                {formData.contributionType === "labour" && (
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <dt className="font-medium text-default-600">
                      Availability
                    </dt>
                    <dd className="text-default-800">
                      {formData.labourAvailability === "end-of-nov"
                        ? "End of November"
                        : formData.labourAvailability === "other"
                          ? formData.labourAvailabilityOther
                          : "Now"}
                    </dd>
                  </div>
                )}
                {formData.contributionType === "supplies" && (
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <dt className="font-medium text-default-600">Supplies</dt>
                    <dd className="text-default-800">
                      {selectedSuppliesItems.length > 0 && (
                        <div>
                          {selectedSuppliesItems.map((item, idx) => (
                            <div key={idx}>{item}</div>
                          ))}
                        </div>
                      )}
                      {formData.suppliesOther && (
                        <div>
                          {selectedSuppliesItems.length > 0 && <br />}
                          Other: {formData.suppliesOther}
                        </div>
                      )}
                    </dd>
                  </div>
                )}
                {formData.contributionType === "financial" && (
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <dt className="font-medium text-default-600">Amount</dt>
                    <dd className="text-default-800">
                      JMD {Number(formData.financialAmount).toLocaleString()}
                    </dd>
                  </div>
                )}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <dt className="font-medium text-default-600">Your details</dt>
                  <dd className="text-default-800">
                    {formData.name}
                    <br />
                    {formData.phone}
                    <br />
                    {formData.addressLine1}
                    {formData.addressLine2 && (
                      <>
                        <br />
                        {formData.addressLine2}
                      </>
                    )}
                    <br />
                    {formData.city}, {formData.stateCountry}
                  </dd>
                </div>
              </CardBody>
            </Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onPress={resetForm} variant="flat" color="primary">
                Submit another response
              </Button>
              <Button
                onPress={() => setCurrentStep(0)}
                variant="ghost"
                className="sm:ml-2"
              >
                Review your answers
              </Button>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <Card className="mx-auto w-full max-w-3xl rounded-3xl border border-default-200 bg-background/80 shadow-large backdrop-blur">
      <CardHeader className="flex flex-col gap-4 p-4 sm:p-8">
        <div className="text-center">
          <span className="text-sm font-medium text-default-600">
            Step {currentStep + 1} of {stepSequence.length}
          </span>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-8 p-4 sm:p-8">
        {renderStepContent()}
      </CardBody>
      {currentStepKey !== STEPS.CONFIRM && (
        <>
          <Divider />
          <CardFooter className="flex flex-col-reverse gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <Button
              variant="flat"
              color="default"
              onPress={goToPreviousStep}
              isDisabled={currentStep === 0}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
            <Button
              color="primary"
              onPress={goToNextStep}
              isDisabled={!canProceed}
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
