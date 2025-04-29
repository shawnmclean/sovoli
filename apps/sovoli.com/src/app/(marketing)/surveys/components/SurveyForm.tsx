"use client";

import React from "react";
import { Button } from "@sovoli/ui/components/button";
import { Divider } from "@sovoli/ui/components/divider";
import { Input } from "@sovoli/ui/components/input";
import { Radio, RadioGroup } from "@sovoli/ui/components/radio";
import { Select, SelectItem } from "@sovoli/ui/components/select";

import { ContactToggleInput } from "../../components/ContactToggleInput";
import { CheckboxGroupWithOther } from "./CheckboxGroupWithOther";
import { SurveySection } from "./SurveySection";

interface SurveyFormProps {
  defaultContactMode?: "whatsapp" | "email";
  defaultContactValue: string;
  formAction?: (formData: FormData) => void | Promise<void>;
}

export function SurveyForm({
  defaultContactMode = "whatsapp",
  defaultContactValue,
  formAction,
}: SurveyFormProps) {
  return (
    <form action={formAction}>
      {/* Contact Section */}
      <div className="mb-8 flex w-full justify-center rounded-xl border border-default-200 p-4">
        <ContactToggleInput
          defaultMode={defaultContactMode}
          defaultValue={defaultContactValue}
        />
      </div>

      {/* SECTION 1: School Identity */}
      <SurveySection number="1" title="School Identity" className="mb-8">
        <div className="w-full space-y-4">
          <Input
            name="schoolName"
            label="School Name"
            placeholder="Enter your school name"
            isRequired
          />
          <Input
            name="location"
            label="Location (Region/Community)"
            placeholder="Enter your school's location"
            isRequired
          />
          <Select
            name="enrollment"
            label="Approximate number of students enrolled"
            placeholder="Select enrollment range"
            isRequired
          >
            <SelectItem value="Less than 100">Less than 100</SelectItem>
            <SelectItem value="100–300">100–300</SelectItem>
            <SelectItem value="300–600">300–600</SelectItem>
            <SelectItem value="More than 600">More than 600</SelectItem>
          </Select>
        </div>
      </SurveySection>

      <Divider className="my-6" />

      {/* SECTION 2: Current Record System */}
      <SurveySection
        number="2"
        title="Current Record-Keeping System"
        className="mb-8"
      >
        <div className="w-full space-y-6">
          <CheckboxGroupWithOther
            name="recordSystem"
            label="How do you currently manage student records?"
            options={[
              { label: "Paper files/folders", value: "paper" },
              {
                label: "Spreadsheets (Excel, Google Sheets)",
                value: "spreadsheets",
              },
              { label: "School Management Software", value: "software" },
            ]}
          />

          <CheckboxGroupWithOther
            name="recordTypes"
            label="Which types of records do you actively manage?"
            options={[
              { label: "Attendance", value: "attendance" },
              { label: "Grades / Report Cards", value: "grades" },
              { label: "Behavior / Discipline Notes", value: "behavior" },
              { label: "Health / Immunization Records", value: "health" },
              { label: "Parent Communication", value: "communication" },
              { label: "Promotions and Transfers", value: "promotions" },
            ]}
          />
        </div>
      </SurveySection>

      <Divider className="my-6" />

      {/* SECTION 3: Bottlenecks & Challenges */}
      <SurveySection
        number="3"
        title="Bottlenecks & Challenges"
        className="mb-8"
      >
        <div className="w-full space-y-6">
          <CheckboxGroupWithOther
            name="challenges"
            label="What challenges do you face with your current system?"
            options={[
              { label: "Time-consuming data entry", value: "time-consuming" },
              { label: "Lost/misplaced records", value: "lost-records" },
              { label: "Hard to generate reports", value: "reports" },
              { label: "Difficult tracking attendance", value: "attendance" },
              {
                label: "Complicated promotions and transfers",
                value: "promotions",
              },
              { label: "Security/privacy concerns", value: "security" },
              {
                label: "Accessing old student records is difficult",
                value: "old-records",
              },
            ]}
          />

          <Select
            name="frequency"
            label="How often do these challenges cause problems?"
            placeholder="Select frequency"
          >
            <SelectItem value="Rarely">Rarely</SelectItem>
            <SelectItem value="Occasionally">Occasionally</SelectItem>
            <SelectItem value="Frequently">Frequently</SelectItem>
            <SelectItem value="Almost daily">Almost daily</SelectItem>
          </Select>
        </div>
      </SurveySection>

      <Divider className="my-6" />

      {/* SECTION 4: Interest in Improvements */}
      <SurveySection
        number="4"
        title="Interest in Improvements"
        className="mb-8"
      >
        <div className="w-full space-y-6">
          <RadioGroup
            name="openToDigital"
            label="Would you be open to exploring a simpler digital system to manage student records?"
            className="w-full"
          >
            <div className="flex flex-col gap-2">
              <Radio value="yes">Yes</Radio>
              <Radio value="maybe">Maybe</Radio>
              <Radio value="no">No</Radio>
            </div>
          </RadioGroup>

          <CheckboxGroupWithOther
            name="helpfulFeatures"
            label="Which features would be most helpful to you?"
            options={[
              {
                label: "Mobile-friendly attendance logging",
                value: "mobile-attendance",
              },
              {
                label: "Easy grade entry and report generation",
                value: "grade-entry",
              },
              { label: "Centralized student database", value: "database" },
              { label: "Parent communication tools", value: "communication" },
              {
                label: "Promotion and transfer history tracking",
                value: "history",
              },
              { label: "Secure storage and privacy", value: "security" },
            ]}
          />
        </div>
      </SurveySection>

      {/* Submit Button */}
      <div className="mt-8 flex justify-center">
        <Button type="submit" color="primary" size="lg" className="px-8">
          I'm Finished!
        </Button>
      </div>
    </form>
  );
}
