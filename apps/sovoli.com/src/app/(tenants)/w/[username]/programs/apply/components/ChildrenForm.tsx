"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { Card, CardBody } from "@sovoli/ui/components/card";

import { Select, SelectItem } from "@sovoli/ui/components/select";
import { TrashIcon, PlusIcon } from "lucide-react";

interface ChildData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  previousSchool?: string;
  medicalConditions?: string;
  allergies?: string;
}

interface ChildrenFormProps {
  onNext: (data: ChildData[]) => void;
  onBack: () => void;
}

export function ChildrenForm({ onNext, onBack }: ChildrenFormProps) {
  const [children, setChildren] = useState<ChildData[]>([
    {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      grade: "",
      previousSchool: "",
      medicalConditions: "",
      allergies: "",
    },
  ]);

  const addChild = () => {
    setChildren([
      ...children,
      {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        grade: "",
        previousSchool: "",
        medicalConditions: "",
        allergies: "",
      },
    ]);
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const updateChild = (
    index: number,
    field: keyof ChildData,
    value: string,
  ) => {
    const updatedChildren = [...children];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value,
    } as ChildData;
    setChildren(updatedChildren);
  };

  const handleSubmit = () => {
    onNext(children);
  };

  const isChildValid = (child: ChildData) => {
    return (
      child.firstName &&
      child.lastName &&
      child.dateOfBirth &&
      child.gender &&
      child.grade
    );
  };

  const areAllChildrenValid = () => {
    return children.every(isChildValid);
  };

  const gradeOptions = [
    "Pre-Nursery",
    "Nursery",
    "Kindergarten",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ];

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Children Information
        </h3>
        <Button
          color="secondary"
          variant="light"
          onPress={addChild}
          startContent={<PlusIcon className="w-4 h-4" />}
        >
          Add Child
        </Button>
      </div>

      {children.map((child, index) => (
        <Card key={index} shadow="sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-foreground">
                Child {index + 1}
              </h4>
              {children.length > 1 && (
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => removeChild(index)}
                  startContent={<TrashIcon className="w-4 h-4" />}
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Enter first name"
                value={child.firstName}
                onChange={(e) =>
                  updateChild(index, "firstName", e.target.value)
                }
                isRequired
              />
              <Input
                label="Last Name"
                placeholder="Enter last name"
                value={child.lastName}
                onChange={(e) => updateChild(index, "lastName", e.target.value)}
                isRequired
              />
              <Input
                label="Date of Birth"
                type="date"
                value={child.dateOfBirth}
                onChange={(e) =>
                  updateChild(index, "dateOfBirth", e.target.value)
                }
                isRequired
              />
              <Select
                label="Gender"
                placeholder="Select gender"
                selectedKeys={child.gender ? [child.gender] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  updateChild(index, "gender", selected);
                }}
                isRequired
              >
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Grade Level"
                placeholder="Select grade"
                selectedKeys={child.grade ? [child.grade] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  updateChild(index, "grade", selected);
                }}
                isRequired
              >
                {gradeOptions.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="Previous School (Optional)"
                placeholder="Enter previous school name"
                value={child.previousSchool}
                onChange={(e) =>
                  updateChild(index, "previousSchool", e.target.value)
                }
              />
              <Input
                label="Medical Conditions (Optional)"
                placeholder="Enter any medical conditions"
                value={child.medicalConditions}
                onChange={(e) =>
                  updateChild(index, "medicalConditions", e.target.value)
                }
                className="md:col-span-2"
              />
              <Input
                label="Allergies (Optional)"
                placeholder="Enter any allergies"
                value={child.allergies}
                onChange={(e) =>
                  updateChild(index, "allergies", e.target.value)
                }
                className="md:col-span-2"
              />
            </div>
          </CardBody>
        </Card>
      ))}

      <div className="flex gap-4">
        <Button
          color="secondary"
          variant="light"
          onPress={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          color="primary"
          onPress={handleSubmit}
          isDisabled={!areAllChildrenValid()}
          className="flex-1"
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
}
