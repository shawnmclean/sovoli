"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgeChatInput } from "~/modules/chat/components/ChatInput/AgeChatInput";
import type { AgeSelection } from "~/modules/chat/components/ChatInput/AgePickerDrawer";
import type { ProgramSuggestion } from "~/modules/chat/lib/getProgramSuggestions";

interface ProgramSuggestionsResponse {
  suggestions: ProgramSuggestion[];
}

type LoadingState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "not-found" }
  | { type: "found"; programName: string; countdown: number };

export function MobileSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    type: "idle",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParamOpen = searchParams.get("s") === "true";

  // Support both controlled state and URL param
  const drawerIsOpen = isOpen || urlParamOpen;

  const handleClose = () => {
    // Close controlled state
    setIsOpen(false);
    // Reset loading state
    setLoadingState({ type: "idle" });

    // If opened via URL param, remove it
    if (urlParamOpen) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("s");
      const newUrl = params.toString() ? `?${params.toString()}` : "";
      router.push(window.location.pathname + newUrl);
    }
  };

  const handleAgeSubmit = async (ageSelection: AgeSelection) => {
    console.log("Age selected:", ageSelection);

    // Set loading state
    setLoadingState({ type: "loading" });

    // Extract username from pathname (/w/[username]/...)
    const pathParts = window.location.pathname.split("/");
    const username = pathParts[2]; // /w/[username]/...

    // Calculate age in years (converting months to fractional years if needed)
    const ageInYears = ageSelection.years + ageSelection.months / 12;

    try {
      // Call the API to get program suggestions
      const response = await fetch("/api/programs/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          familyMembers: [
            {
              id: "temp-1",
              name: "Child",
              relationship: "child",
              age: Math.round(ageInYears),
            },
          ],
        }),
      });

      if (!response.ok) {
        console.error("Failed to fetch program suggestions");
        setLoadingState({ type: "not-found" });
        return;
      }

      const data = (await response.json()) as ProgramSuggestionsResponse;

      // Get the first suggested program
      const firstSuggestion = data.suggestions[0];
      const firstProgram = firstSuggestion?.programs[0];

      if (firstProgram?.slug && firstProgram.name) {
        // Start countdown from 3
        const programSlug = firstProgram.slug;
        const programName = firstProgram.name;

        setLoadingState({
          type: "found",
          programName,
          countdown: 3,
        });

        // Countdown: 3 -> 2 -> 1 -> navigate
        setTimeout(() => {
          setLoadingState({
            type: "found",
            programName,
            countdown: 2,
          });

          setTimeout(() => {
            setLoadingState({
              type: "found",
              programName,
              countdown: 1,
            });

            setTimeout(() => {
              router.push(`programs/${programSlug}`);
              setIsOpen(false);
              setLoadingState({ type: "idle" });
            }, 1000);
          }, 1000);
        }, 1000);
      } else {
        setLoadingState({ type: "not-found" });
      }
    } catch (error) {
      console.error("Error fetching program suggestions:", error);
      setLoadingState({ type: "not-found" });
    }
  };

  return (
    <>
      <div className="md:hidden flex-1">
        <Button
          onPress={() => setIsOpen(true)}
          variant="bordered"
          fullWidth
          className="w-full justify-start text-default-400 bg-default-100"
          startContent={<SearchIcon width={16} />}
        >
          What program fits your child?
        </Button>
      </div>
      <Drawer
        scrollBehavior="inside"
        isOpen={drawerIsOpen}
        onClose={handleClose}
        size="full"
        placement="bottom"
        backdrop="opaque"
        hideCloseButton
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
                showBackButton
                onBackPress={onClose}
                className="border-b border-divider"
              >
                <span className="text-lg font-semibold">Search</span>
              </DrawerHeader>

              <DrawerBody className="p-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-base font-medium mb-2">
                      How old is your child?
                    </h2>
                    <AgeChatInput
                      onSubmit={handleAgeSubmit}
                      isDisabled={loadingState.type !== "idle"}
                    />

                    {/* Loading states */}
                    {loadingState.type === "loading" && (
                      <div className="mt-4 p-3 bg-primary-50 text-primary-900 rounded-lg text-sm">
                        Finding the right program for your child...
                      </div>
                    )}

                    {loadingState.type === "not-found" && (
                      <div className="mt-4 p-3 bg-danger-50 text-danger-900 rounded-lg text-sm">
                        Sorry we don&apos;t have any programs for that age.
                      </div>
                    )}

                    {loadingState.type === "found" && (
                      <div className="mt-4 p-3 bg-success-50 text-success-900 rounded-lg text-sm">
                        We found the program:{" "}
                        <strong>{loadingState.programName}</strong>, redirecting
                        in {loadingState.countdown}...
                      </div>
                    )}
                  </div>
                </div>
              </DrawerBody>

              <DrawerFooter className="border-t border-divider p-4">
                <div className="text-sm text-default-500 text-center w-full">
                  Select an age to continue
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
