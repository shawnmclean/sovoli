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

interface Supplier {
  name: string;
  price: number;
}

// Mock suppliers
const SUPPLIERS = ["Creative Thinking Stationery Hub", "R&A Stationary"];

// Function to generate random supplier data for an item
function generateSupplierData(): Supplier[] {
  const numSuppliers = Math.floor(Math.random() * 3); // 0, 1, or 2 suppliers
  const suppliers: Supplier[] = [];

  for (let i = 0; i < numSuppliers; i++) {
    const randomSupplier =
      SUPPLIERS[Math.floor(Math.random() * SUPPLIERS.length)];
    const price = Math.floor(Math.random() * 200) + 10; // Random price between $10-$210

    // Avoid duplicate suppliers for the same item
    if (randomSupplier && !suppliers.some((s) => s.name === randomSupplier)) {
      suppliers.push({
        name: randomSupplier,
        price: price,
      });
    }
  }

  // Sort by price (lowest first)
  return suppliers.sort((a, b) => a.price - b.price);
}

interface RequirementsDetailsProps {
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

export function RequirementsDetails({ program }: RequirementsDetailsProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<
    Record<string, string>
  >({});
  const [initialized, setInitialized] = useState(false);
  const [mockSupplierData, setMockSupplierData] = useState<
    Record<string, Supplier[]>
  >({});
  const [showSuppliers, setShowSuppliers] = useState(false);

  const requirements = useMemo(
    () =>
      program.requirements ??
      program.standardProgramVersion?.requirements ??
      [],
    [program.requirements, program.standardProgramVersion?.requirements],
  );

  const programName =
    program.name ?? program.standardProgramVersion?.program.name;

  useEffect(() => {
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "requirements",
    });
  }, [program]);

  // Initialize and generate stable mock data
  useEffect(() => {
    if (!initialized && requirements.length > 0) {
      const initialSelections: Record<string, string> = {};
      const mockData: Record<string, Supplier[]> = {};

      requirements.forEach((requirement, reqIndex) => {
        requirement.items.forEach((item, itemIndex) => {
          const itemKey = `${reqIndex}-${itemIndex}`;
          const suppliers = generateSupplierData();

          // Store the mock data for this item
          mockData[itemKey] = suppliers;

          // Select the cheapest supplier (first one since they're sorted by price)
          // If there's only one supplier, select it; if multiple, select the cheapest
          if (suppliers.length > 0) {
            initialSelections[itemKey] = suppliers[0]?.name ?? "";
          } else {
            initialSelections[itemKey] = "";
          }
        });
      });

      setMockSupplierData(mockData);
      setSelectedSuppliers(initialSelections);
      setInitialized(true);
    }
  }, [requirements, initialized]);

  const handleViewSuppliers = () => {
    trackProgramAnalytics("ViewSuppliers", program, null, {
      section: "requirements",
    });
    setShowFeedback(true);
    setButtonPressed(true);
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
          // Use stored mock data instead of generating new data
          const suppliers = mockSupplierData[itemKey] ?? [];
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
  if (requirements.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-4 pb-20">
        <h1 className="text-2xl font-semibold text-foreground">
          What to bring for {programName}
        </h1>

        {requirements.map((requirement: RequirementList, reqIndex: number) => {
          // Calculate category totals
          const categoryTotal = requirement.items.reduce(
            (total, item, itemIndex) => {
              const itemKey = `${reqIndex}-${itemIndex}`;
              const selectedSupplier = selectedSuppliers[itemKey];
              if (selectedSupplier) {
                const suppliers = mockSupplierData[itemKey] ?? [];
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
                {showSuppliers && (
                  <div className="text-sm text-foreground-500">
                    GYD {categoryTotal}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {requirement.items.map((item, itemIndex) => {
                  const itemKey = `${reqIndex}-${itemIndex}`;
                  const suppliers = mockSupplierData[itemKey] ?? [];
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
                            {suppliers.map((supplier, supplierIndex) => (
                              <Checkbox
                                key={supplierIndex}
                                isSelected={selectedSupplier === supplier.name}
                                onValueChange={(isChecked) =>
                                  handleSupplierSelect(
                                    itemKey,
                                    supplier.name,
                                    isChecked,
                                  )
                                }
                                className="hover:bg-muted/30 rounded p-2 -m-2"
                              >
                                <span className="text-sm text-foreground-600">
                                  ${supplier.price} - {supplier.name}
                                </span>
                              </Checkbox>
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
        })}
      </div>

      {/* Toggle for mock pricing */}
      <div className="pb-20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Switch
            isSelected={showSuppliers}
            onValueChange={setShowSuppliers}
            size="sm"
          >
            <span className="text-sm text-foreground-600">
              {showSuppliers ? "Hide mock pricing" : "Show mock pricing"}
            </span>
          </Switch>
          <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full font-medium">
            MOCK
          </span>
        </div>

        {showSuppliers && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>⚠️ Mock Data:</strong> All prices and suppliers shown are
              for demonstration purposes only. No real purchases can be made
              through this interface.
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-divider p-4 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {showSuppliers && (
                <div>
                  <div className="text-lg font-semibold text-foreground">
                    Total GYD {totalPrice}
                  </div>
                  <div className="text-sm text-foreground-600">
                    from {supplierCount} supplier
                    {supplierCount !== 1 ? "s" : ""}
                  </div>
                </div>
              )}
            </div>
            <div>
              {!buttonPressed && (
                <Button onPress={handleViewSuppliers} variant="solid">
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Shop Now
                </Button>
              )}
            </div>
          </div>

          {/* Feedback message */}
          {showFeedback && (
            <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm text-success text-center">
                Thanks for your interest! We're working on integrating with
                these suppliers.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
