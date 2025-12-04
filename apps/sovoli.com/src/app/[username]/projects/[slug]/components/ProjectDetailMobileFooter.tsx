"use client";

import { Button } from "@sovoli/ui/components/button";
import { gradientBorderButton } from "~/components/GradientBorderButton";
import type { Project } from "~/modules/projects/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { MessageSquareShareIcon, ShoppingCartIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { config } from "~/utils/config";
import { useProjectCart } from "../context/ProjectCartContext";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@sovoli/ui/components/drawer";
import { useState } from "react";

export interface ProjectDetailMobileFooterProps {
  orgInstance: OrgInstance;
  project: Project;
  username: string;
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()} JMD`;
}

export function ProjectDetailMobileFooter({
  orgInstance,
  project,
  username,
}: ProjectDetailMobileFooterProps) {
  const { items, totalItems, totalCost, itemCount } = useProjectCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const whatsappMessage = `Hi Sovoli team, I'd like to pledge supplies for ${project.title} at ${orgInstance.org.name}.`;

  const generateCartWhatsAppMessage = () => {
    const itemLines = Object.values(items).map(
      (item) =>
        `• ${item.quantity} ${item.unit}s of ${item.name} (${formatCurrency(item.totalCost)})`,
    );

    return `Hi Sovoli team, I'd like to pledge supplies for ${project.title} at ${orgInstance.org.name}:

${itemLines.join("\n")}

Total Value: ${formatCurrency(totalCost)}`;
  };

  return (
    <>
      <footer className="fixed left-0 right-0 border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40 [bottom:max(0px,calc(100dvh-100vh))]">
        <div className="flex w-full items-center justify-between py-3 gap-4">
          {itemCount > 0 ? (
            <>
              <div
                className="flex flex-1 items-center min-w-0"
                onClick={() => setIsDrawerOpen(true)}
              >
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <ShoppingCartIcon className="h-6 w-6 text-primary" />
                    <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                      {totalItems}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">
                      {formatCurrency(totalCost)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {itemCount} items selected
                    </span>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <Button
                  variant="shadow"
                  color="primary"
                  radius="lg"
                  size="md"
                  onPress={() => setIsDrawerOpen(true)}
                  className={gradientBorderButton()}
                >
                  View Cart
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-1 items-center min-w-0">
                <p className="text-sm font-medium text-foreground truncate"></p>
              </div>
              <div className="shrink-0">
                <Button
                  as={WhatsAppLink}
                  phoneNumber={config.contact.whatsapp}
                  message={whatsappMessage}
                  variant="shadow"
                  color="primary"
                  radius="lg"
                  size="md"
                  startContent={<MessageSquareShareIcon size={16} />}
                  className={gradientBorderButton()}
                  event="Contact"
                  eventProperties={{
                    source: "project-details-mobile-footer",
                    project_id: project.id,
                    org_username: username,
                    cta_type: "contribute",
                  }}
                >
                  Contribute
                </Button>
              </div>
            </>
          )}
        </div>
      </footer>

      <Drawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        placement="bottom"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Cart Summary
              </DrawerHeader>
              <DrawerBody>
                <div className="space-y-4">
                  {Object.values(items).map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b border-divider last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} {item.unit}s ×{" "}
                          {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="text-right font-semibold text-sm">
                        {formatCurrency(item.totalCost)}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-4 border-t border-divider">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-primary">
                      {formatCurrency(totalCost)}
                    </span>
                  </div>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  as={WhatsAppLink}
                  phoneNumber={config.contact.whatsapp}
                  message={generateCartWhatsAppMessage()}
                  color="primary"
                  startContent={<MessageSquareShareIcon size={18} />}
                  event="Contact"
                  eventProperties={{
                    source: "project-cart-drawer",
                    project_id: project.id,
                    org_username: username,
                    cta_type: "checkout",
                    cart_value: totalCost,
                    item_count: itemCount,
                  }}
                >
                  Pledge via WhatsApp
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
