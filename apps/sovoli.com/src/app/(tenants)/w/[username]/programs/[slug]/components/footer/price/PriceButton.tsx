"use client";
import { useProgramCycleSelection } from "../../../context/ProgramCycleSelectionContext";
import { Button } from "@sovoli/ui/components/button";
import { Skeleton } from "@sovoli/ui/components/skeleton";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { ProgramPriceCard } from "~/app/(tenants)/w/[username]/(main-layout)/programs/components/ProgramPriceCard";
import type { PricingItem } from "~/modules/core/economics/types";
import { formatCycleLabel } from "~/utils/dateUtils";
import { PaymentPlan } from "../../PaymentPlan";
import { MessageSquareShareIcon } from "lucide-react";
import { gradientBorderButton } from "~/components/GradientBorderButton";
import { getWhatsAppContact } from "~/utils/whatsappUtils";
import { SignupDialog } from "~/modules/auth/components/SignupDialog";
import { XIcon } from "lucide-react";

export interface PriceButtonProps {
  defaultCycle?: ProgramCycle;
  program?: Program;
  orgInstance?: OrgInstance;
  onChatNowClick?: () => void;
}

export function PriceButton({
  defaultCycle,
  program,
  orgInstance,
  onChatNowClick,
}: PriceButtonProps) {
  const { selectedCycle, isLoading, isInitialized } =
    useProgramCycleSelection();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isChatOpen,
    onOpen: onChatOpen,
    onOpenChange: onChatOpenChange,
  } = useDisclosure();

  const whatsappNumber = orgInstance
    ? getWhatsAppContact(orgInstance)
    : undefined;

  // Use selected cycle if available, otherwise fall back to default cycle
  // This ensures the drawer always uses the same cycle as what's displayed in the button
  const cycleToUse = selectedCycle ?? defaultCycle;

  // Only show loading during user-initiated changes, not during initial render
  if ((isLoading && isInitialized) || !cycleToUse) {
    return null;
  }

  const startDate =
    cycleToUse.academicCycle.startDate ??
    cycleToUse.academicCycle.globalCycle?.startDate;
  const endDate =
    cycleToUse.academicCycle.endDate ??
    cycleToUse.academicCycle.globalCycle?.endDate;

  const cycleLabel = formatCycleLabel(startDate, endDate);

  // Get tuition pricing from the cycle that will be displayed
  const pricingItem = cycleToUse.pricingPackage.pricingItems.find(
    (item) => item.purpose === "tuition",
  );

  // Get the first available currency and amount
  const currencyEntry = pricingItem?.amount
    ? Object.entries(pricingItem.amount).find(
        ([_, amount]) => amount && amount > 0,
      )
    : null;

  const currency = currencyEntry
    ? (currencyEntry[0] as "GYD" | "USD" | "JMD")
    : "GYD";
  const tuitionCost = currencyEntry ? currencyEntry[1] : 0;

  // Format billing cycle unit
  const formatBillingCycle = (cycle: string) => {
    if (cycle === "one-time") return "one-time •";
    if (cycle === "annual") return "yearly •";
    if (cycle === "term") return "termly •";
    if (cycle === "monthly") return "monthly •";
    return ``;
  };

  const billingUnit = pricingItem?.billingCycle
    ? formatBillingCycle(pricingItem.billingCycle)
    : "";

  // Determine if we should show the button as clickable
  // Only show pricing button if we have a cycle and it's not closed
  const showPricingButton = selectedCycle && selectedCycle.status !== "closed";

  return (
    <>
      <Skeleton isLoaded={!(isLoading && isInitialized)}>
        {showPricingButton ? (
          <Button
            variant="light"
            color="default"
            className=" h-auto"
            onPress={onOpen}
          >
            <div className="flex flex-col items-start min-w-0 w-full">
              <span className="text-md font-bold text-primary underline">
                {currency} {tuitionCost.toLocaleString()}
              </span>
              <span className="text-xs text-foreground-500">
                {billingUnit} {cycleLabel}
              </span>
            </div>
          </Button>
        ) : (
          <span className="text-default-600">Closed</span>
        )}
      </Skeleton>

      {/* Price Details Drawer - Always use the same cycle as displayed in the button */}
      <Drawer
        isOpen={isOpen}
        size="5xl"
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
                classNames={{
                  base: "py-0",
                }}
                endContent={
                  <Button isIconOnly onPress={onClose} variant="light">
                    <XIcon size={24} />
                  </Button>
                }
              />
              <DrawerBody className="px-4 pb-6">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    Price details
                  </h2>
                  {/* Tuition Section */}
                  {cycleToUse.pricingPackage.pricingItems.filter(
                    (item: PricingItem) => item.purpose === "tuition",
                  ).length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wide">
                        Tuition
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {cycleToUse.pricingPackage.pricingItems
                          .filter(
                            (item: PricingItem) => item.purpose === "tuition",
                          )
                          .map((item: PricingItem) => (
                            <ProgramPriceCard
                              key={item.id}
                              pricingPackage={cycleToUse.pricingPackage}
                              pricingItemId={item.id}
                              preferredCurrency={currency}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Registration Section */}
                  {cycleToUse.pricingPackage.pricingItems.filter(
                    (item: PricingItem) => item.purpose === "registration",
                  ).length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wide">
                        Registration
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {cycleToUse.pricingPackage.pricingItems
                          .filter(
                            (item: PricingItem) =>
                              item.purpose === "registration",
                          )
                          .map((item: PricingItem) => (
                            <ProgramPriceCard
                              key={item.id}
                              pricingPackage={cycleToUse.pricingPackage}
                              pricingItemId={item.id}
                              preferredCurrency={currency}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Materials Section */}
                  {cycleToUse.pricingPackage.pricingItems.filter(
                    (item: PricingItem) => item.purpose === "materials",
                  ).length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wide">
                        Materials
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {cycleToUse.pricingPackage.pricingItems
                          .filter(
                            (item: PricingItem) => item.purpose === "materials",
                          )
                          .map((item: PricingItem) => (
                            <ProgramPriceCard
                              key={item.id}
                              pricingPackage={cycleToUse.pricingPackage}
                              pricingItemId={item.id}
                              preferredCurrency={currency}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Plan Section */}
                  {cycleToUse.pricingPackage.paymentSplits &&
                    cycleToUse.pricingPackage.paymentSplits.length > 0 && (
                      <div className="pt-4 border-t border-divider">
                        <PaymentPlan
                          pricingPackage={cycleToUse.pricingPackage}
                          preferredCurrency={currency}
                          cycleStartDate={startDate}
                        />
                      </div>
                    )}

                  {/* Notes Section - Show notes from any pricing item */}
                  {(() => {
                    const itemsWithNotes =
                      cycleToUse.pricingPackage.pricingItems.filter(
                        (item: PricingItem) => item.notes,
                      );
                    if (itemsWithNotes.length === 0) return null;

                    // Get the first note (assuming all items have the same note if multiple)
                    const note = itemsWithNotes[0]?.notes;
                    if (!note) return null;

                    return (
                      <div className="pt-4 border-t border-divider">
                        <p className="text-sm text-foreground-600">{note}</p>
                      </div>
                    );
                  })()}

                  {/* Chat Now Button */}
                  {(program ?? onChatNowClick) && (
                    <div className="pt-4 border-t border-divider">
                      <Button
                        fullWidth
                        variant="shadow"
                        color="primary"
                        radius="lg"
                        size="lg"
                        startContent={<MessageSquareShareIcon size={20} />}
                        className={gradientBorderButton()}
                        onPress={() => {
                          onClose();
                          if (onChatNowClick) {
                            onChatNowClick();
                          } else {
                            onChatOpen();
                          }
                        }}
                      >
                        Chat Now
                      </Button>
                    </div>
                  )}
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* Chat Dialog */}
      {program && selectedCycle && (
        <SignupDialog
          isOpen={isChatOpen}
          onOpenChange={onChatOpenChange}
          mode="lead"
          cycle={selectedCycle}
          program={program}
          whatsappNumber={whatsappNumber}
        />
      )}
    </>
  );
}
