"use client";

import { useState } from "react";
import { Stepper } from "@sovoli/ui/components/stepper";

import { GuardianForm } from "./GuardianForm";
import { ChildrenForm } from "./ChildrenForm";
import type { OrgInstance } from "~/modules/organisations/types";

interface ApplyCardProps {
  orgInstance: OrgInstance;
}

type FormStep = "guardian" | "children";

interface GuardianData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  relationship: string;
}

interface ChildData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  previousSchool?: string;
  medicalConditions?: string;
  allergies?: string;
}

interface FormData {
  guardians: {
    primary: GuardianData;
    secondary?: GuardianData;
  };
  children: ChildData[];
}

export function ApplyCard({ orgInstance }: ApplyCardProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>("guardian");
  const [formData, setFormData] = useState<FormData>({
    guardians: {
      primary: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        relationship: "",
      },
    },
    children: [],
  });

  const handleGuardianNext = (guardianData: {
    primary: GuardianData;
    secondary?: GuardianData;
  }) => {
    setFormData((prev) => ({
      ...prev,
      guardians: guardianData,
    }));
    setCurrentStep("children");
  };

  const handleChildrenNext = (childrenData: ChildData[]) => {
    setFormData((prev) => ({
      ...prev,
      children: childrenData,
    }));
    handleSubmit();
  };

  const handleBack = () => {
    setCurrentStep("guardian");
  };

  const handleSubmit = () => {
    console.log(`Form submitted to ${orgInstance.org.name}:`, formData);
    // Here you would typically send the data to your backend
    alert("Application submitted successfully!");
  };

  const steps = [{ label: "Guardian" }, { label: "Children" }];
  const currentStepIndex = currentStep === "guardian" ? 0 : 1;

  return (
    <div>
      <Stepper
        steps={steps}
        currentStep={currentStepIndex}
        onStepClick={(idx) => {
          if (idx < currentStepIndex) {
            setCurrentStep("guardian");
          }
        }}
        className="my-4"
      />

      {currentStep === "guardian" && (
        <GuardianForm
          onNext={handleGuardianNext}
          initialData={formData.guardians}
        />
      )}

      {currentStep === "children" && (
        <ChildrenForm
          onNext={handleChildrenNext}
          onBack={handleBack}
          initialData={formData.children}
        />
      )}
    </div>
  );
}
