"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Confirmation } from "./Confirmation";
import { Hero } from "./Hero";
import { LocationInfo } from "./LocationInfo";
import { SchoolInfo } from "./SchoolInfo";
import { submitReliefForm } from "../actions";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import type { PhoneActionStates } from "../../../../../modules/auth/actions/states";
import { PhoneNumberForm } from "../../../../../modules/auth/components/PhoneNumberStep/PhoneNumberForm";
import { NamesForm } from "../../../../../modules/auth/components/NamesForm";
import { CONTACT_ROLE_OPTIONS, ORG_TYPE_OPTIONS } from "./options";
import { ItemsSelectionStep } from "./ItemsSelectionStep";
import type {
  ContactRoleOptionKey,
  OrgTypeOptionKey,
  ParishOptionKey,
} from "./options";

export interface ReliefFormData {
  contactFirstName: string;
  contactLastName: string;
  contactPhone: string;
  contactPhoneRaw: string;
  contactDialCode: string;
  contactCountryIso: string;
  contactRole: ContactRoleOptionKey | "";
  schoolName: string;
  schoolType: OrgTypeOptionKey | "";
  locationAddressLine1: string;
  locationAddressLine2: string;
  locationCity: string;
  locationParish: ParishOptionKey | "";
  suppliesSelected: string[];
  suppliesQuantities: Record<string, number>;
  suppliesOther: string;
  notes: string;
}

type SupportedCountryIso = "US" | "GB" | "GY" | "JM";

const initialFormData: ReliefFormData = {
  contactFirstName: "",
  contactLastName: "",
  contactPhone: "",
  contactPhoneRaw: "",
  contactDialCode: "",
  contactCountryIso: "",
  contactRole: "",
  schoolName: "",
  schoolType: "",
  locationAddressLine1: "",
  locationAddressLine2: "",
  locationCity: "",
  locationParish: "",
  suppliesSelected: [],
  suppliesQuantities: {},
  suppliesOther: "",
  notes: "",
};

const STEPS = {
  PHONE: "phone",
  NAMES: "names",
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
      { key: STEPS.PHONE, label: "Phone" },
      { key: STEPS.NAMES, label: "Names" },
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

  const currentStepKey = stepSequence[currentStep]?.key ?? STEPS.PHONE;

  const isStepComplete = (stepKey: StepKey) => {
    switch (stepKey) {
      case STEPS.PHONE:
        return formData.contactPhone.trim().length > 0;
      case STEPS.NAMES:
        return (
          formData.contactFirstName.trim().length > 0 &&
          formData.contactLastName.trim().length > 0
        );
      case STEPS.SCHOOL:
        return (
          formData.schoolName.trim().length > 0 &&
          formData.schoolType.trim().length > 0 &&
          formData.contactRole.trim().length > 0
        );
      case STEPS.LOCATION:
        return (
          formData.locationAddressLine1.trim().length > 0 &&
          formData.locationCity.trim().length > 0 &&
          formData.locationParish !== ""
        );
      case STEPS.SUPPLIES:
        if (formData.suppliesSelected.length === 0) {
          return formData.suppliesOther.trim().length > 0;
        }
        return formData.suppliesSelected.every(
          (itemId) => (formData.suppliesQuantities[itemId] ?? 0) > 0,
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

  const normalizeCountryIso = (
    iso: string,
  ): SupportedCountryIso | undefined => {
    if (iso === "US" || iso === "GB" || iso === "GY" || iso === "JM") {
      return iso;
    }
    return undefined;
  };

  const phoneDefaultCountry: SupportedCountryIso =
    normalizeCountryIso(formData.contactCountryIso) ?? "JM";

  const handlePhoneSubmission = (
    _prevState: PhoneActionStates,
    data: FormData,
  ): Promise<PhoneActionStates> => {
    const getValue = (key: string) => {
      const value = data.get(key);
      return typeof value === "string" ? value : "";
    };

    const phone = getValue("phone");
    const dialCode = getValue("countryCode");
    const rawPhone = getValue("rawPhone");
    const countryIso = getValue("countryIso");
    const normalizedIso = normalizeCountryIso(countryIso);

    setFormData((prev) => ({
      ...prev,
      contactPhone: phone,
      contactDialCode: dialCode,
      contactPhoneRaw: rawPhone,
      contactCountryIso: normalizedIso ?? "",
    }));
    setCurrentStep((prev) => Math.min(prev + 1, stepSequence.length - 1));
    return Promise.resolve({ status: "success", message: "" });
  };

  const handleNamesSuccess = (firstName: string, lastName: string) => {
    setFormData((prev) => ({
      ...prev,
      contactFirstName: firstName,
      contactLastName: lastName,
    }));
    setCurrentStep((prev) => Math.min(prev + 1, stepSequence.length - 1));
  };

  const renderStepContent = () => {
    switch (currentStepKey) {
      case STEPS.PHONE:
        return (
          <PhoneStep
            defaultCountryCode={phoneDefaultCountry}
            defaultPhone={formData.contactPhoneRaw}
            onSubmit={handlePhoneSubmission}
          />
        );
      case STEPS.NAMES:
        return (
          <NamesStep
            defaultFirstName={formData.contactFirstName}
            defaultLastName={formData.contactLastName}
            onSuccess={handleNamesSuccess}
          />
        );
      case STEPS.SCHOOL:
        return (
          <SchoolStep
            contactRole={formData.contactRole}
            onUpdate={updateFormData}
            schoolName={formData.schoolName}
            schoolType={formData.schoolType}
          />
        );
      case STEPS.LOCATION:
        return (
          <LocationStep
            addressLine1={formData.locationAddressLine1}
            addressLine2={formData.locationAddressLine2}
            city={formData.locationCity}
            onUpdate={updateFormData}
            parish={formData.locationParish}
          />
        );
      case STEPS.SUPPLIES:
        return (
          <ItemsSelectionStep
            formData={formData}
            onUpdate={updateFormData}
            setFormData={setFormData}
          />
        );
      case STEPS.CONFIRM:
        return (
          <ConfirmStep
            formData={formData}
            onResetForm={resetForm}
            onReview={() => setCurrentStep(0)}
          />
        );
      default:
        return null;
    }
  };

  const showFooter = currentStepKey !== STEPS.CONFIRM;
  const showNextButton =
    currentStepKey !== STEPS.PHONE && currentStepKey !== STEPS.NAMES;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1">{renderStepContent()}</div>
      {showFooter && (
        <footer className="sticky bottom-0 left-0 right-0 border-t border-default-200 bg-background/95 p-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-3">
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
              {showNextButton && (
                <Button
                  color="primary"
                  onPress={goToNextStep}
                  isDisabled={!canProceed || isPending}
                  isLoading={isPending}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export type ReliefFormUpdater = <K extends keyof ReliefFormData>(
  key: K,
  value: ReliefFormData[K],
) => void;

interface PhoneStepProps {
  defaultPhone: string;
  defaultCountryCode: SupportedCountryIso;
  onSubmit: (
    prevState: PhoneActionStates,
    formData: FormData,
  ) => Promise<PhoneActionStates>;
}

function PhoneStep({
  defaultCountryCode,
  defaultPhone,
  onSubmit,
}: PhoneStepProps) {
  return (
    <div className="flex flex-col">
      <Hero />
      <StepSection>
        <PhoneNumberForm
          defaultPhone={defaultPhone}
          defaultCountryCode={defaultCountryCode}
          sendAction={onSubmit}
        />
      </StepSection>
    </div>
  );
}

interface NamesStepProps {
  defaultFirstName: string;
  defaultLastName: string;
  onSuccess: (firstName: string, lastName: string) => void;
}

function NamesStep({
  defaultFirstName,
  defaultLastName,
  onSuccess,
}: NamesStepProps) {
  return (
    <StepSection>
      <NamesForm
        defaultFirstName={defaultFirstName}
        defaultLastName={defaultLastName}
        resetOnSuccess={false}
        onSuccess={onSuccess}
      />
    </StepSection>
  );
}

interface SchoolStepProps {
  schoolName: string;
  schoolType: OrgTypeOptionKey | "";
  contactRole: ContactRoleOptionKey | "";
  onUpdate: ReliefFormUpdater;
}

function SchoolStep({
  contactRole,
  onUpdate,
  schoolName,
  schoolType,
}: SchoolStepProps) {
  return (
    <StepSection>
      <div className="space-y-6">
        <SchoolInfo
          schoolName={schoolName}
          onSchoolNameChange={(value) => onUpdate("schoolName", value)}
        />
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-default-600">
              Organisation type
            </label>
            <Select
              selectedKeys={schoolType ? [schoolType] : []}
              onSelectionChange={(keys) =>
                onUpdate(
                  "schoolType",
                  (Array.from(keys)[0] as OrgTypeOptionKey | undefined) ?? "",
                )
              }
              placeholder="Select organisation type"
              size="lg"
            >
              {ORG_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-default-600">
              Your role
            </label>
            <Select
              selectedKeys={contactRole ? [contactRole] : []}
              onSelectionChange={(keys) =>
                onUpdate(
                  "contactRole",
                  (Array.from(keys)[0] as ContactRoleOptionKey | undefined) ??
                    "",
                )
              }
              placeholder="Select your role"
              size="lg"
            >
              {CONTACT_ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </StepSection>
  );
}

interface LocationStepProps {
  addressLine1: string;
  addressLine2: string;
  city: string;
  parish: ParishOptionKey | "";
  onUpdate: ReliefFormUpdater;
}

function LocationStep({
  addressLine1,
  addressLine2,
  city,
  onUpdate,
  parish,
}: LocationStepProps) {
  return (
    <StepSection>
      <LocationInfo
        addressLine1={addressLine1}
        addressLine2={addressLine2}
        city={city}
        parish={parish}
        onAddressLine1Change={(value) =>
          onUpdate("locationAddressLine1", value)
        }
        onAddressLine2Change={(value) =>
          onUpdate("locationAddressLine2", value)
        }
        onCityChange={(value) => onUpdate("locationCity", value)}
        onParishChange={(value) => onUpdate("locationParish", value)}
      />
    </StepSection>
  );
}

interface ConfirmStepProps {
  formData: ReliefFormData;
  onResetForm: () => void;
  onReview: () => void;
}

function ConfirmStep({ formData, onResetForm, onReview }: ConfirmStepProps) {
  return (
    <StepSection>
      <Confirmation
        formData={formData}
        onResetForm={onResetForm}
        onReviewAnswers={onReview}
      />
    </StepSection>
  );
}

interface StepSectionProps {
  children: ReactNode;
}

function StepSection({ children }: StepSectionProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10">
      {children}
    </section>
  );
}
