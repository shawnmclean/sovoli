"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
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
import { LocationInfo } from "./LocationInfo";
import { SchoolInfo } from "./SchoolInfo";
import { submitReliefForm } from "../actions";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import type { PhoneActionStates } from "../../../../../modules/auth/actions/states";
import { PhoneNumberForm } from "../../../../../modules/auth/components/PhoneNumberStep/PhoneNumberForm";
import { NamesForm } from "../../../../../modules/auth/components/NamesForm";
import { CONTACT_ROLE_OPTIONS, ORG_TYPE_OPTIONS } from "./options";
import { ItemsSelectionStep } from "./ItemsSelectionStep";
import { findItemById } from "~/modules/data/items";
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

interface SelectedSupplySummary {
  id: string;
  name: string;
  quantity: number;
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
