"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Divider } from "@sovoli/ui/components/divider";
import { Confirmation } from "./Confirmation";
import { ContactDetails } from "./ContactDetails";
import { Hero } from "./Hero";
import { LocationInfo } from "./LocationInfo";
import { SchoolInfo } from "./SchoolInfo";
import { SuppliesItemSelection } from "./SuppliesItemSelection";
import { submitReliefForm } from "../actions";
import { Input } from "@sovoli/ui/components/input";

export interface ReliefFormData {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactRole: string;
  schoolName: string;
  schoolType: string;
  locationAddressLine1: string;
  locationAddressLine2: string;
  locationCity: string;
  locationParish: string;
  suppliesSelected: string[];
  suppliesOther: string;
  notes: string;
}

const initialFormData: ReliefFormData = {
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  contactRole: "",
  schoolName: "",
  schoolType: "",
  locationAddressLine1: "",
  locationAddressLine2: "",
  locationCity: "",
  locationParish: "",
  suppliesSelected: [],
  suppliesOther: "",
  notes: "",
};

const STEPS = {
  CONTACT: "contact",
  SCHOOL: "school",
  LOCATION: "location",
  SUPPLIES: "supplies",
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

  const stepSequence: StepDefinition[] = useMemo(
    () => [
      { key: STEPS.CONTACT, label: "Contact" },
      { key: STEPS.SCHOOL, label: "School" },
      { key: STEPS.LOCATION, label: "Location" },
      { key: STEPS.SUPPLIES, label: "Supplies" },
      { key: STEPS.CONFIRM, label: "Confirmation" },
    ],
    [],
  );

  useEffect(() => {
    if (currentStep > stepSequence.length - 1) {
      setCurrentStep(stepSequence.length - 1);
    }
  }, [currentStep, stepSequence]);

  const currentStepKey = stepSequence[currentStep]?.key ?? STEPS.CONTACT;

  const isStepComplete = (stepKey: StepKey) => {
    switch (stepKey) {
      case STEPS.CONTACT:
        return (
          formData.contactName.trim().length > 0 &&
          formData.contactPhone.trim().length > 0
        );
      case STEPS.SCHOOL:
        return formData.schoolName.trim().length > 0;
      case STEPS.LOCATION:
        return (
          formData.locationAddressLine1.trim().length > 0 &&
          formData.locationCity.trim().length > 0 &&
          formData.locationParish.trim().length > 0
        );
      case STEPS.SUPPLIES:
        return (
          formData.suppliesSelected.length > 0 ||
          formData.suppliesOther.trim().length > 0
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

    if (currentStepKey === STEPS.SUPPLIES) {
      startTransition(async () => {
        await submitReliefForm(formData);
        setCurrentStep((prev) => Math.min(prev + 1, stepSequence.length - 1));
      });
      return;
    }

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

  const getStepTitle = () => {
    switch (currentStepKey) {
      case STEPS.CONTACT:
        return "Point of Contact";
      case STEPS.SCHOOL:
        return "School Information";
      case STEPS.LOCATION:
        return "School Location";
      case STEPS.SUPPLIES:
        return "What supplies are needed?";
      case STEPS.CONFIRM:
        return "Thank you for sharing your needs";
      default:
        return "";
    }
  };

  const renderSuppliesStep = () => {
    const selectedItemIds = new Set(formData.suppliesSelected);

    const handleSelectionChange = (selectedIds: Set<string>) => {
      setFormData((prev) => ({
        ...prev,
        suppliesSelected: Array.from(selectedIds),
      }));
    };

    return (
      <div className="space-y-6">
        <SuppliesItemSelection
          selectedItemIds={selectedItemIds}
          onSelectionChange={handleSelectionChange}
        />
        <Input
          size="lg"
          label="Other supplies"
          placeholder="List any additional items not shown above"
          value={formData.suppliesOther}
          onValueChange={(value: string) =>
            updateFormData("suppliesOther", value)
          }
        />
        <Input
          size="lg"
          label="Additional notes"
          placeholder="Add context about damages, urgency, or quantities"
          value={formData.notes}
          onValueChange={(value: string) => updateFormData("notes", value)}
        />
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStepKey) {
      case STEPS.CONTACT:
        return (
          <ContactDetails
            contactName={formData.contactName}
            contactPhone={formData.contactPhone}
            contactEmail={formData.contactEmail}
            contactRole={formData.contactRole}
            onContactNameChange={(value) =>
              updateFormData("contactName", value)
            }
            onContactPhoneChange={(value) =>
              updateFormData("contactPhone", value)
            }
            onContactEmailChange={(value) =>
              updateFormData("contactEmail", value)
            }
            onContactRoleChange={(value) =>
              updateFormData("contactRole", value)
            }
          />
        );
      case STEPS.SCHOOL:
        return (
          <SchoolInfo
            schoolName={formData.schoolName}
            schoolType={formData.schoolType}
            onSchoolNameChange={(value) =>
              updateFormData("schoolName", value)
            }
            onSchoolTypeChange={(value) =>
              updateFormData("schoolType", value)
            }
          />
        );
      case STEPS.LOCATION:
        return (
          <LocationInfo
            addressLine1={formData.locationAddressLine1}
            addressLine2={formData.locationAddressLine2}
            city={formData.locationCity}
            parish={formData.locationParish}
            onAddressLine1Change={(value) =>
              updateFormData("locationAddressLine1", value)
            }
            onAddressLine2Change={(value) =>
              updateFormData("locationAddressLine2", value)
            }
            onCityChange={(value) => updateFormData("locationCity", value)}
            onParishChange={(value) =>
              updateFormData("locationParish", value)
            }
          />
        );
      case STEPS.SUPPLIES:
        return renderSuppliesStep();
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

