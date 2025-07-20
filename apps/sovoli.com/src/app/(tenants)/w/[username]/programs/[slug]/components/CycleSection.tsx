"use client";

import { useState, useEffect } from "react";
import { RadioGroup } from "@sovoli/ui/components/radio";
import { Card, CardHeader, CardBody } from "@sovoli/ui/components/card";
import { CalendarIcon } from "lucide-react";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import { formatDateRange } from "~/utils/dateUtils";
import { useProgramCycleSelection } from "../context/ProgramCycleSelectionContext";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";

interface CycleSectionProps {
  program: Program;
  defaultCycle?: ProgramCycle;
}

export function CycleSection({ program, defaultCycle }: CycleSectionProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const { setSelectedCycle, isLoading } = useProgramCycleSelection();

  // Set default cycle for SSR and initial selection
  useEffect(() => {
    if (!program.cycles || program.cycles.length === 0) return;

    // Use provided defaultCycle or find the best default
    let defaultCycleToUse = defaultCycle;

    if (!defaultCycleToUse) {
      // Find current cycle first, then next cycle, then first available
      const currentCycle = program.cycles.find((cycle) => {
        const startDate =
          cycle.academicCycle.startDate ??
          cycle.academicCycle.globalCycle?.startDate;
        const endDate =
          cycle.academicCycle.endDate ??
          cycle.academicCycle.globalCycle?.endDate;
        if (!startDate || !endDate) return false;

        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        return now >= start && now <= end;
      });

      const nextCycle = program.cycles.find((cycle) => {
        const startDate =
          cycle.academicCycle.startDate ??
          cycle.academicCycle.globalCycle?.startDate;
        return startDate && new Date(startDate) > new Date();
      });

      defaultCycleToUse = currentCycle ?? nextCycle ?? program.cycles[0];
    }

    if (defaultCycleToUse) {
      setSelectedValue(defaultCycleToUse.id);
      setSelectedCycle(defaultCycleToUse);
    }
  }, [program.cycles, defaultCycle, setSelectedCycle]);

  const handleSelectionChange = (value: string) => {
    setSelectedValue(value);
    const cycle = program.cycles?.find((c) => c.id === value);
    if (cycle) {
      setSelectedCycle(cycle);
    }
  };

  if (!program.cycles || program.cycles.length === 0) {
    return null;
  }

  const cycles = program.cycles;

  // Show loading state while context is initializing
  if (isLoading) {
    return (
      <ProgramSectionsWrapper>
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-primary" />
              Your Calendar
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="rounded-xl border border-default-200 bg-default-50 p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-default-200 rounded mb-2"></div>
                <div className="h-3 bg-default-200 rounded mb-1"></div>
                <div className="h-3 bg-default-200 rounded"></div>
              </div>
            </div>
          </CardBody>
        </Card>
      </ProgramSectionsWrapper>
    );
  }

  // If there's only one cycle, show it without radio selection
  if (cycles.length === 1 && cycles[0]) {
    const cycle = cycles[0];
    const cycleLabel =
      cycle.academicCycle.customLabel ??
      cycle.academicCycle.globalCycle?.label ??
      "Academic Cycle";

    const startDate =
      cycle.academicCycle.startDate ??
      cycle.academicCycle.globalCycle?.startDate ??
      "";
    const endDate =
      cycle.academicCycle.endDate ??
      cycle.academicCycle.globalCycle?.endDate ??
      "";

    return (
      <ProgramSectionsWrapper>
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-primary" />
              Your Calendar
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="rounded-xl border border-default-200 bg-default-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base font-medium">{cycleLabel}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">
                    {formatDateRange(startDate, endDate)}
                  </span>
                </div>
                {cycle.registrationPeriod && (
                  <div className="flex justify-between">
                    <span>Registration:</span>
                    <span className="font-medium">
                      {formatDateRange(
                        cycle.registrationPeriod.startDate,
                        cycle.registrationPeriod.endDate,
                      )}
                    </span>
                  </div>
                )}
                {cycle.status === "closed" && (
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium">Closed</span>
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </ProgramSectionsWrapper>
    );
  }

  return (
    <ProgramSectionsWrapper>
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Your Calendar
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <RadioGroup
            value={selectedValue}
            onValueChange={handleSelectionChange}
            className="space-y-3"
          >
            {cycles.map((cycle, _) => {
              const isSelected = selectedValue === cycle.id;
              const cycleLabel =
                cycle.academicCycle.customLabel ??
                cycle.academicCycle.globalCycle?.label ??
                "Academic Cycle";

              const startDate =
                cycle.academicCycle.startDate ??
                cycle.academicCycle.globalCycle?.startDate ??
                "";
              const endDate =
                cycle.academicCycle.endDate ??
                cycle.academicCycle.globalCycle?.endDate ??
                "";

              return (
                <label
                  key={cycle.id}
                  htmlFor={cycle.id}
                  className={`block rounded-xl border transition-colors cursor-pointer p-4 mb-1
                    ${isSelected ? "border-green-600 bg-green-900/90 text-white" : "border-default-200 bg-default-50 hover:border-primary-400"}
                    flex flex-col gap-2 relative group
                  `}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSelectionChange(cycle.id);
                    }
                  }}
                  onClick={() => handleSelectionChange(cycle.id)}
                >
                  {/* Hide the default radio visually but keep it accessible */}
                  <input
                    type="radio"
                    id={cycle.id}
                    name="cycle"
                    value={cycle.id}
                    checked={isSelected}
                    onChange={() => handleSelectionChange(cycle.id)}
                    className="absolute left-4 top-4 opacity-0 w-4 h-4 pointer-events-none"
                    tabIndex={-1}
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base font-medium">{cycleLabel}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">
                        {formatDateRange(startDate, endDate)}
                      </span>
                    </div>
                    {cycle.registrationPeriod && (
                      <div className="flex justify-between">
                        <span>Registration:</span>
                        <span className="font-medium">
                          {formatDateRange(
                            cycle.registrationPeriod.startDate,
                            cycle.registrationPeriod.endDate,
                          )}
                        </span>
                      </div>
                    )}
                    {cycle.status === "closed" && (
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium">Closed</span>
                      </div>
                    )}
                  </div>
                  {/* Custom radio indicator */}
                  <span
                    className={`absolute right-4 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                      ${isSelected ? "border-white bg-green-700" : "border-gray-400 bg-white group-hover:border-primary-400"}
                    `}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </span>
                </label>
              );
            })}
          </RadioGroup>
        </CardBody>
      </Card>
    </ProgramSectionsWrapper>
  );
}
