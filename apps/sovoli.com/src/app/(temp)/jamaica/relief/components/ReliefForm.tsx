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
import { Input, Textarea } from "@sovoli/ui/components/input";
import {
  CustomRadio,
  CustomRadioInline,
  RadioGroup,
} from "@sovoli/ui/components/radio";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { Stepper } from "@sovoli/ui/components/stepper";

interface ReliefFormData {
  packageIntent: "general" | "specific" | "";
  dropOffLocation: "Black River" | "Savanna-la-Mar" | "";
  contributionType: "financial" | "supplies" | "";
  financialAmount: string;
  suppliesDescription: string;
  donorName: string;
  donorPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientLocation: string;
  recipientNotes: string;
}

const initialFormData: ReliefFormData = {
  packageIntent: "",
  dropOffLocation: "",
  contributionType: "",
  financialAmount: "",
  suppliesDescription: "",
  donorName: "",
  donorPhone: "",
  recipientName: "",
  recipientPhone: "",
  recipientLocation: "",
  recipientNotes: "",
};

const dropOffLocations: ReliefFormData["dropOffLocation"][] = [
  "Black River",
  "Savanna-la-Mar",
];

const STEPS = {
  INTENT: "intent",
  LOCATION: "location",
  CONTRIBUTION: "contribution",
  CONTACT: "contact",
  RECIPIENT: "recipient",
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
    const baseSteps: StepDefinition[] = [
      { key: STEPS.INTENT, label: "Care Package" },
      { key: STEPS.LOCATION, label: "Delivery" },
      { key: STEPS.CONTRIBUTION, label: "Contribution" },
      { key: STEPS.CONTACT, label: "Your Details" },
    ];

    if (formData.packageIntent === "specific") {
      baseSteps.push({ key: STEPS.RECIPIENT, label: "Recipient" });
    }

    baseSteps.push({ key: STEPS.CONFIRM, label: "Confirmation" });

    return baseSteps;
  }, [formData.packageIntent]);

  useEffect(() => {
    if (currentStep > stepSequence.length - 1) {
      setCurrentStep(stepSequence.length - 1);
    }
  }, [currentStep, stepSequence]);

  const currentStepKey = stepSequence[currentStep]?.key ?? STEPS.INTENT;

  const isStepComplete = (stepKey: StepKey) => {
    switch (stepKey) {
      case STEPS.INTENT:
        return formData.packageIntent !== "";
      case STEPS.LOCATION:
        return formData.dropOffLocation !== "";
      case STEPS.CONTRIBUTION:
        if (formData.contributionType === "financial") {
          const amount = Number(formData.financialAmount);
          return !Number.isNaN(amount) && amount > 0;
        }
        if (formData.contributionType === "supplies") {
          return formData.suppliesDescription.trim().length > 0;
        }
        return false;
      case STEPS.CONTACT:
        return (
          formData.donorName.trim().length > 0 &&
          formData.donorPhone.trim().length > 0
        );
      case STEPS.RECIPIENT:
        if (formData.packageIntent !== "specific") {
          return true;
        }
        return (
          formData.recipientName.trim().length > 0 &&
          formData.recipientPhone.trim().length > 0
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

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    switch (currentStepKey) {
      case STEPS.INTENT:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">
                Who would you like to send help to?
              </h2>
              <p className="mt-2 text-base text-default-500">
                Let us know if this is a general care package for anyone in need
                or if you have a specific person in mind.
              </p>
            </div>
            <RadioGroup
              value={formData.packageIntent}
              onValueChange={(value) =>
                updateFormData(
                  "packageIntent",
                  value as ReliefFormData["packageIntent"],
                )
              }
              classNames={{
                wrapper: "grid gap-4 md:grid-cols-2",
              }}
            >
              <CustomRadio
                value="general"
                description="We'll match your care package with community members most in need."
              >
                I'm sending a general care package
              </CustomRadio>
              <CustomRadio
                value="specific"
                description="Provide the details of the person you would like us to reach out to."
              >
                I have someone specific in mind
              </CustomRadio>
            </RadioGroup>
          </div>
        );
      case STEPS.LOCATION:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">
                Where would you like to send help?
              </h2>
              <p className="mt-2 text-base text-default-500">
                Choose the relief hub where our team should deliver your
                support.
              </p>
            </div>
            <Select
              label="Delivery location"
              labelPlacement="outside"
              placeholder="Select a location"
              selectedKeys={
                formData.dropOffLocation ? [formData.dropOffLocation] : []
              }
              onSelectionChange={(keys) => {
                const [first] = Array.from(keys);
                if (typeof first === "string") {
                  updateFormData(
                    "dropOffLocation",
                    first as ReliefFormData["dropOffLocation"],
                  );
                } else {
                  updateFormData("dropOffLocation", "");
                }
              }}
              classNames={{
                label: "text-sm font-medium text-default-600",
              }}
            >
              {dropOffLocations.map((location) => (
                <SelectItem key={location}>{location}</SelectItem>
              ))}
            </Select>
          </div>
        );
      case STEPS.CONTRIBUTION:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">
                What would you like to send?
              </h2>
              <p className="mt-2 text-base text-default-500">
                Let us know if you're contributing supplies or a financial
                donation so we can coordinate with the relief team.
              </p>
            </div>
            <RadioGroup
              orientation="horizontal"
              label="Contribution type"
              value={formData.contributionType}
              onValueChange={(value) =>
                updateFormData(
                  "contributionType",
                  value as ReliefFormData["contributionType"],
                )
              }
              classNames={{
                base: "space-y-3",
                label: "text-sm font-medium text-default-600",
                wrapper: "flex flex-col gap-3 md:flex-row",
              }}
            >
              <CustomRadioInline value="supplies">Supplies</CustomRadioInline>
              <CustomRadioInline value="financial">
                Financial support
              </CustomRadioInline>
            </RadioGroup>
            {formData.contributionType === "supplies" && (
              <Textarea
                label="Supplies details"
                labelPlacement="outside"
                placeholder="List the items you plan to include (e.g. canned goods, toiletries, bedding)."
                value={formData.suppliesDescription}
                onValueChange={(value) =>
                  updateFormData("suppliesDescription", value)
                }
                classNames={{
                  label: "text-sm font-medium text-default-600",
                  inputWrapper:
                    "rounded-2xl border border-default-200 bg-default-50/60 shadow-sm",
                  input: "text-base leading-relaxed",
                }}
              />
            )}
            {formData.contributionType === "financial" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-default-600">
                  Amount (JMD)
                </label>
                <Input
                  type="number"
                  min={0}
                  placeholder="Enter the amount you wish to contribute"
                  value={formData.financialAmount}
                  onValueChange={(value) =>
                    updateFormData("financialAmount", value)
                  }
                />
              </div>
            )}
          </div>
        );
      case STEPS.CONTACT:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">How can we reach you?</h2>
              <p className="mt-2 text-base text-default-500">
                We'll confirm your submission and share the exact delivery
                details for your care package.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Full name"
                placeholder="Enter your name"
                value={formData.donorName}
                onValueChange={(value) => updateFormData("donorName", value)}
              />
              <Input
                label="Contact number"
                type="tel"
                placeholder="e.g. 876-555-0123"
                value={formData.donorPhone}
                onValueChange={(value) => updateFormData("donorPhone", value)}
              />
            </div>
          </div>
        );
      case STEPS.RECIPIENT:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">
                Tell us about the recipient
              </h2>
              <p className="mt-2 text-base text-default-500">
                Share the details for the person you would like us to support so
                we can reach out directly.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Recipient name"
                placeholder="Enter their name"
                value={formData.recipientName}
                onValueChange={(value) =>
                  updateFormData("recipientName", value)
                }
              />
              <Input
                label="Recipient contact number"
                type="tel"
                placeholder="e.g. 876-555-0987"
                value={formData.recipientPhone}
                onValueChange={(value) =>
                  updateFormData("recipientPhone", value)
                }
              />
            </div>
            <Input
              label="Where in Jamaica are they located?"
              placeholder="Community or parish"
              value={formData.recipientLocation}
              onValueChange={(value) =>
                updateFormData("recipientLocation", value)
              }
            />
            <Textarea
              label="Any additional notes?"
              labelPlacement="outside"
              placeholder="Share any special needs or context that would help our team."
              value={formData.recipientNotes}
              onValueChange={(value) => updateFormData("recipientNotes", value)}
              classNames={{
                label: "text-sm font-medium text-default-600",
                inputWrapper:
                  "rounded-2xl border border-default-200 bg-default-50/60 shadow-sm",
                input: "text-base leading-relaxed",
              }}
            />
          </div>
        );
      case STEPS.CONFIRM:
        return (
          <div className="space-y-8 text-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold">
                Thank you for standing with Jamaica
              </h2>
              <p className="text-base text-default-500">
                Our relief team will reach out shortly with guidance on when and
                where we'll deliver your care package. We truly appreciate your
                support during this recovery effort.
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
                  <dt className="font-medium text-default-600">Care package</dt>
                  <dd className="text-default-800">
                    {formData.packageIntent === "specific"
                      ? "For a specific person"
                      : "For anyone in need"}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <dt className="font-medium text-default-600">
                    Delivery location
                  </dt>
                  <dd className="text-default-800">
                    {formData.dropOffLocation}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <dt className="font-medium text-default-600">Contribution</dt>
                  <dd className="text-default-800">
                    {formData.contributionType === "financial"
                      ? `Financial support of JMD ${Number(
                          formData.financialAmount,
                        ).toLocaleString()}`
                      : formData.suppliesDescription}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <dt className="font-medium text-default-600">Your details</dt>
                  <dd className="text-default-800">
                    {formData.donorName}
                    <br />
                    {formData.donorPhone}
                  </dd>
                </div>
                {formData.packageIntent === "specific" && (
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <dt className="font-medium text-default-600">
                      Recipient details
                    </dt>
                    <dd className="text-default-800">
                      {formData.recipientName}
                      <br />
                      {formData.recipientPhone}
                      {formData.recipientLocation && (
                        <>
                          <br />
                          {formData.recipientLocation}
                        </>
                      )}
                      {formData.recipientNotes && (
                        <>
                          <br />
                          <span className="text-default-500">
                            {formData.recipientNotes}
                          </span>
                        </>
                      )}
                    </dd>
                  </div>
                )}
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
      default:
        return null;
    }
  };

  return (
    <Card className="mx-auto w-full max-w-3xl rounded-3xl border border-default-200 bg-background/80 shadow-large backdrop-blur">
      <CardHeader className="flex flex-col gap-4 p-4 sm:p-8">
        <Stepper
          className="px-0"
          steps={stepSequence.map((step, index) => ({
            label: step.label,
            completed: index < currentStep,
          }))}
          currentStep={currentStep}
          onStepClick={(index) => {
            if (index < currentStep) {
              setCurrentStep(index);
            }
          }}
        />
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
