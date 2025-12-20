"use client";

import { useProgramCycleSelection } from "../../../context/ProgramCycleSelectionContext";
import { Button } from "@sovoli/ui/components/button";
import {
  DrawerContent,
  DrawerHeader as DrawerHeaderComponent,
  DrawerBody as DrawerBodyComponent,
} from "@sovoli/ui/components/drawer";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { ProgramPriceCard } from "~/app/(tenants)/w/[username]/(main-layout)/programs/components/ProgramPriceCard";
import type { PricingItem } from "~/modules/core/economics/types";
import { PaymentPlan } from "../../PaymentPlan";
import { MessageSquareShareIcon } from "lucide-react";
import { gradientBorderButton } from "~/components/GradientBorderButton";
import { getWhatsAppContact } from "~/utils/whatsappUtils";
import { SignupDialog } from "~/modules/auth/components/SignupDialog";
import { SubscribeProgramButton } from "../../SubscribeProgramButton";
import { ShareButton } from "~/app/[username]/(profile)/components/OrgNavbar/ShareButton";

interface PriceDetailsProps {
  orgInstance: OrgInstance;
  program: Program;
  defaultCycle?: ProgramCycle;
  onChatNowClick?: () => void;
}

export function PriceDetails({
  orgInstance,
  program,
  defaultCycle,
  onChatNowClick,
}: PriceDetailsProps) {
  const { selectedCycle } = useProgramCycleSelection();
  const {
    isOpen: isChatOpen,
    onOpen: onChatOpen,
    onOpenChange: onChatOpenChange,
  } = useDisclosure();

  const whatsappNumber = getWhatsAppContact(orgInstance);

  // Use selected cycle if available, otherwise fall back to default cycle
  const cycleToUse = selectedCycle ?? defaultCycle;

  if (!cycleToUse) {
    return null;
  }

  const startDate =
    cycleToUse.academicCycle.startDate ??
    cycleToUse.academicCycle.globalCycle?.startDate;

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

  return (
    <>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeaderComponent
              showBackButton
              onBackPress={onClose}
              endContent={
                <>
                  <ShareButton
                    title="Share"
                    variant="light"
                    text={`Check out ${program.name} pricing.`}
                  />
                  <SubscribeProgramButton program={program} variant="light" />
                </>
              }
            />
            <DrawerBodyComponent>
              <div className="space-y-6 pb-20">
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
              </div>

              {/* Fixed Footer with Chat Now Button */}
              <div className="fixed bottom-0 left-0 right-0 border-t border-divider p-4 z-50 bg-background/95 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto">
                  <Button
                    fullWidth
                    variant="shadow"
                    color="primary"
                    radius="full"
                    size="lg"
                    startContent={<MessageSquareShareIcon size={20} />}
                    className={gradientBorderButton()}
                    onPress={() => {
                      if (onChatNowClick) {
                        onClose();
                        onChatNowClick();
                      } else {
                        onChatOpen();
                      }
                    }}
                  >
                    Chat Now
                  </Button>
                </div>
              </div>
            </DrawerBodyComponent>
          </>
        )}
      </DrawerContent>

      {/* Chat Dialog */}
      <SignupDialog
        isOpen={isChatOpen}
        onOpenChange={onChatOpenChange}
        mode="lead"
        cycle={cycleToUse}
        program={program}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
