"use client";

import { useState, useEffect, useMemo } from "react";
import posthog from "posthog-js";
import {
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerFooter,
} from "@sovoli/ui/components/drawer";
import { DrawerHeader } from "@sovoli/ui/components/drawer";
import { RadioGroup } from "@sovoli/ui/components/radio";
import { CustomRadio } from "@sovoli/ui/components/radio";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { XIcon } from "lucide-react";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Lead } from "./LeadsTable";

interface LeadInteractionForm {
  contactOutcome: "not_reached" | "brief_contact" | "conversation" | "";
  notReachedReason?: "try_again_later" | "invalid_number";
  interestLevel?: "not_interested" | "curious" | "unsure" | "wants_to_proceed";
  blocker?:
    | "different_program"
    | "timing"
    | "needs_time"
    | "needs_approval"
    | "needs_visit"
    | "price_uncertainty"
    | "comparing"
    | "not_serious";
  nextAction?:
    | "follow_up_later"
    | "visit_scheduled"
    | "waiting_on_them"
    | "no_followup";
  notes?: string;
}

interface LeadInteraction {
  contactOutcome: "not_reached" | "brief_contact" | "conversation";
  notReachedReason?: "try_again_later" | "invalid_number";
  interestLevel?: "not_interested" | "curious" | "unsure" | "wants_to_proceed";
  blocker?:
    | "different_program"
    | "timing"
    | "needs_time"
    | "needs_approval"
    | "needs_visit"
    | "price_uncertainty"
    | "comparing"
    | "not_serious";
  nextAction?:
    | "follow_up_later"
    | "visit_scheduled"
    | "waiting_on_them"
    | "no_followup";
  notes?: string;
  loggedAt: string;
}

interface LeadInteractionModalProps {
  lead: Lead;
  orgInstance: OrgInstance;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (interaction: LeadInteraction) => void;
}

type Step = "contact_outcome" | "not_reached_reason" | "interest_level" | "blocker" | "next_action" | "notes";

export function LeadInteractionModal({
  lead,
  orgInstance,
  isOpen,
  onOpenChange,
  onSave,
}: LeadInteractionModalProps) {
  const [formData, setFormData] = useState<LeadInteractionForm>({
    contactOutcome: "",
  });
  const [currentStep, setCurrentStep] = useState<Step>("contact_outcome");

  // Reset to first step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep("contact_outcome");
      setFormData({ contactOutcome: "" });
    }
  }, [isOpen]);

  // Calculate available steps based on form data
  const availableSteps = useMemo((): Step[] => {
    const steps: Step[] = ["contact_outcome"];

    if (formData.contactOutcome === "not_reached") {
      steps.push("not_reached_reason");
      return steps;
    }

    if (formData.contactOutcome !== "") {
      steps.push("interest_level");

      // Only show blocker if interest level is set and not "wants_to_proceed"
      if (
        formData.interestLevel &&
        formData.interestLevel !== "wants_to_proceed"
      ) {
        steps.push("blocker");
      }

      // Always show optional steps if contact was made
      steps.push("next_action", "notes");
    }

    return steps;
  }, [formData.contactOutcome, formData.interestLevel]);

  // Ensure current step is valid, or move to closest valid step
  useEffect(() => {
    const currentIndex = availableSteps.indexOf(currentStep);
    
    // If current step is not in available steps, find the closest valid step
    if (currentIndex === -1) {
      // If we were on a step that's no longer available, go to last available step
      // or first step if that makes more sense
      if (currentStep === "not_reached_reason" && formData.contactOutcome !== "not_reached") {
        // User changed from not_reached to something else, go to interest_level
        if (formData.contactOutcome !== "") {
          setCurrentStep("interest_level");
        } else {
          setCurrentStep("contact_outcome");
        }
      } else if (currentStep === "blocker" && formData.interestLevel === "wants_to_proceed") {
        // User changed to wants_to_proceed, skip blocker
        setCurrentStep("next_action");
      } else {
        // Default: go to first available step
        setCurrentStep(availableSteps[0] ?? "contact_outcome");
      }
    }
  }, [availableSteps, currentStep, formData.contactOutcome, formData.interestLevel]);

  const currentStepIndex = availableSteps.indexOf(currentStep);
  const canGoBack = currentStepIndex > 0;
  const canGoNext = currentStepIndex < availableSteps.length - 1;
  const isLastStep = currentStepIndex === availableSteps.length - 1;

  const handleNext = () => {
    if (canGoNext && currentStepIndex >= 0) {
      const nextIndex = currentStepIndex + 1;
      const nextStep = availableSteps[nextIndex];
      if (nextStep) {
        setCurrentStep(nextStep);
      }
    }
  };

  const handleBack = () => {
    if (canGoBack && currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      const prevStep = availableSteps[prevIndex];
      if (prevStep) {
        setCurrentStep(prevStep);
      }
    }
  };

  const handleSave = () => {
    if (!formData.contactOutcome) {
      return;
    }

    const loggedAt = new Date().toISOString();
    const interaction: LeadInteraction = {
      contactOutcome: formData.contactOutcome,
      ...(formData.notReachedReason && {
        notReachedReason: formData.notReachedReason,
      }),
      ...(formData.interestLevel && { interestLevel: formData.interestLevel }),
      ...(formData.blocker && { blocker: formData.blocker }),
      ...(formData.nextAction && { nextAction: formData.nextAction }),
      ...(formData.notes && { notes: formData.notes }),
      loggedAt,
    };

    // Log to PostHog
    posthog.capture("LeadUpdated", {
      leadId: lead.id,
      contactOutcome: interaction.contactOutcome,
      ...(interaction.notReachedReason && {
        notReachedReason: interaction.notReachedReason,
      }),
      ...(interaction.interestLevel && {
        interestLevel: interaction.interestLevel,
      }),
      ...(interaction.blocker && { blocker: interaction.blocker }),
      ...(interaction.nextAction && { nextAction: interaction.nextAction }),
      ...(interaction.notes && { notes: interaction.notes }),
      loggedAt: interaction.loggedAt,
      tenant: orgInstance.org.username,
      cycleId: lead.cycleId,
      programId: lead.programId,
      programName: lead.programName,
      cycleLabel: lead.cycleLabel,
    });

    onSave(interaction);
    onOpenChange(false);
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  const getStepTitle = (): string => {
    switch (currentStep) {
      case "contact_outcome":
        return "What happened with this lead?";
      case "not_reached_reason":
        return "Why didn't you reach them?";
      case "interest_level":
        return "How would you describe their interest?";
      case "blocker":
        return "What was the main blocker?";
      case "next_action":
        return "What happens next?";
      case "notes":
        return "Add a note (optional)";
      default:
        return "Update Lead";
    }
  };

  const getStepSubtitle = (): string | undefined => {
    switch (currentStep) {
      case "contact_outcome":
        return "Log the outcome to improve follow-ups and lead quality.";
      case "next_action":
      case "notes":
        return "Optional";
      default:
        return undefined;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "contact_outcome":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <RadioGroup
                value={formData.contactOutcome}
                onValueChange={(value) => {
                  setFormData((prev) => {
                    const newOutcome = value as LeadInteractionForm["contactOutcome"];
                    // Reset dependent fields when changing outcome
                    return {
                      ...prev,
                      contactOutcome: newOutcome,
                      // Clear dependent fields if changing outcome
                      ...(newOutcome !== prev.contactOutcome && {
                        notReachedReason: undefined,
                        interestLevel: undefined,
                        blocker: undefined,
                      }),
                    };
                  });
                }}
                classNames={{
                  wrapper: "space-y-3",
                }}
              >
                <CustomRadio value="not_reached">
                  <span className="text-base font-medium">
                    Did not reach them
                  </span>
                </CustomRadio>
                <CustomRadio value="brief_contact">
                  <span className="text-base font-medium">
                    Spoke / chatted briefly
                  </span>
                </CustomRadio>
                <CustomRadio value="conversation">
                  <span className="text-base font-medium">
                    Had a proper conversation
                  </span>
                </CustomRadio>
              </RadioGroup>
            </div>
          </div>
        );

      case "not_reached_reason":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <RadioGroup
                value={formData.notReachedReason ?? ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    notReachedReason:
                      value === ""
                        ? undefined
                        : (value as LeadInteractionForm["notReachedReason"]),
                  }));
                }}
                classNames={{
                  wrapper: "space-y-3",
                }}
              >
                <CustomRadio value="try_again_later">
                  <span className="text-base font-medium">Try again later</span>
                </CustomRadio>
                <CustomRadio value="invalid_number">
                  <span className="text-base font-medium">Number invalid</span>
                </CustomRadio>
              </RadioGroup>
            </div>
          </div>
        );

      case "interest_level":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <RadioGroup
                value={formData.interestLevel ?? ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    interestLevel:
                      value === ""
                        ? undefined
                        : (value as LeadInteractionForm["interestLevel"]),
                    // Reset blocker if they want to proceed
                    ...(value === "wants_to_proceed" && {
                      blocker: undefined,
                    }),
                  }));
                }}
                classNames={{
                  wrapper: "space-y-3",
                }}
              >
                <CustomRadio value="not_interested">
                  <span className="text-base font-medium">
                    Not interested
                  </span>
                </CustomRadio>
                <CustomRadio value="curious">
                  <span className="text-base font-medium">
                    Curious / asking questions
                  </span>
                </CustomRadio>
                <CustomRadio value="unsure">
                  <span className="text-base font-medium">
                    Interested but unsure
                  </span>
                </CustomRadio>
                <CustomRadio value="wants_to_proceed">
                  <span className="text-base font-medium">
                    Actively wants to proceed
                  </span>
                </CustomRadio>
              </RadioGroup>
            </div>
          </div>
        );

      case "blocker":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <RadioGroup
                value={formData.blocker ?? ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    blocker:
                      value === ""
                        ? undefined
                        : (value as LeadInteractionForm["blocker"]),
                  }));
                }}
                classNames={{
                  wrapper: "space-y-4",
                }}
              >
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
                    Program
                  </div>
                  <div className="space-y-2 pl-2">
                    <CustomRadio value="different_program">
                      <span className="text-sm">
                        Wanted a different program
                      </span>
                    </CustomRadio>
                    <CustomRadio value="timing">
                      <span className="text-sm">
                        Timing didn&apos;t match
                      </span>
                    </CustomRadio>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
                    Commitment
                  </div>
                  <div className="space-y-2 pl-2">
                    <CustomRadio value="needs_time">
                      <span className="text-sm">Needs time to think</span>
                    </CustomRadio>
                    <CustomRadio value="needs_approval">
                      <span className="text-sm">
                        Needs partner/family approval
                      </span>
                    </CustomRadio>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
                    Logistics
                  </div>
                  <div className="space-y-2 pl-2">
                    <CustomRadio value="needs_visit">
                      <span className="text-sm">Needs to visit first</span>
                    </CustomRadio>
                    <CustomRadio value="price_uncertainty">
                      <span className="text-sm">
                        Price or payment uncertainty
                      </span>
                    </CustomRadio>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-default-500 uppercase tracking-wide">
                    Behavioral
                  </div>
                  <div className="space-y-2 pl-2">
                    <CustomRadio value="comparing">
                      <span className="text-sm">
                        Just comparing options
                      </span>
                    </CustomRadio>
                    <CustomRadio value="not_serious">
                      <span className="text-sm">
                        Didn&apos;t seem serious
                      </span>
                    </CustomRadio>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "next_action":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <RadioGroup
                value={formData.nextAction ?? ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    nextAction:
                      value === ""
                        ? undefined
                        : (value as LeadInteractionForm["nextAction"]),
                  }));
                }}
                classNames={{
                  wrapper: "space-y-3",
                }}
              >
                <CustomRadio value="follow_up_later">
                  <span className="text-base font-medium">
                    Follow up later
                  </span>
                </CustomRadio>
                <CustomRadio value="visit_scheduled">
                  <span className="text-base font-medium">
                    Visit scheduled
                  </span>
                </CustomRadio>
                <CustomRadio value="waiting_on_them">
                  <span className="text-base font-medium">
                    Waiting on them
                  </span>
                </CustomRadio>
                <CustomRadio value="no_followup">
                  <span className="text-base font-medium">
                    No follow-up planned
                  </span>
                </CustomRadio>
              </RadioGroup>
            </div>
          </div>
        );

      case "notes":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Input
                value={formData.notes ?? ""}
                onValueChange={(value) => {
                  if (value.length <= 120) {
                    setFormData((prev) => ({
                      ...prev,
                      notes: value || undefined,
                    }));
                  }
                }}
                placeholder="Optional note (e.g. wants Feb intake, asked about certificate)"
                maxLength={120}
                variant="bordered"
                size="lg"
              />
              <div className="text-xs text-default-500 text-right">
                {(formData.notes?.length ?? 0)}/120
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Don't render if step is invalid (should be handled by useEffect, but safety check)
  if (currentStepIndex === -1) {
    return null;
  }

  return (
    <Drawer
      isOpen={isOpen}
      size="full"
      placement="bottom"
      backdrop="opaque"
      hideCloseButton
      onOpenChange={onOpenChange}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.3,
            },
          },
          exit: {
            y: 100,
            opacity: 0,
            transition: {
              duration: 0.3,
            },
          },
        },
      }}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader
              title={getStepTitle()}
              showBackButton={canGoBack}
              onBackPress={handleBack}
              endContent={
                <Button isIconOnly onPress={onClose} variant="light">
                  <XIcon size={24} />
                </Button>
              }
            />
            {getStepSubtitle() && (
              <div className="px-4 pb-2">
                <p className="text-sm text-default-500">{getStepSubtitle()}</p>
              </div>
            )}
            <DrawerBody>
              <div className="space-y-4 pb-4">
                {renderStepContent()}
              </div>
            </DrawerBody>
            <DrawerFooter>
              <div className="flex gap-2 w-full">
                {canGoBack && (
                  <Button variant="light" onPress={handleBack}>
                    Back
                  </Button>
                )}
                <div className="flex-1" />
                {isLastStep ? (
                  <>
                    <Button variant="light" onPress={handleSkip}>
                      Skip
                    </Button>
                    <Button
                      color="primary"
                      onPress={handleSave}
                      isDisabled={!formData.contactOutcome}
                    >
                      Save outcome
                    </Button>
                  </>
                ) : (
                  <Button
                    color="primary"
                    onPress={handleNext}
                    isDisabled={
                      (currentStep === "contact_outcome" &&
                        !formData.contactOutcome) ||
                      (currentStep === "interest_level" &&
                        !formData.interestLevel)
                    }
                  >
                    Next
                  </Button>
                )}
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
