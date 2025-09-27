"use client";

import {
  PackageIcon,
  BookOpenIcon,
  DropletsIcon,
  ShirtIcon,
  ShoppingCartIcon,
} from "lucide-react";
import type { Program, RequirementList } from "~/modules/academics/types";
import { trackProgramAnalytics } from "../../lib/programAnalytics";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Switch } from "@sovoli/ui/components/switch";
import { Alert } from "@sovoli/ui/components/alert";
import {
  Drawer,
  DrawerContent as DrawerContentComponent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@sovoli/ui/components/drawer";
import {
  DrawerContent,
  DrawerHeader as DrawerHeaderComponent,
  DrawerBody as DrawerBodyComponent,
} from "@sovoli/ui/components/drawer";
import { SubscribeProgramButton } from "../SubscribeProgramButton";
import { ShareButton } from "~/app/orgs/[username]/(profile)/components/OrgNavbar/ShareButton";
import type { OrgInstance } from "~/modules/organisations/types";
import { ORGS } from "~/modules/data/organisations";
import { pluralize } from "~/utils/pluralize";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";

interface Supplier {
  name: string;
  price: number;
  org: OrgInstance;
}

// Function to get supplier data for an item from recommended suppliers
function getSupplierDataForItem(
  itemId: string,
  recommendedSuppliers: OrgInstance[],
): Supplier[] {
  const suppliers: Supplier[] = [];

  recommendedSuppliers.forEach((supplierOrg) => {
    // Check if this supplier has a catalog module
    if (supplierOrg.catalogModule?.items) {
      // Find the item in the supplier's catalog
      const catalogItem = supplierOrg.catalogModule.items.find(
        (catalogItem) => catalogItem.id === itemId,
      );

      if (catalogItem) {
        // Use GYD pricing if available, otherwise USD
        const price = catalogItem.price.GYD ?? catalogItem.price.USD ?? 0;

        suppliers.push({
          name: supplierOrg.org.name,
          price: price,
          org: supplierOrg,
        });
      }
    }
  });

  // Sort by price (lowest first)
  return suppliers.sort((a, b) => a.price - b.price);
}

interface RequirementsDetailsProps {
  orgInstance: OrgInstance;
  program: Program;
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "booklist":
      return <BookOpenIcon className="h-4 w-4" />;
    case "materials":
      return <PackageIcon className="h-4 w-4" />;
    case "hygiene":
      return <DropletsIcon className="h-4 w-4" />;
    case "uniform":
      return <ShirtIcon className="h-4 w-4" />;
    default:
      return <PackageIcon className="h-4 w-4" />;
  }
}

export function RequirementsDetails({
  orgInstance,
  program,
}: RequirementsDetailsProps) {
  const [selectedSuppliers, setSelectedSuppliers] = useState<
    Record<string, string>
  >({});
  const [initialized, setInitialized] = useState(false);
  const [supplierData, setSupplierData] = useState<Record<string, Supplier[]>>(
    {},
  );
  const [showSuppliers, setShowSuppliers] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSuppliersForDrawer, setSelectedSuppliersForDrawer] = useState<
    Supplier[]
  >([]);

  const requirements = useMemo(() => {
    const rawRequirements =
      program.requirements ??
      program.standardProgramVersion?.requirements ??
      [];

    // Filter out items that don't exist in the items database
    return rawRequirements
      .map((requirement) => ({
        ...requirement,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-optional-chain
        items: requirement.items.filter((item) => item.item && item.item.id),
      }))
      .filter((requirement) => requirement.items.length > 0);
  }, [program.requirements, program.standardProgramVersion?.requirements]);

  const programName =
    program.name ?? program.standardProgramVersion?.program.name;

  useEffect(() => {
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "requirements",
    });
  }, [program]);

  // Initialize supplier data from recommended suppliers
  useEffect(() => {
    if (!initialized && requirements.length > 0) {
      const initialSelections: Record<string, string> = {};
      const supplierDataMap: Record<string, Supplier[]> = {};

      // Get recommended suppliers from the organization
      const recommendedSuppliers =
        orgInstance.org.supplierRecommendations
          ?.map((rec) => {
            // Find the full OrgInstance for each supplier
            const fullSupplierOrg = ORGS.find(
              (org) => org.org.username === rec.org.username,
            );
            return fullSupplierOrg;
          })
          .filter((org): org is OrgInstance => org !== undefined) ?? [];

      requirements.forEach((requirement, reqIndex) => {
        requirement.items.forEach((item, itemIndex) => {
          const itemKey = `${reqIndex}-${itemIndex}`;
          const suppliers = getSupplierDataForItem(
            item.item.id,
            recommendedSuppliers,
          );

          // Store the supplier data for this item
          supplierDataMap[itemKey] = suppliers;

          // Select the cheapest supplier (first one since they're sorted by price)
          // If there's only one supplier, select it; if multiple, select the cheapest
          if (suppliers.length > 0) {
            initialSelections[itemKey] = suppliers[0]?.name ?? "";
          } else {
            initialSelections[itemKey] = "";
          }
        });
      });

      setSupplierData(supplierDataMap);
      setSelectedSuppliers(initialSelections);
      setInitialized(true);
    }
  }, [requirements, initialized, orgInstance.org.supplierRecommendations]);

  const handleViewSuppliers = () => {
    trackProgramAnalytics("ViewSuppliers", program, null, {
      section: "requirements",
    });
    handleShowSupplierDetails();
  };

  const handleSupplierSelect = (
    itemKey: string,
    supplierName: string,
    isChecked: boolean,
  ) => {
    setSelectedSuppliers((prev) => {
      if (isChecked) {
        // If checking a supplier, uncheck any other supplier for this item
        return {
          ...prev,
          [itemKey]: supplierName,
        };
      } else {
        // If unchecking, clear the selection for this item
        return {
          ...prev,
          [itemKey]: "",
        };
      }
    });
  };

  const handleShowSupplierDetails = () => {
    // Collect all selected suppliers
    const selectedSuppliersList: Supplier[] = [];
    const uniqueSuppliers = new Set<string>();

    requirements.forEach((requirement, reqIndex) => {
      requirement.items.forEach((item, itemIndex) => {
        const itemKey = `${reqIndex}-${itemIndex}`;
        const selectedSupplierName = selectedSuppliers[itemKey];
        if (selectedSupplierName) {
          const suppliers = supplierData[itemKey] ?? [];
          const supplier = suppliers.find(
            (s) => s.name === selectedSupplierName,
          );
          if (supplier && !uniqueSuppliers.has(supplier.name)) {
            selectedSuppliersList.push(supplier);
            uniqueSuppliers.add(supplier.name);
          }
        }
      });
    });

    setSelectedSuppliersForDrawer(selectedSuppliersList);
    setDrawerOpen(true);
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalPrice = 0;
    let supplierCount = 0;
    const uniqueSuppliers = new Set<string>();

    requirements.forEach((requirement, reqIndex) => {
      requirement.items.forEach((item, itemIndex) => {
        const itemKey = `${reqIndex}-${itemIndex}`;
        const selectedSupplier = selectedSuppliers[itemKey];
        if (selectedSupplier) {
          // Use stored supplier data
          const suppliers = supplierData[itemKey] ?? [];
          const supplier = suppliers.find((s) => s.name === selectedSupplier);
          if (supplier) {
            totalPrice += supplier.price * (item.quantity ?? 1);
            uniqueSuppliers.add(selectedSupplier);
          }
        }
      });
    });

    supplierCount = uniqueSuppliers.size;
    return { totalPrice, supplierCount };
  };

  const { totalPrice, supplierCount } = calculateTotals();

  // Generate WhatsApp message with selected items
  const generateWhatsAppMessage = () => {
    const programName =
      program.name ?? program.standardProgramVersion?.program.name;
    let message = `Hi! I'm interested in purchasing school supplies for *${orgInstance.org.name} - ${programName}*.\n\n`;

    const itemsBySupplier: Record<
      string,
      { item: string; quantity: number }[]
    > = {};

    requirements.forEach((requirement, reqIndex) => {
      requirement.items.forEach((item, itemIndex) => {
        const itemKey = `${reqIndex}-${itemIndex}`;
        const selectedSupplier = selectedSuppliers[itemKey];
        if (selectedSupplier) {
          const suppliers = supplierData[itemKey] ?? [];
          const supplier = suppliers.find((s) => s.name === selectedSupplier);
          if (supplier) {
            if (!itemsBySupplier[supplier.name]) {
              itemsBySupplier[supplier.name] = [];
            }
            itemsBySupplier[supplier.name]?.push({
              item: item.item.name,
              quantity: item.quantity ?? 1,
            });
          }
        }
      });
    });

    Object.entries(itemsBySupplier).forEach(([_, items]) => {
      items.forEach(({ item, quantity }) => {
        message += `• ${quantity}x ${item}\n`;
      });
      message += `\n`;
    });

    message += `Please let me know about availability and pricing. Thank you!`;

    return message;
  };

  // Get WhatsApp number from the first selected supplier
  const getWhatsAppNumber = () => {
    if (selectedSuppliersForDrawer.length === 0) return null;

    const firstSupplier = selectedSuppliersForDrawer[0];
    if (!firstSupplier) return null;

    const location = firstSupplier.org.org.locations[0];

    if (location?.contacts) {
      const whatsappContact = location.contacts.find(
        (contact) => contact.type === "whatsapp",
      );
      return whatsappContact?.value ?? null;
    }

    return null;
  };

  if (requirements.length === 0) {
    return null;
  }

  return (
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
                  text={`Check out ${program.name} requirements.`}
                />
                <SubscribeProgramButton program={program} variant="light" />
              </>
            }
          />
          <DrawerBodyComponent>
            <div className="space-y-4 pb-20">
              <h1 className="text-2xl font-semibold text-foreground">
                What to bring for {programName}
              </h1>

              {/* Toggle for supplier pricing */}
              <div className="pb-2">
                <div className="flex items-center justify-end gap-2">
                  <Switch
                    isSelected={showSuppliers}
                    onValueChange={setShowSuppliers}
                    size="sm"
                  >
                    <span className="text-sm text-foreground-600">
                      {showSuppliers ? "Show Price" : "Hide Price"}
                    </span>
                  </Switch>
                </div>
              </div>

              {requirements.map(
                (requirement: RequirementList, reqIndex: number) => {
                  // Calculate category totals
                  const categoryTotal = requirement.items.reduce(
                    (total, item, itemIndex) => {
                      const itemKey = `${reqIndex}-${itemIndex}`;
                      const selectedSupplier = selectedSuppliers[itemKey];
                      if (selectedSupplier) {
                        const suppliers = supplierData[itemKey] ?? [];
                        const supplier = suppliers.find(
                          (s) => s.name === selectedSupplier,
                        );
                        if (supplier) {
                          return total + supplier.price * (item.quantity ?? 1);
                        }
                      }
                      return total;
                    },
                    0,
                  );

                  const itemCount = requirement.items.length;

                  return (
                    <div key={reqIndex} className="pb-4 mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-3 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(requirement.category)}
                          <h3 className="text-lg font-semibold text-foreground">
                            {itemCount} {requirement.name}
                          </h3>
                        </div>
                        <div className="text-sm text-foreground-500">
                          GYD {categoryTotal.toLocaleString()}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {requirement.items.map((item, itemIndex) => {
                          const itemKey = `${reqIndex}-${itemIndex}`;
                          const suppliers = supplierData[itemKey] ?? [];
                          const selectedSupplier = selectedSuppliers[itemKey];

                          return (
                            <div
                              key={itemIndex}
                              className="border-b border-divider/20 pb-2 last:border-b-0"
                            >
                              <h4 className="font-medium text-foreground mb-2">
                                {item.quantity &&
                                  item.quantity > 1 &&
                                  `${item.quantity}x `}
                                {item.item.name}
                              </h4>

                              {showSuppliers ? (
                                suppliers.length > 0 ? (
                                  <div className="space-y-1">
                                    {suppliers.map((supplier) => (
                                      <div className="flex items-center gap-2 hover:bg-muted/30 rounded p-2 -m-2">
                                        <Checkbox
                                          isSelected={
                                            selectedSupplier === supplier.name
                                          }
                                          onValueChange={(isChecked) =>
                                            handleSupplierSelect(
                                              itemKey,
                                              supplier.name,
                                              isChecked,
                                            )
                                          }
                                        >
                                          <span className="text-sm text-foreground-600">
                                            GYD{" "}
                                            {supplier.price.toLocaleString()} -
                                          </span>
                                        </Checkbox>
                                        <span className="truncate max-w-[200px] text-sm text-foreground-600">
                                          {supplier.name}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-foreground-500">
                                    No suppliers available
                                  </p>
                                )
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                },
              )}
              {/* Info alert about pricing */}

              <Alert color="primary" variant="flat" hideIcon>
                Prices shown are provided by suppliers and are for reference
                only.
              </Alert>
            </div>

            <div className="fixed bottom-0 left-0 right-0 border-t border-divider p-4 z-50 bg-background/95 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <button
                        onClick={handleShowSupplierDetails}
                        className="text-lg font-semibold text-foreground hover:text-primary-600 transition-colors cursor-pointer"
                      >
                        Total GYD {totalPrice.toLocaleString()}
                      </button>
                      <div className="text-sm text-foreground-600">
                        from {supplierCount}{" "}
                        {pluralize(supplierCount, "supplier")}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button onPress={handleViewSuppliers} variant="solid">
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DrawerBodyComponent>

          {/* Supplier Details Drawer */}
          <Drawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            placement="bottom"
            size="lg"
          >
            <DrawerContentComponent>
              <DrawerHeader>
                <h3 className="text-lg font-semibold">Recommended Suppliers</h3>
              </DrawerHeader>
              <DrawerBody>
                <div className="space-y-6">
                  {selectedSuppliersForDrawer.map((supplier, index) => (
                    <div
                      key={index}
                      className="border-b border-divider pb-4 last:border-b-0"
                    >
                      <div className="space-y-3">
                        <div>
                          <p className="text-base text-foreground font-medium">
                            {supplier.name}
                          </p>
                        </div>
                        {supplier.org.org.locations.length > 0 && (
                          <div>
                            <p className="text-base text-foreground">
                              {supplier.org.org.locations[0]?.address.line1 &&
                                `${supplier.org.org.locations[0].address.line1}, `}
                              {supplier.org.org.locations[0]?.address.line2 &&
                                `${supplier.org.org.locations[0].address.line2}, `}
                              {supplier.org.org.locations[0]?.address.city &&
                                `${supplier.org.org.locations[0].address.city}, `}
                              {
                                supplier.org.org.locations[0]?.address
                                  .countryCode
                              }
                            </p>
                          </div>
                        )}
                        {supplier.org.org.locations[0]?.contacts &&
                          supplier.org.org.locations[0].contacts.length > 0 && (
                            <div>
                              <div className="space-y-1">
                                {supplier.org.org.locations[0].contacts.map(
                                  (contact, contactIndex) => (
                                    <p
                                      key={contactIndex}
                                      className="text-base text-foreground"
                                    >
                                      {contact.type === "phone" && "📞 "}
                                      {contact.type === "email" && "📧 "}
                                      {contact.type === "whatsapp" && "💬 "}
                                      {contact.value}
                                    </p>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                  {selectedSuppliersForDrawer.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-foreground-600">
                        No suppliers selected
                      </p>
                    </div>
                  )}
                </div>
              </DrawerBody>
              <DrawerFooter>
                <div className="flex gap-2">
                  {getWhatsAppNumber() && (
                    <Button
                      as={WhatsAppLink}
                      phoneNumber={getWhatsAppNumber() ?? ""}
                      message={generateWhatsAppMessage()}
                      className="flex-1"
                      intent="Purchase"
                      page="requirements"
                      orgId={orgInstance.org.username}
                      orgName={orgInstance.org.name}
                      supplierName={selectedSuppliersForDrawer[0]?.name}
                      startContent={<SiWhatsapp size={16} />}
                    >
                      Get Quote
                    </Button>
                  )}
                </div>
              </DrawerFooter>
            </DrawerContentComponent>
          </Drawer>
        </>
      )}
    </DrawerContent>
  );
}
