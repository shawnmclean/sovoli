"use client";

import { useState } from "react";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Progress } from "@sovoli/ui/components/progress";
import { Button } from "@sovoli/ui/components/button";
import { ArrowLeftIcon } from "lucide-react";

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

  const getProgressValue = () => {
    switch (currentStep) {
      case "guardian":
        return 50;
      case "children":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Card shadow="sm" className="overflow-visible">
      <CardBody className="overflow-hidden p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center text-foreground">
            School Enrollment Application
          </h2>

          <Progress
            aria-label="Application Progress"
            value={getProgressValue()}
            className="mb-6"
            color="primary"
          />

          <div className="flex justify-between mb-6 text-sm text-foreground-500">
            <span
              className={
                currentStep === "guardian" ? "font-semibold text-primary" : ""
              }
            >
              Guardian Information
            </span>
            <span
              className={
                currentStep === "children" ? "font-semibold text-primary" : ""
              }
            >
              Children Information
            </span>
          </div>

          {currentStep === "guardian" && (
            <GuardianForm onNext={handleGuardianNext} />
          )}

          {currentStep === "children" && (
            <ChildrenForm onNext={handleChildrenNext} onBack={handleBack} />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
