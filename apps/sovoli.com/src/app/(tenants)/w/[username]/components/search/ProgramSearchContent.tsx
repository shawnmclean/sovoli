"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { AgeChatInput } from "~/modules/chat/components/ChatInput/AgeChatInput";
import type { AgeSelection } from "~/modules/chat/components/ChatInput/AgePickerDrawer";
import type { ProgramSuggestion } from "~/modules/chat/lib/getProgramSuggestions";
import { useTenant } from "../TenantProvider";
import { ProgramSearchItem } from "../navbar/ProgramSearchItem";

interface ProgramSuggestionsResponse {
  suggestions: ProgramSuggestion[];
}

type LoadingState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "not-found" }
  | {
      type: "found";
      programs: {
        id: string;
        slug: string;
        name: string;
        ageRange?: string;
        imageUrl?: string;
      }[];
    };

interface ProgramSearchContentProps {
  onSearchStart?: () => void;
  onSearchComplete?: (programsFound: number) => void;
  source?: "mobile_drawer" | "search_page";
}

export function ProgramSearchContent({
  onSearchStart,
  onSearchComplete,
  source = "search_page",
}: ProgramSearchContentProps) {
  const { tenant } = useTenant();
  const [loadingState, setLoadingState] = useState<LoadingState>({
    type: "idle",
  });
  const hasTrackedRef = useRef(false);

  // Track when search is opened (only once)
  useEffect(() => {
    if (!hasTrackedRef.current) {
      posthog.capture("mobile_search_opened", {
        source,
      });
      hasTrackedRef.current = true;
    }
  }, [source]);

  useEffect(() => {
    if (loadingState.type === "found") {
      onSearchComplete?.(loadingState.programs.length);
    } else if (loadingState.type === "not-found") {
      onSearchComplete?.(0);
    }
  }, [loadingState, onSearchComplete]);

  const handleAgeSubmit = async (ageSelection: AgeSelection) => {
    console.log("Age selected:", ageSelection);

    onSearchStart?.();

    // Set loading state
    setLoadingState({ type: "loading" });

    // Calculate age in years (converting months to fractional years if needed)
    const ageInYears = ageSelection.years + ageSelection.months / 12;

    // Track search attempt
    posthog.capture("Search", {
      // This param is needed for Meta CAPI
      search_string:
        ageSelection.years + " years " + ageSelection.months + " months",
      tenant,
    });

    try {
      // Call the API to get program suggestions
      // Note: tenant is automatically extracted by middleware from the request
      const response = await fetch("/api/programs/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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

      // Get all suggested programs
      const firstSuggestion = data.suggestions[0];
      const programs = firstSuggestion?.programs ?? [];

      if (programs.length > 0) {
        setLoadingState({
          type: "found",
          programs,
        });
      } else {
        setLoadingState({ type: "not-found" });
      }
    } catch (error) {
      console.error("Error fetching program suggestions:", error);
      setLoadingState({ type: "not-found" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-medium mb-2">How old is your child?</h2>
        <AgeChatInput
          onSubmit={handleAgeSubmit}
          isDisabled={
            loadingState.type !== "idle" && loadingState.type !== "found"
          }
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
          <div className="mt-4 space-y-2">
            <p className="text-sm text-success-900 font-medium mb-3">
              We found {loadingState.programs.length} program
              {loadingState.programs.length !== 1 ? "s" : ""} for your child:
            </p>
            {loadingState.programs.map((program) => (
              <ProgramSearchItem key={program.id} program={program} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { type LoadingState };
