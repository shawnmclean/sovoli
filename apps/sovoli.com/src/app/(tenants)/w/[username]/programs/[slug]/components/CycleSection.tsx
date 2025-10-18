"use client";

import { useEffect } from "react";
import type { RadioProps } from "@sovoli/ui/components/radio";
import { RadioGroup, Radio } from "@sovoli/ui/components/radio";
import { CalendarIcon } from "lucide-react";
import { tv } from "tailwind-variants";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import {
  formatDateRange,
  calculateDuration,
  formatCycleLabel,
} from "~/utils/dateUtils";
import { useProgramCycleSelection } from "../context/ProgramCycleSelectionContext";

interface CycleSectionProps {
  program: Program;
  defaultCycle?: ProgramCycle;
}

const customRadioStyles = tv({
  base: [
    "group inline-flex items-center justify-between hover:bg-content2 flex-row-reverse max-w-full cursor-pointer border-2 border-default rounded-xl gap-4 p-4",
    "data-[selected=true]:border-primary data-[selected=true]:bg-primary/10",
  ],
});

const CycleRadio = ({
  children,
  ...props
}: RadioProps & { description?: React.ReactNode }) => {
  return (
    <Radio
      {...props}
      classNames={{
        base: customRadioStyles(),
      }}
    >
      {children}
    </Radio>
  );
};

export function CycleSection({ program, defaultCycle }: CycleSectionProps) {
  const { selectedCycle, setSelectedCycle } = useProgramCycleSelection();

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

    if (defaultCycleToUse && !selectedCycle) {
      // Set the cycle in context without triggering loading state
      setSelectedCycle(defaultCycleToUse);
    }
  }, [program.cycles, defaultCycle, setSelectedCycle, selectedCycle]);

  const handleSelectionChange = (value: string) => {
    const cycle = program.cycles?.find((c) => c.id === value);
    if (cycle) {
      setSelectedCycle(cycle);
    }
  };

  if (!program.cycles || program.cycles.length === 0) {
    return null;
  }

  const cycles = program.cycles;

  // If there's only one cycle, show it without radio selection
  if (cycles.length === 1 && cycles[0]) {
    const cycle = cycles[0];

    const startDate =
      cycle.academicCycle.startDate ??
      cycle.academicCycle.globalCycle?.startDate ??
      "";
    const endDate =
      cycle.academicCycle.endDate ??
      cycle.academicCycle.globalCycle?.endDate ??
      "";

    const cycleLabel = formatCycleLabel(startDate, endDate);

    return (
      <section className="my-6 border-b border-default-200 pb-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Your Calendar
          </h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-default-200 bg-default-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base font-medium">{cycleLabel}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">
                    {formatDateRange(startDate, endDate)}{" "}
                    <strong>({calculateDuration(startDate, endDate)})</strong>
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
                      <strong>
                        (
                        {calculateDuration(
                          cycle.registrationPeriod.startDate,
                          cycle.registrationPeriod.endDate,
                        )}
                      </strong>
                    </span>
                  </div>
                )}
                {cycle.status === "closed" && (
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium">Closed</span>
                  </div>
                )}
                {(cycle.capacity !== undefined ||
                  cycle.enrolled !== undefined) && (
                  <div className="flex justify-between">
                    <span>Enrollment:</span>
                    <span className="font-medium">
                      {cycle.enrolled !== undefined &&
                      cycle.capacity !== undefined
                        ? `${cycle.enrolled}/${cycle.capacity} students`
                        : cycle.enrolled !== undefined
                          ? `${cycle.enrolled} enrolled`
                          : cycle.capacity !== undefined
                            ? `${cycle.capacity} capacity`
                            : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          Your Calendar
        </h2>
        <div className="space-y-4">
          <RadioGroup
            value={selectedCycle?.id ?? ""}
            onValueChange={handleSelectionChange}
            classNames={{
              wrapper: "space-y-3",
            }}
          >
            {cycles.map((cycle) => {
              const startDate =
                cycle.academicCycle.startDate ??
                cycle.academicCycle.globalCycle?.startDate ??
                "";
              const endDate =
                cycle.academicCycle.endDate ??
                cycle.academicCycle.globalCycle?.endDate ??
                "";

              const cycleLabel = formatCycleLabel(startDate, endDate);

              const description = (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {formatDateRange(startDate, endDate)}{" "}
                      <strong>({calculateDuration(startDate, endDate)})</strong>
                    </span>
                  </div>
                  {cycle.registrationPeriod && (
                    <div className="flex justify-between">
                      <span>Registration:</span>
                      <span className="font-medium">
                        {formatDateRange(
                          cycle.registrationPeriod.startDate,
                          cycle.registrationPeriod.endDate,
                        )}{" "}
                        <strong>
                          (
                          {calculateDuration(
                            cycle.registrationPeriod.startDate,
                            cycle.registrationPeriod.endDate,
                          )}
                          )
                        </strong>
                      </span>
                    </div>
                  )}
                  {cycle.status === "closed" && (
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  )}
                  {(cycle.capacity !== undefined ||
                    cycle.enrolled !== undefined) && (
                    <div className="flex justify-between">
                      <span>Seats:</span>
                      <span className="font-medium">
                        {cycle.enrolled !== undefined &&
                        cycle.capacity !== undefined
                          ? `${cycle.enrolled}/${cycle.capacity}`
                          : cycle.enrolled !== undefined
                            ? `${cycle.enrolled} enrolled`
                            : cycle.capacity !== undefined
                              ? `${cycle.capacity} capacity`
                              : ""}
                      </span>
                    </div>
                  )}
                </div>
              );

              return (
                <CycleRadio
                  key={cycle.id}
                  value={cycle.id}
                  description={description}
                >
                  {cycleLabel}
                </CycleRadio>
              );
            })}
          </RadioGroup>
        </div>
      </div>
    </section>
  );
}
