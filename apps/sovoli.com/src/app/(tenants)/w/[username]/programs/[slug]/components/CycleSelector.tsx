"use client";

import { useState, useEffect } from "react";
import { RadioGroup } from "@sovoli/ui/components/radio";
import { Card, CardHeader, CardBody } from "@sovoli/ui/components/card";
import { CalendarIcon } from "lucide-react";
import type { OrgProgramCycle } from "~/modules/academics/types";
import { formatDateRange } from "~/utils/dateUtils";

interface CycleSelectorProps {
  cycles: OrgProgramCycle[];
  onCycleChange: (cycle: OrgProgramCycle) => void;
  selectedCycle?: OrgProgramCycle;
}

export function CycleSelector({
  cycles,
  onCycleChange,
  selectedCycle,
}: CycleSelectorProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");

  // Set default to the latest cycle (first in the list)
  useEffect(() => {
    if (cycles.length > 0 && !selectedCycle) {
      const latestCycle = cycles[0];
      if (latestCycle) {
        setSelectedValue(latestCycle.id);
        onCycleChange(latestCycle);
      }
    } else if (selectedCycle) {
      setSelectedValue(selectedCycle.id);
    }
  }, [cycles, selectedCycle, onCycleChange]);

  const handleSelectionChange = (value: string) => {
    setSelectedValue(value);
    const cycle = cycles.find((c) => c.id === value);
    if (cycle) {
      onCycleChange(cycle);
    }
  };

  if (cycles.length === 0) {
    return null;
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
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
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
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
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
                    <span className="block w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </span>
              </label>
            );
          })}
        </RadioGroup>
      </CardBody>
    </Card>
  );
}
