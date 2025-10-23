"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Alert } from "@sovoli/ui/components/alert";
import {
  PackageIcon,
  BookOpenIcon,
  DropletsIcon,
  ShirtIcon,
} from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import type { RequirementList } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { pluralize } from "~/utils/pluralize";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { CatalogMatch } from "../lib/getProgramRequirements";

interface SupplyListResultsProps {
  school: OrgInstance;
  program: {
    id: string;
    name?: string;
    standardProgramVersion?: {
      program: {
        name: string;
      };
    };
  };
  requirements: RequirementList[];
  matchedItems: CatalogMatch[];
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

export function SupplyListResults({
  school,
  program,
  requirements,
  matchedItems,
}: SupplyListResultsProps) {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {},
  );

  // Create a map of requirement items to catalog matches for easy lookup
  const itemMatches = useMemo(() => {
    const map = new Map<string, CatalogMatch>();
    matchedItems.forEach((match) => {
      map.set(match.requirementItem.item.id, match);
    });
    return map;
  }, [matchedItems]);

  // Initialize selected items with available catalog matches
  useMemo(() => {
    const initialSelections: Record<string, boolean> = {};
    requirements.forEach((requirement, reqIndex) => {
      requirement.items.forEach((item, itemIndex) => {
        const itemKey = `${reqIndex}-${itemIndex}`;
        const hasMatch = itemMatches.has(item.item.id);
        initialSelections[itemKey] = hasMatch;
      });
    });
    setSelectedItems(initialSelections);
  }, [requirements, itemMatches]);

  const handleItemSelect = (itemKey: string, isChecked: boolean) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemKey]: isChecked,
    }));
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalPrice = 0;
    let selectedItemCount = 0;

    requirements.forEach((requirement, reqIndex) => {
      requirement.items.forEach((item, itemIndex) => {
        const itemKey = `${reqIndex}-${itemIndex}`;
        const isSelected = selectedItems[itemKey];
        if (isSelected) {
          const match = itemMatches.get(item.item.id);
          if (match) {
            const price =
              match.catalogItem.price.GYD ?? match.catalogItem.price.USD ?? 0;
            totalPrice += price * (item.quantity ?? 1);
            selectedItemCount++;
          }
        }
      });
    });

    return { totalPrice, selectedItemCount };
  };

  const { totalPrice, selectedItemCount } = calculateTotals();

  // Generate WhatsApp message with selected items
  const generateWhatsAppMessage = () => {
    const programName =
      program.name ?? program.standardProgramVersion?.program.name;
    let message = `Hi! I'm interested in purchasing school supplies for *${school.org.name} - ${programName}*.\n\n`;

    const selectedItemsList: { item: string; quantity: number }[] = [];

    requirements.forEach((requirement, reqIndex) => {
      requirement.items.forEach((item, itemIndex) => {
        const itemKey = `${reqIndex}-${itemIndex}`;
        const isSelected = selectedItems[itemKey];
        if (isSelected) {
          selectedItemsList.push({
            item: item.item.name,
            quantity: item.quantity ?? 1,
          });
        }
      });
    });

    selectedItemsList.forEach(({ item, quantity }) => {
      message += `• ${quantity}x ${item}\n`;
    });

    message += `\nPlease let me know about availability and pricing. Thank you!`;

    return message;
  };

  // Get WhatsApp number from the current organization
  const getWhatsAppNumber = () => {
    const location = school.org.locations[0];

    if (location?.contacts) {
      const whatsappContact = location.contacts.find(
        (contact) => contact.type === "whatsapp",
      );
      return whatsappContact?.value ?? null;
    }

    return null;
  };

  if (requirements.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center py-16 sm:py-24">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-medium text-foreground mb-2">
              No requirements found
            </h3>
            <p className="text-muted-foreground">
              This program doesn't have any supply requirements listed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="space-y-4 pb-20">
        {requirements.map((requirement, reqIndex) => {
          // Calculate category totals
          const categoryTotal = requirement.items.reduce(
            (total, item, itemIndex) => {
              const itemKey = `${reqIndex}-${itemIndex}`;
              const isSelected = selectedItems[itemKey];
              if (isSelected) {
                const match = itemMatches.get(item.item.id);
                if (match) {
                  const price =
                    match.catalogItem.price.GYD ??
                    match.catalogItem.price.USD ??
                    0;
                  return total + price * (item.quantity ?? 1);
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
                  const match = itemMatches.get(item.item.id);
                  const isSelected = selectedItems[itemKey];

                  return (
                    <div
                      key={itemIndex}
                      className="border-b border-divider/20 pb-2 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground mb-2">
                          {item.quantity &&
                            item.quantity > 1 &&
                            `${item.quantity}x `}
                          {item.item.name}
                        </h4>
                        {match && (
                          <Checkbox
                            isSelected={isSelected}
                            onValueChange={(isChecked) =>
                              handleItemSelect(itemKey, isChecked)
                            }
                          />
                        )}
                      </div>

                      {match ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground-600">
                            GYD{" "}
                            {match.catalogItem.price.GYD?.toLocaleString() ??
                              match.catalogItem.price.USD?.toLocaleString()}
                          </span>
                          <Link
                            href={`/catalog/${match.catalogItem.id}`}
                            className="text-xs text-primary hover:text-primary/80 transition-colors underline"
                          >
                            Available
                          </Link>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground-500">
                          Not available in catalog
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Info alert about pricing */}
        <Alert color="primary" variant="flat" hideIcon>
          Prices shown are provided by suppliers and are for reference only.
        </Alert>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-divider p-4 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-lg font-semibold text-foreground">
                  Total GYD {totalPrice.toLocaleString()}
                </div>
                <div className="text-sm text-foreground-600">
                  {selectedItemCount} {pluralize(selectedItemCount, "item")}{" "}
                  selected
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {getWhatsAppNumber() && (
                <Button
                  as={WhatsAppLink}
                  phoneNumber={getWhatsAppNumber() ?? ""}
                  message={generateWhatsAppMessage()}
                  className="flex-1"
                  intent="Purchase"
                  page="requirements"
                  orgId={school.org.username}
                  orgName={school.org.name}
                  startContent={<SiWhatsapp size={16} />}
                  color="success"
                >
                  Order Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
