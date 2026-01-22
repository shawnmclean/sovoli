import React from "react";

export interface Step {
  label: string;
  completed?: boolean;
  active?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = "",
}) => {
  return (
    <div
      className={`w-full max-w-full overflow-x-auto scrollbar-hide ${className}`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <nav
        className="flex items-center justify-start rounded-xl px-4 py-3 bg-gradient-to-r from-[#23182b] via-[#4a1830] to-[#2a1a3a] shadow-md gap-0 min-w-max"
        aria-label="Progress"
      >
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          const isClickable = idx < currentStep && !!onStepClick;
          return (
            <React.Fragment key={step.label}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => onStepClick?.(idx)}
                className={`flex items-center gap-2 group focus:outline-none transition-colors duration-200
                  ${isClickable ? "hover:opacity-80 cursor-pointer" : "cursor-default"}
                `}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-base font-semibold transition-all duration-200 shadow-xs
                    ${
                      isCompleted
                        ? "border-primary bg-primary/10 text-primary"
                        : isActive
                          ? "border-primary text-primary bg-background"
                          : "border-foreground-400 text-foreground-400 bg-background"
                    }
                    group-focus:ring-2 group-focus:ring-primary/40
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </span>
                <span
                  className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap
                    ${isActive ? "text-primary" : isCompleted ? "text-primary/70" : "text-foreground-400"}
                  `}
                >
                  {step.label}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-2 h-0.5 min-w-[32px] bg-gradient-to-r from-foreground-700 via-foreground-600 to-foreground-700 opacity-60 rounded-full" />
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

// Hide scrollbar utility (add to your global CSS if not present)
// .scrollbar-hide::-webkit-scrollbar { display: none; }
// .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
