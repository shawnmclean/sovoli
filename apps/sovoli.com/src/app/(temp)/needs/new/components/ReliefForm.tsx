"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Divider } from "@sovoli/ui/components/divider";
import { Confirmation } from "./Confirmation";
import { Hero } from "./Hero";
import { LocationInfo } from "./LocationInfo";
import { SchoolInfo } from "./SchoolInfo";
import { SuppliesItemSelection } from "./SuppliesItemSelection";
import { submitReliefForm } from "../actions";
import { Input } from "@sovoli/ui/components/input";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import type { PhoneActionStates } from "../../../../../modules/auth/actions/states";
import { PhoneNumberForm } from "../../../../../modules/auth/components/PhoneNumberStep/PhoneNumberForm";
import { NamesForm } from "../../../../../modules/auth/components/NamesForm";
import { CONTACT_ROLE_OPTIONS, ORG_TYPE_OPTIONS } from "./options";
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

  const getStepTitle = () => {
    switch (currentStepKey) {
      case STEPS.PHONE:
        return "";
      case STEPS.NAMES:
        return "";
      case STEPS.SCHOOL:
        return "School Information";
      case STEPS.LOCATION:
        return "School Location";
      case STEPS.SUPPLIES:
        return "";
      case STEPS.CONFIRM:
        return "Thank you for sharing your needs";
      default:
        return "";
    }
  };

  const renderSuppliesStep = () => {
    const selectedItemIds = new Set(formData.suppliesSelected);

    const handleSelectionChange = (selectedIds: Set<string>) => {
      setFormData((prev) => {
        return {
          ...prev,
          suppliesQuantities: Array.from(selectedIds).reduce<
            Record<string, number>
          >((acc, itemId) => {
            const existingQuantity = prev.suppliesQuantities[itemId];
            acc[itemId] =
              existingQuantity && existingQuantity > 0 ? existingQuantity : 1;
            return acc;
          }, {}),
          suppliesSelected: Array.from(selectedIds),
        };
      });
    };

    const handleQuantityChange = (itemId: string, quantity: number) => {
      setFormData((prev) => ({
        ...prev,
        suppliesQuantities: {
          ...prev.suppliesQuantities,
          [itemId]: quantity,
        },
      }));
    };

    return (
      <div className="space-y-6">
        <SuppliesItemSelection
          selectedItemIds={selectedItemIds}
          quantities={formData.suppliesQuantities}
          onSelectionChange={handleSelectionChange}
          onQuantityChange={handleQuantityChange}
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
          <PhoneNumberForm
            defaultPhone={formData.contactPhoneRaw}
            defaultCountryCode={phoneDefaultCountry}
            sendAction={handlePhoneSubmission}
          />
        );
      case STEPS.NAMES:
        return (
          <NamesForm
            defaultFirstName={formData.contactFirstName}
            defaultLastName={formData.contactLastName}
            resetOnSuccess={false}
            onSuccess={handleNamesSuccess}
          />
        );
      case STEPS.SCHOOL:
        return (
          <div className="space-y-6">
            <SchoolInfo
              schoolName={formData.schoolName}
              onSchoolNameChange={(value) =>
                updateFormData("schoolName", value)
              }
            />
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-default-600">
                  Organisation type
                </label>
                <Select
                  selectedKeys={
                    formData.schoolType ? [formData.schoolType] : []
                  }
                  onSelectionChange={(keys) =>
                    updateFormData(
                      "schoolType",
                      (Array.from(keys)[0] as OrgTypeOptionKey | undefined) ??
                        "",
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
                  selectedKeys={
                    formData.contactRole ? [formData.contactRole] : []
                  }
                  onSelectionChange={(keys) =>
                    updateFormData(
                      "contactRole",
                      (Array.from(keys)[0] as
                        | ContactRoleOptionKey
                        | undefined) ?? "",
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
            onParishChange={(value) => updateFormData("locationParish", value)}
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

  const showFooter = currentStepKey !== STEPS.CONFIRM;
  const showNextButton =
    currentStepKey !== STEPS.PHONE && currentStepKey !== STEPS.NAMES;

  return (
    <div className="w-full flex flex-col items-center gap-12 pb-24">
      {currentStep === 0 && <Hero />}
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-center">{getStepTitle()}</h1>
        <Divider />
        <div className="space-y-8">{renderStepContent()}</div>
      </div>
      {showFooter && (
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
        </div>
      )}
    </div>
  );
}
