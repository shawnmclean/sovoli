"use client";

import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
} from "@sovoli/ui/components/drawer";
import { DrawerHeader } from "@sovoli/ui/components/drawer";
import { NumberInput } from "@sovoli/ui/components/number-input";

import { Link } from "@sovoli/ui/components/link";
import {
  BookOpenIcon,
  HomeIcon,
  MenuIcon,
  PhoneIcon,
  UsersIcon,
  BriefcaseIcon,
  InfoIcon,
  ShoppingBagIcon,
  SquareMousePointerIcon,
  CalendarIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { tv } from "tailwind-variants";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Program, AgeEligibility } from "~/modules/academics/types";

const footerButton = tv({
  slots: {
    base: "flex flex-col items-center justify-center h-16 w-16 text-foreground-500",
    icon: "text-sm mt-2",
    text: "text-xs mt-0.5",
  },
  variants: {
    isSelected: {
      true: {
        base: "border-t-2 border-primary-500",
        icon: "text-primary-500",
        text: "text-primary-500",
      },
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

const drawerButton = tv({
  slots: {
    base: "flex flex-col items-center justify-center h-20 w-20 text-foreground-500",
    icon: "text-xl mb-2",
    text: "text-xs",
  },
});

const footerCTAButton = tv({
  slots: {
    container: "flex flex-col items-center justify-center -mt-3 mx-4",
    label: "text-xs mt-1 text-foreground-500",
  },
  variants: {
    isSelected: {
      true: {
        label: "text-primary-500",
      },
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

export interface MobileFooterProps {
  orgInstance: OrgInstance;
}

// Helper function to get age requirement from program
const getAgeRequirement = (program: Program): AgeEligibility | undefined => {
  const admission =
    program.admission ?? program.standardProgramVersion?.admission;
  return admission?.eligibility[0];
};

// Helper function to check if a child's age matches a program's age requirements
const isAgeEligible = (
  childAge: number,
  ageReq: AgeEligibility | undefined,
): boolean => {
  if (!ageReq?.ageRange) return true; // No age restrictions

  const { minAgeYears, maxAgeYears } = ageReq.ageRange;

  // If no minimum age specified, check only maximum
  if (minAgeYears === undefined) {
    return maxAgeYears === undefined || childAge <= maxAgeYears;
  }

  // If no maximum age specified, check only minimum
  if (maxAgeYears === undefined) {
    return childAge >= minAgeYears;
  }

  // Both min and max specified
  return childAge >= minAgeYears && childAge <= maxAgeYears;
};

// Helper function to find the best program for a specific age
const findBestProgramForAge = (
  childAge: number,
  programs: Program[],
): Program | null => {
  // First, find all programs that are eligible for this age
  const eligiblePrograms = programs.filter((program) => {
    const ageReq = getAgeRequirement(program);
    return isAgeEligible(childAge, ageReq);
  });

  if (eligiblePrograms.length === 0) {
    return null;
  }

  // If only one eligible program, return it
  if (eligiblePrograms.length === 1) {
    return eligiblePrograms[0] ?? null;
  }

  // If multiple eligible programs, find the best match based on age range specificity
  return eligiblePrograms.reduce((best, current) => {
    const bestAgeReq = getAgeRequirement(best);
    const currentAgeReq = getAgeRequirement(current);

    // Prefer programs with more specific age ranges
    const bestSpecificity = getAgeRangeSpecificity(bestAgeReq);
    const currentSpecificity = getAgeRangeSpecificity(currentAgeReq);

    if (currentSpecificity > bestSpecificity) {
      return current;
    }

    // If specificity is the same, prefer programs where the child's age is closer to the middle of the range
    const bestDistance = getAgeDistanceFromMiddle(childAge, bestAgeReq);
    const currentDistance = getAgeDistanceFromMiddle(childAge, currentAgeReq);

    return currentDistance < bestDistance ? current : best;
  });
};

// Helper function to calculate age range specificity (more specific = higher score)
const getAgeRangeSpecificity = (ageReq: AgeEligibility | undefined): number => {
  if (!ageReq?.ageRange) return 0;

  const { minAgeYears, maxAgeYears } = ageReq.ageRange;

  if (minAgeYears !== undefined && maxAgeYears !== undefined) {
    // Both min and max specified - most specific
    return 3;
  } else if (minAgeYears !== undefined || maxAgeYears !== undefined) {
    // Only one specified - moderately specific
    return 2;
  }

  return 1; // No age range - least specific
};

// Helper function to calculate how close an age is to the middle of a program's age range
const getAgeDistanceFromMiddle = (
  childAge: number,
  ageReq: AgeEligibility | undefined,
): number => {
  if (!ageReq?.ageRange) return 0;

  const { minAgeYears, maxAgeYears } = ageReq.ageRange;

  if (minAgeYears !== undefined && maxAgeYears !== undefined) {
    const middle = (minAgeYears + maxAgeYears) / 2;
    return Math.abs(childAge - middle);
  } else if (minAgeYears !== undefined) {
    // Only minimum age - prefer programs where child is closer to minimum
    return Math.abs(childAge - minAgeYears);
  } else if (maxAgeYears !== undefined) {
    // Only maximum age - prefer programs where child is closer to maximum
    return Math.abs(childAge - maxAgeYears);
  }

  return 0;
};

export function MobileFooter({ orgInstance }: MobileFooterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isAgeDrawerOpen,
    onOpen: onAgeDrawerOpen,
    onOpenChange: onAgeDrawerOpenChange,
  } = useDisclosure();
  const [childAge, setChildAge] = useState<number | null>(6);

  const footerButtonClasses = footerButton({
    isSelected: pathname === "/" || pathname === "",
  });
  const programsButtonClasses = footerButton({
    isSelected: pathname === "/programs",
  });
  const teamButtonClasses = footerButton({
    isSelected: pathname.startsWith("/workforce/people"),
  });
  const ctaButtonClasses = footerCTAButton({
    isSelected: pathname.startsWith("/programs/apply"),
  });
  const moreButtonClasses = footerButton();
  const drawerButtonClasses = drawerButton();

  // Process programs for age selection
  const programs = orgInstance.academicModule?.programs ?? [];

  const handleAgeChange = (value: number | null) => {
    setChildAge(value);
  };

  const handleAgeContinue = () => {
    if (childAge !== null) {
      // Find the best matching program for the child's age
      const bestMatch = findBestProgramForAge(childAge, programs);

      if (bestMatch) {
        // Navigate directly to the specific program page
        router.push(`/programs/${bestMatch.slug}`);
        onAgeDrawerOpenChange();
      } else {
        // Show message that no programs are available for this age
        alert(
          `No programs available for age ${childAge}. Please try a different age.`,
        );
      }
    }
  };

  const handleApplyClick = () => {
    if (programs.length > 0) {
      onAgeDrawerOpen();
    } else {
      // Fallback to direct navigation if no programs
      router.push("/programs/apply");
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-content1 shadow-lg pb-2 px-2 md:hidden z-40">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 justify-start gap-2">
          <Button
            as={Link}
            href="/"
            variant="light"
            color="default"
            size="sm"
            className={footerButtonClasses.base()}
          >
            <HomeIcon className={footerButtonClasses.icon()} />
            <span className={footerButtonClasses.text()}>Home</span>
          </Button>
          <Button
            as={Link}
            href="/programs"
            variant="light"
            color="default"
            size="sm"
            className={programsButtonClasses.base()}
          >
            <BookOpenIcon className={programsButtonClasses.icon()} />
            <span className={programsButtonClasses.text()}>Programs</span>
          </Button>
        </div>
        <div className="flex justify-center">
          <div className={ctaButtonClasses.container()}>
            <Button
              variant="shadow"
              color="primary"
              isIconOnly
              radius="md"
              size="lg"
              onPress={handleApplyClick}
            >
              <SquareMousePointerIcon className="text-xl" />
            </Button>
            <span className={ctaButtonClasses.label()}>Apply</span>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-2">
          <Button
            as={Link}
            href="/workforce/people"
            variant="light"
            color="default"
            size="sm"
            className={teamButtonClasses.base()}
          >
            <UsersIcon className={teamButtonClasses.icon()} />
            <span className={teamButtonClasses.text()}>Team</span>
          </Button>
          <Button
            onPress={onOpen}
            variant="light"
            color="default"
            size="sm"
            className={moreButtonClasses.base()}
          >
            <MenuIcon className={moreButtonClasses.icon()} />
            <span className={moreButtonClasses.text()}>More</span>
          </Button>
          <Drawer
            isOpen={isOpen}
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
              <DrawerBody>
                <div className="grid grid-cols-2 gap-6 p-6">
                  <Button
                    as={Link}
                    href="/contact"
                    variant="light"
                    color="default"
                    size="sm"
                    className={drawerButtonClasses.base()}
                    onPress={onOpenChange}
                  >
                    <PhoneIcon className={drawerButtonClasses.icon()} />
                    <span className={drawerButtonClasses.text()}>Contact</span>
                  </Button>
                  <Button
                    as={Link}
                    href="/workforce/positions"
                    variant="light"
                    color="default"
                    size="sm"
                    className={drawerButtonClasses.base()}
                    onPress={onOpenChange}
                  >
                    <BriefcaseIcon className={drawerButtonClasses.icon()} />
                    <span className={drawerButtonClasses.text()}>Jobs</span>
                  </Button>
                  <Button
                    as={Link}
                    href="/about"
                    variant="light"
                    color="default"
                    size="sm"
                    className={drawerButtonClasses.base()}
                    onPress={onOpenChange}
                  >
                    <InfoIcon className={drawerButtonClasses.icon()} />
                    <span className={drawerButtonClasses.text()}>About</span>
                  </Button>
                  <Button
                    as={Link}
                    href="/suppliers/student-supplies"
                    variant="light"
                    color="default"
                    size="sm"
                    className={drawerButtonClasses.base()}
                    onPress={onOpenChange}
                  >
                    <ShoppingBagIcon className={drawerButtonClasses.icon()} />
                    <span className={drawerButtonClasses.text()}>
                      Suppliers
                    </span>
                  </Button>
                </div>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Age Selection Drawer */}
      <Drawer
        isOpen={isAgeDrawerOpen}
        onOpenChange={onAgeDrawerOpenChange}
        placement="bottom"
        size="lg"
      >
        <DrawerContent>
          <DrawerHeader
            title="What is your child's age?"
            showBackButton
            onBackPress={() => onAgeDrawerOpenChange()}
          />
          <DrawerBody className="px-4 pb-6">
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground mb-4">
                Enter your child's age to see programs that are suitable for
                them.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    Child's Age
                  </span>
                </div>

                <NumberInput
                  value={childAge ?? undefined}
                  onValueChange={handleAgeChange}
                  min={0}
                  max={25}
                  step={1}
                  placeholder="Enter age in years"
                  className="w-full"
                  size="lg"
                />

                {childAge !== null && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {(() => {
                        const bestMatch = findBestProgramForAge(
                          childAge,
                          programs,
                        );
                        if (bestMatch) {
                          const programName =
                            bestMatch.name ??
                            bestMatch.standardProgramVersion?.program.name ??
                            "Program";
                          return `Recommended: ${programName}`;
                        } else {
                          return `No programs available for age ${childAge}`;
                        }
                      })()}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  color="primary"
                  fullWidth
                  onPress={handleAgeContinue}
                  isDisabled={childAge === null || childAge < 0}
                >
                  {(() => {
                    const bestMatch = findBestProgramForAge(
                      childAge ?? 0,
                      programs,
                    );
                    return bestMatch
                      ? "View Recommended Program"
                      : "View Programs";
                  })()}
                </Button>
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </footer>
  );
}
