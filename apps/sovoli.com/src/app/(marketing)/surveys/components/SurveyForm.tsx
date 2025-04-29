"use client";

import React from "react";
import { Button } from "@sovoli/ui/components/button";
import { Checkbox, CheckboxGroup } from "@sovoli/ui/components/checkbox";
import { Divider } from "@sovoli/ui/components/divider";
import { Input } from "@sovoli/ui/components/input";
import { Radio, RadioGroup } from "@sovoli/ui/components/radio";
import { Select, SelectItem } from "@sovoli/ui/components/select";

import { ContactToggleInput } from "../../components/ContactToggleInput";
import { SurveySection } from "./SurveySection";

export function SurveyForm() {
  const [formData, setFormData] = React.useState({
    schoolName: "",
    location: "",
    enrollment: "",
    recordSystem: [] as string[],
    recordSystemOther: "",
    recordTypes: [] as string[],
    recordTypesOther: "",
    challenges: [] as string[],
    challengesOther: "",
    frequency: "",
    openToDigital: "",
    helpfulFeatures: [] as string[],
    helpfulFeaturesOther: "",
    contactInterest: "",
    contactMethod: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, values: string[]) => {
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Survey submitted successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8 flex w-full justify-center rounded-xl border border-default-200 p-4">
        <ContactToggleInput defaultMode="whatsapp" defaultValue="" />
      </div>

      {/* SECTION 1: School Identity */}
      <SurveySection number="1" title="School Identity" className="mb-8">
        <div className="w-full space-y-4">
          <Input
            label="School Name"
            placeholder="Enter your school name"
            value={formData.schoolName}
            onValueChange={(value) => handleInputChange("schoolName", value)}
            isRequired
          />
          <Input
            label="Location (Region/Community)"
            placeholder="Enter your school's location"
            value={formData.location}
            onValueChange={(value) => handleInputChange("location", value)}
            isRequired
          />
          <Select
            label="Approximate number of students enrolled"
            placeholder="Select enrollment range"
            value={formData.enrollment}
            onChange={(e) => handleInputChange("enrollment", e.target.value)}
            isRequired
          >
            <SelectItem key="less-than-100" value="Less than 100">
              Less than 100
            </SelectItem>
            <SelectItem key="100-300" value="100–300">
              100–300
            </SelectItem>
            <SelectItem key="300-600" value="300–600">
              300–600
            </SelectItem>
            <SelectItem key="more-than-600" value="More than 600">
              More than 600
            </SelectItem>
          </Select>
        </div>
      </SurveySection>

      <Divider className="my-6" />

      <SurveySection
        number="2"
        title="Current Record-Keeping System"
        className="mb-8"
      >
        <div className="w-full space-y-6">
          <CheckboxGroup
            label="How do you currently manage student records?"
            value={formData.recordSystem}
            onValueChange={(values) =>
              handleCheckboxChange("recordSystem", values)
            }
            className="w-full"
          >
            <div className="flex w-full flex-col gap-2">
              <Checkbox value="paper" className="w-full">
                Paper files/folders
              </Checkbox>
              <Checkbox value="spreadsheets" className="w-full">
                Spreadsheets (Excel, Google Sheets)
              </Checkbox>
              <Checkbox value="software" className="w-full">
                School Management Software
              </Checkbox>
              <Checkbox value="other" className="w-full">
                Other
              </Checkbox>
            </div>
          </CheckboxGroup>

          {formData.recordSystem.includes("other") && (
            <Input
              label="Please specify other record-keeping methods"
              placeholder="Enter other methods"
              value={formData.recordSystemOther}
              onValueChange={(value) =>
                handleInputChange("recordSystemOther", value)
              }
            />
          )}

          <CheckboxGroup
            label="Which types of records do you actively manage?"
            value={formData.recordTypes}
            onValueChange={(values) =>
              handleCheckboxChange("recordTypes", values)
            }
            className="w-full"
          >
            <div className="flex w-full flex-col gap-2">
              <Checkbox value="attendance" className="w-full">
                Attendance
              </Checkbox>
              <Checkbox value="grades" className="w-full">
                Grades / Report Cards
              </Checkbox>
              <Checkbox value="behavior" className="w-full">
                Behavior / Discipline Notes
              </Checkbox>
              <Checkbox value="health" className="w-full">
                Health / Immunization Records
              </Checkbox>
              <Checkbox value="communication" className="w-full">
                Parent Communication
              </Checkbox>
              <Checkbox value="promotions" className="w-full">
                Promotions and Transfers
              </Checkbox>
              <Checkbox value="other" className="w-full">
                Other
              </Checkbox>
            </div>
          </CheckboxGroup>

          {formData.recordTypes.includes("other") && (
            <Input
              label="Please specify other record types"
              placeholder="Enter other record types"
              value={formData.recordTypesOther}
              onValueChange={(value) =>
                handleInputChange("recordTypesOther", value)
              }
            />
          )}
        </div>
      </SurveySection>

      <Divider className="my-6" />

      <SurveySection
        number="3"
        title="Bottlenecks & Challenges"
        className="mb-8"
      >
        <div className="w-full space-y-6">
          <CheckboxGroup
            label="What challenges do you face with your current system?"
            value={formData.challenges}
            onValueChange={(values) =>
              handleCheckboxChange("challenges", values)
            }
            className="w-full"
          >
            <div className="flex w-full flex-col gap-2">
              <Checkbox value="time-consuming" className="w-full">
                Time-consuming data entry
              </Checkbox>
              <Checkbox value="lost-records" className="w-full">
                Lost/misplaced records
              </Checkbox>
              <Checkbox value="reports" className="w-full">
                Hard to generate reports
              </Checkbox>
              <Checkbox value="attendance" className="w-full">
                Difficult tracking attendance
              </Checkbox>
              <Checkbox value="promotions" className="w-full">
                Complicated promotions and transfers
              </Checkbox>
              <Checkbox value="security" className="w-full">
                Security/privacy concerns
              </Checkbox>
              <Checkbox value="old-records" className="w-full">
                Accessing old student records is difficult
              </Checkbox>
              <Checkbox value="other" className="w-full">
                Other
              </Checkbox>
            </div>
          </CheckboxGroup>

          {formData.challenges.includes("other") && (
            <Input
              label="Please specify other challenges"
              placeholder="Enter other challenges"
              value={formData.challengesOther}
              onValueChange={(value) =>
                handleInputChange("challengesOther", value)
              }
            />
          )}

          <Select
            label="How often do these challenges cause problems?"
            placeholder="Select frequency"
            value={formData.frequency}
            onChange={(e) => handleInputChange("frequency", e.target.value)}
          >
            <SelectItem key="rarely" value="Rarely">
              Rarely
            </SelectItem>
            <SelectItem key="occasionally" value="Occasionally">
              Occasionally
            </SelectItem>
            <SelectItem key="frequently" value="Frequently">
              Frequently
            </SelectItem>
            <SelectItem key="almost-daily" value="Almost daily">
              Almost daily
            </SelectItem>
          </Select>
        </div>
      </SurveySection>

      <Divider className="my-6" />

      <SurveySection
        number="4"
        title="Interest in Improvements"
        className="mb-8"
      >
        <div className="w-full space-y-6">
          <RadioGroup
            label="Would you be open to exploring a simpler digital system to manage student records?"
            value={formData.openToDigital}
            onValueChange={(value) => handleInputChange("openToDigital", value)}
            className="w-full"
          >
            <div className="flex w-full flex-col gap-2">
              <Radio value="yes" className="w-full">
                Yes
              </Radio>
              <Radio value="maybe" className="w-full">
                Maybe
              </Radio>
              <Radio value="no" className="w-full">
                No
              </Radio>
            </div>
          </RadioGroup>

          <CheckboxGroup
            label="Which features would be most helpful to you?"
            value={formData.helpfulFeatures}
            onValueChange={(values) =>
              handleCheckboxChange("helpfulFeatures", values)
            }
            className="w-full"
          >
            <div className="flex w-full flex-col gap-2">
              <Checkbox value="mobile-attendance" className="w-full">
                Mobile-friendly attendance logging
              </Checkbox>
              <Checkbox value="grade-entry" className="w-full">
                Easy grade entry and report generation
              </Checkbox>
              <Checkbox value="database" className="w-full">
                Centralized student database
              </Checkbox>
              <Checkbox value="communication" className="w-full">
                Parent communication tools
              </Checkbox>
              <Checkbox value="history" className="w-full">
                Promotion and transfer history tracking
              </Checkbox>
              <Checkbox value="security" className="w-full">
                Secure storage and privacy
              </Checkbox>
              <Checkbox value="other" className="w-full">
                Other
              </Checkbox>
            </div>
          </CheckboxGroup>

          {formData.helpfulFeatures.includes("other") && (
            <Input
              label="Please specify other helpful features"
              placeholder="Enter other features"
              value={formData.helpfulFeaturesOther}
              onValueChange={(value) =>
                handleInputChange("helpfulFeaturesOther", value)
              }
            />
          )}
        </div>
      </SurveySection>

      <Divider className="my-6" />

      <SurveySection number="5" title="Optional Follow-up" className="mb-8">
        <div className="w-full space-y-6">
          <RadioGroup
            label="Would you like to be contacted to discuss further collaboration?"
            value={formData.contactInterest}
            onValueChange={(value) =>
              handleInputChange("contactInterest", value)
            }
            className="w-full"
          >
            <div className="flex w-full flex-col gap-2">
              <Radio value="yes" className="w-full">
                Yes
              </Radio>
              <Radio value="maybe" className="w-full">
                Maybe
              </Radio>
              <Radio value="no" className="w-full">
                No
              </Radio>
            </div>
          </RadioGroup>

          {(formData.contactInterest === "yes" ||
            formData.contactInterest === "maybe") && (
            <Select
              label="If yes, best contact method"
              placeholder="Select contact method"
              value={formData.contactMethod}
              onChange={(e) =>
                handleInputChange("contactMethod", e.target.value)
              }
            >
              <SelectItem key="whatsapp" value="WhatsApp">
                WhatsApp
              </SelectItem>
              <SelectItem key="email" value="Email">
                Email
              </SelectItem>
              <SelectItem key="phone" value="Phone Call">
                Phone Call
              </SelectItem>
              <SelectItem key="other" value="Other">
                Other
              </SelectItem>
            </Select>
          )}
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
