import React from "react";

interface SurveySectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const SurveySection: React.FC<SurveySectionProps> = ({
  number,
  title,
  children,
  className = "",
}) => {
  return (
    <section className={className}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
          {number}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="w-full pl-0 sm:pl-11">{children}</div>
    </section>
  );
};
