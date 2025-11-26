"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import posthog from "posthog-js";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Confirmation } from "./Confirmation";
import { Hero } from "./Hero";
import { OrgSelectionStep } from "./OrgSelectionStep";
import { submitReliefForm } from "../actions";
import type { PhoneActionStates } from "../../../../../modules/auth/actions/states";
import { PhoneNumberForm } from "../../../../../modules/auth/components/PhoneNumberStep/PhoneNumberForm";
import { NamesForm } from "../../../../../modules/auth/components/NamesForm";
import { ItemsSelectionStep } from "./ItemsSelectionStep";
import { ProjectStep } from "./ProjectStep";
import { findItemById } from "~/modules/data/items";
import type {
  ContactRoleOptionKey,
  OrgTypeOptionKey,
  ParishOptionKey,
  SeverityOptionKey,
} from "./options";
import type { Media } from "~/modules/core/media/types";

export interface ReliefFormData {
  contactFirstName: string;
  contactLastName: string;
  contactPhone: string;
  contactPhoneRaw: string;
  contactDialCode: string;
  contactCountryIso: string;
  contactRole: ContactRoleOptionKey | "";
  selectedOrgKey: string | null;
  schoolName: string;
  schoolUsername: string;
  schoolType: OrgTypeOptionKey | "";
  locationAddressLine1: string;
  locationAddressLine2: string;
  locationCity: string;
  locationParish: ParishOptionKey | "";
  severity: SeverityOptionKey | "";
  damageDescription: string;
  photos: Media[];
  suppliesSelected: string[];
  suppliesQuantities: Record<string, number>;
  suppliesOther: string;
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
  selectedOrgKey: null,
  schoolName: "",
  schoolUsername: "",
  schoolType: "",
  locationAddressLine1: "",
  locationAddressLine2: "",
  locationCity: "",
  locationParish: "",
  severity: "",
  damageDescription: "",
  photos: [],
  suppliesSelected: [],
  suppliesQuantities: {},
  suppliesOther: "",
};

const STEPS = {
  PHONE: "phone",
  NAMES: "names",
  ORG_SELECTION: "org-selection",
  PROJECT: "project",
  SUPPLIES: "supplies",
  CONFIRM: "confirm",
} as const;

type StepKey = (typeof STEPS)[keyof typeof STEPS];

interface StepDefinition {
  key: StepKey;
  label: string;
}

interface SelectedSupplySummary {
  id: string;
  name: string;
  quantity: number;
}

export function ReliefForm() {
  const [formData, setFormData] = useState<ReliefFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [hasPendingDamagePhotoUploads, setHasPendingDamagePhotoUploads] =
    useState(false);

  const stepSequence: StepDefinition[] = useMemo(
    () => [
      { key: STEPS.PHONE, label: "Phone" },
      { key: STEPS.NAMES, label: "Names" },
      { key: STEPS.ORG_SELECTION, label: "Organization" },
      { key: STEPS.PROJECT, label: "Project" },
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

  const selectedSupplies = useMemo<SelectedSupplySummary[]>(() => {
    return formData.suppliesSelected
      .map((itemId) => {
        const quantity = formData.suppliesQuantities[itemId] ?? 0;
        if (quantity <= 0) {
          return undefined;
        }
        const item = findItemById(itemId);
        if (!item) {
          return undefined;
        }
        return {
          id: itemId,
          name: item.name,
          quantity,
        };
      })
      .filter(
        (
          value,
        ): value is {
          id: string;
          name: string;
          quantity: number;
        } => value !== undefined,
      );
  }, [formData.suppliesQuantities, formData.suppliesSelected]);

  const suppliesCount = selectedSupplies.length;
  const suppliesCountLabel = suppliesCount === 1 ? "item" : "items";

  const {
    isOpen: isSuppliesDrawerOpen,
    onOpen: onSuppliesDrawerOpen,
    onOpenChange: onSuppliesDrawerOpenChange,
  } = useDisclosure();

  const handleCloseSuppliesDrawer = () => onSuppliesDrawerOpenChange();

  const updateSupplyQuantity = (
    itemId: string,
    getNextQuantity: (currentQuantity: number) => number,
  ) => {
    setFormData((prev) => {
      const currentQuantity = prev.suppliesQuantities[itemId] ?? 0;
      const nextQuantity = Math.max(getNextQuantity(currentQuantity), 0);
      const nextSelected = new Set(prev.suppliesSelected);
      if (nextQuantity > 0) {
        nextSelected.add(itemId);
      } else {
        nextSelected.delete(itemId);
      }

      return {
        ...prev,
        suppliesSelected: Array.from(nextSelected),
        suppliesQuantities: {
          ...prev.suppliesQuantities,
          [itemId]: nextQuantity,
        },
      };
    });
  };

  const handleSupplyIncrement = (itemId: string) => {
    updateSupplyQuantity(itemId, (current) => current + 1);
  };

  const handleSupplyDecrement = (itemId: string) => {
    updateSupplyQuantity(itemId, (current) => (current <= 1 ? 0 : current - 1));
  };

  const isStepComplete = (stepKey: StepKey) => {
    switch (stepKey) {
      case STEPS.PHONE:
        return formData.contactPhone.trim().length > 0;
      case STEPS.NAMES:
        return (
          formData.contactFirstName.trim().length > 0 &&
          formData.contactLastName.trim().length > 0
        );
      case STEPS.ORG_SELECTION: {
        if (formData.contactRole.trim().length === 0) {
          return false;
        }
        if (formData.schoolName.trim().length === 0) {
          return false;
        }
        if (formData.selectedOrgKey) {
          return true;
        }
        return (
          formData.schoolType.trim().length > 0 &&
          formData.locationAddressLine1.trim().length > 0 &&
          formData.locationCity.trim().length > 0 &&
          formData.locationParish !== ""
        );
      }
      case STEPS.PROJECT:
        return (
          formData.severity !== "" &&
          formData.damageDescription.trim().length > 0 &&
          !hasPendingDamagePhotoUploads
        );
      case STEPS.SUPPLIES: {
        if (formData.suppliesSelected.length === 0) {
          return true;
        }
        return formData.suppliesSelected.every(
          (itemId) => (formData.suppliesQuantities[itemId] ?? 0) > 0,
        );
      }
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
    value:
      | ReliefFormData[K]
      | ((currentValue: ReliefFormData[K]) => ReliefFormData[K]),
  ) => {
    setFormData((prev) => {
      const resolvedValue =
        typeof value === "function"
          ? (value as (current: ReliefFormData[K]) => ReliefFormData[K])(
              prev[key],
            )
          : value;

      return {
        ...prev,
        [key]: resolvedValue,
      };
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setHasPendingDamagePhotoUploads(false);
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

    posthog.capture("LeadPhoneEntered", {
      $set: {
        phone: phone,
      },
    });

    setCurrentStep((prev) => Math.min(prev + 1, stepSequence.length - 1));
    return Promise.resolve({ status: "success", message: "" });
  };

  const handleNamesSuccess = (firstName: string, lastName: string) => {
    setFormData((prev) => ({
      ...prev,
      contactFirstName: firstName,
      contactLastName: lastName,
    }));

    posthog.capture("LeadNameEntered", {
      $set: {
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`,
      },
    });

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
      case STEPS.ORG_SELECTION:
        return (
          <OrgSelectionStepWrapper
            contactRole={formData.contactRole}
            locationAddressLine1={formData.locationAddressLine1}
            locationAddressLine2={formData.locationAddressLine2}
            locationCity={formData.locationCity}
            locationParish={formData.locationParish}
            onUpdate={updateFormData}
            schoolName={formData.schoolName}
            schoolUsername={formData.schoolUsername}
            schoolType={formData.schoolType}
            selectedOrgKey={formData.selectedOrgKey}
          />
        );
      case STEPS.PROJECT:
        return (
          <ProjectStepWrapper
            severity={formData.severity}
            damageDescription={formData.damageDescription}
            photos={formData.photos}
            schoolUsername={formData.schoolUsername}
            onUpdate={updateFormData}
            onUploadStatusChange={setHasPendingDamagePhotoUploads}
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
          <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex items-center justify-start">
              <Button
                variant="flat"
                color="default"
                size="sm"
                onPress={onSuppliesDrawerOpen}
                aria-label={`View selected supplies (${suppliesCount} ${suppliesCountLabel})`}
              >
                {`Items (${suppliesCount})`}
              </Button>
            </div>
            <span className="text-center text-sm font-medium text-default-600">
              {currentStep + 1}/{stepSequence.length}
            </span>
            <div className="flex items-center justify-end gap-3">
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
      <Drawer
        isOpen={isSuppliesDrawerOpen}
        placement="bottom"
        backdrop="opaque"
        hideCloseButton
        onOpenChange={onSuppliesDrawerOpenChange}
      >
        <DrawerContent>
          <DrawerHeader className="border-b border-default-200">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-default-900">
                Selected supplies
              </h3>
              <p className="text-sm text-default-500">
                {suppliesCount} {suppliesCountLabel} in list
              </p>
            </div>
          </DrawerHeader>
          <DrawerBody className="space-y-4">
            {suppliesCount === 0 ? (
              <p className="text-sm text-default-500">
                No supplies selected yet. Add items to see them here.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedSupplies.map((supply) => (
                  <div
                    key={supply.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-default-200 px-3 py-2"
                  >
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-default-800">
                        {supply.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="default"
                        onPress={() => handleSupplyDecrement(supply.id)}
                        aria-label={
                          supply.quantity > 1
                            ? `Decrease quantity of ${supply.name}`
                            : `Remove ${supply.name} from list`
                        }
                      >
                        {supply.quantity > 1 ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold text-default-700">
                        {supply.quantity}
                      </span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="default"
                        onPress={() => handleSupplyIncrement(supply.id)}
                        aria-label={`Increase quantity of ${supply.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DrawerBody>
          <DrawerFooter className="border-t border-default-200">
            <Button
              variant="light"
              color="default"
              onPress={handleCloseSuppliesDrawer}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export type ReliefFormUpdater = <K extends keyof ReliefFormData>(
  key: K,
  value:
    | ReliefFormData[K]
    | ((currentValue: ReliefFormData[K]) => ReliefFormData[K]),
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

interface OrgSelectionStepWrapperProps {
  selectedOrgKey: string | null;
  schoolName: string;
  schoolUsername: string;
  schoolType: OrgTypeOptionKey | "";
  contactRole: ContactRoleOptionKey | "";
  locationAddressLine1: string;
  locationAddressLine2: string;
  locationCity: string;
  locationParish: ParishOptionKey | "";
  onUpdate: ReliefFormUpdater;
}

function OrgSelectionStepWrapper({
  selectedOrgKey,
  schoolName,
  schoolUsername,
  schoolType,
  contactRole,
  locationAddressLine1,
  locationAddressLine2,
  locationCity,
  locationParish,
  onUpdate,
}: OrgSelectionStepWrapperProps) {
  return (
    <StepSection>
      <OrgSelectionStep
        selectedOrgKey={selectedOrgKey}
        schoolName={schoolName}
        schoolUsername={schoolUsername}
        schoolType={schoolType}
        contactRole={contactRole}
        locationAddressLine1={locationAddressLine1}
        locationAddressLine2={locationAddressLine2}
        locationCity={locationCity}
        locationParish={locationParish}
        onSelectedOrgKeyChange={(key) => onUpdate("selectedOrgKey", key)}
        onSchoolNameChange={(value) => onUpdate("schoolName", value)}
        onSchoolUsernameChange={(value) => onUpdate("schoolUsername", value)}
        onSchoolTypeChange={(value) => onUpdate("schoolType", value)}
        onContactRoleChange={(value) => onUpdate("contactRole", value)}
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

interface ProjectStepWrapperProps {
  severity: SeverityOptionKey | "";
  damageDescription: string;
  photos: Media[];
  schoolUsername: string;
  onUpdate: ReliefFormUpdater;
  onUploadStatusChange: (hasPendingUploads: boolean) => void;
}

function ProjectStepWrapper({
  severity,
  damageDescription,
  photos,
  schoolUsername,
  onUpdate,
  onUploadStatusChange,
}: ProjectStepWrapperProps) {
  return (
    <StepSection>
      <ProjectStep
        severity={severity}
        damageDescription={damageDescription}
        photos={photos}
        schoolUsername={schoolUsername}
        onSeverityChange={(value) => onUpdate("severity", value)}
        onDamageDescriptionChange={(value) =>
          onUpdate("damageDescription", value)
        }
        onPhotosChange={(updater) => onUpdate("photos", updater)}
        onUploadStatusChange={onUploadStatusChange}
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
