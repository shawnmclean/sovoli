"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";

interface GuardianData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  relationship: string;
}

interface GuardianFormProps {
  onNext: (data: { primary: GuardianData; secondary?: GuardianData }) => void;
  initialData?: { primary: GuardianData; secondary?: GuardianData };
}

export function GuardianForm({ onNext, initialData }: GuardianFormProps) {
  const [primaryGuardian, setPrimaryGuardian] = useState<GuardianData>(
    initialData?.primary ?? {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      relationship: "",
    },
  );

  const [secondaryGuardian, setSecondaryGuardian] = useState<GuardianData>(
    initialData?.secondary ?? {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      relationship: "",
    },
  );

  const [includeSecondary, setIncludeSecondary] = useState(
    !!initialData?.secondary,
  );
  const [sameAsPrimary, setSameAsPrimary] = useState(false);

  const handlePrimaryChange = (field: keyof GuardianData, value: string) => {
    setPrimaryGuardian((prev) => ({ ...prev, [field]: value }));

    // If "same as primary" is checked, update secondary guardian
    if (sameAsPrimary) {
      setSecondaryGuardian((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSecondaryChange = (field: keyof GuardianData, value: string) => {
    setSecondaryGuardian((prev) => ({ ...prev, [field]: value }));
  };

  const handleSameAsPrimaryChange = (checked: boolean) => {
    setSameAsPrimary(checked);
    if (checked) {
      setSecondaryGuardian(primaryGuardian);
    }
  };

  const handleSubmit = () => {
    const data = {
      primary: primaryGuardian,
      ...(includeSecondary && { secondary: secondaryGuardian }),
    };
    onNext(data);
  };

  const isPrimaryValid = () => {
    return (
      primaryGuardian.firstName &&
      primaryGuardian.lastName &&
      primaryGuardian.email &&
      primaryGuardian.phone &&
      primaryGuardian.address &&
      primaryGuardian.city &&
      primaryGuardian.state &&
      primaryGuardian.zipCode &&
      primaryGuardian.relationship
    );
  };

  const isSecondaryValid = () => {
    if (!includeSecondary) return true;
    if (sameAsPrimary) return true;

    return (
      secondaryGuardian.firstName &&
      secondaryGuardian.lastName &&
      secondaryGuardian.email &&
      secondaryGuardian.phone &&
      secondaryGuardian.address &&
      secondaryGuardian.city &&
      secondaryGuardian.state &&
      secondaryGuardian.zipCode &&
      secondaryGuardian.relationship
    );
  };

  return (
    <div className="space-y-6">
      {/* Primary Guardian */}
      <Card shadow="sm">
        <CardBody className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Primary Guardian Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Enter first name"
              value={primaryGuardian.firstName}
              onChange={(e) => handlePrimaryChange("firstName", e.target.value)}
              isRequired
            />
            <Input
              label="Last Name"
              placeholder="Enter last name"
              value={primaryGuardian.lastName}
              onChange={(e) => handlePrimaryChange("lastName", e.target.value)}
              isRequired
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter email address"
              value={primaryGuardian.email}
              onChange={(e) => handlePrimaryChange("email", e.target.value)}
              isRequired
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="Enter phone number"
              value={primaryGuardian.phone}
              onChange={(e) => handlePrimaryChange("phone", e.target.value)}
              isRequired
            />
            <Input
              label="Address"
              placeholder="Enter street address"
              value={primaryGuardian.address}
              onChange={(e) => handlePrimaryChange("address", e.target.value)}
              isRequired
              className="md:col-span-2"
            />
            <Input
              label="City"
              placeholder="Enter city"
              value={primaryGuardian.city}
              onChange={(e) => handlePrimaryChange("city", e.target.value)}
              isRequired
            />
            <Input
              label="State/Province"
              placeholder="Enter state or province"
              value={primaryGuardian.state}
              onChange={(e) => handlePrimaryChange("state", e.target.value)}
              isRequired
            />
            <Input
              label="ZIP/Postal Code"
              placeholder="Enter ZIP or postal code"
              value={primaryGuardian.zipCode}
              onChange={(e) => handlePrimaryChange("zipCode", e.target.value)}
              isRequired
            />
            <Input
              label="Relationship to Child"
              placeholder="e.g., Mother, Father, Grandparent"
              value={primaryGuardian.relationship}
              onChange={(e) =>
                handlePrimaryChange("relationship", e.target.value)
              }
              isRequired
            />
          </div>
        </CardBody>
      </Card>

      {/* Secondary Guardian Option */}
      <Card shadow="sm">
        <CardBody className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Checkbox
              isSelected={includeSecondary}
              onValueChange={setIncludeSecondary}
            />
            <span className="text-foreground">Include Secondary Guardian</span>
          </div>

          {includeSecondary && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  isSelected={sameAsPrimary}
                  onValueChange={handleSameAsPrimaryChange}
                />
                <span className="text-foreground">
                  Same as Primary Guardian
                </span>
              </div>

              {!sameAsPrimary && (
                <>
                  <Divider />
                  <h4 className="text-md font-semibold text-foreground">
                    Secondary Guardian Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      placeholder="Enter first name"
                      value={secondaryGuardian.firstName}
                      onChange={(e) =>
                        handleSecondaryChange("firstName", e.target.value)
                      }
                      isRequired
                    />
                    <Input
                      label="Last Name"
                      placeholder="Enter last name"
                      value={secondaryGuardian.lastName}
                      onChange={(e) =>
                        handleSecondaryChange("lastName", e.target.value)
                      }
                      isRequired
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter email address"
                      value={secondaryGuardian.email}
                      onChange={(e) =>
                        handleSecondaryChange("email", e.target.value)
                      }
                      isRequired
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={secondaryGuardian.phone}
                      onChange={(e) =>
                        handleSecondaryChange("phone", e.target.value)
                      }
                      isRequired
                    />
                    <Input
                      label="Address"
                      placeholder="Enter street address"
                      value={secondaryGuardian.address}
                      onChange={(e) =>
                        handleSecondaryChange("address", e.target.value)
                      }
                      isRequired
                      className="md:col-span-2"
                    />
                    <Input
                      label="City"
                      placeholder="Enter city"
                      value={secondaryGuardian.city}
                      onChange={(e) =>
                        handleSecondaryChange("city", e.target.value)
                      }
                      isRequired
                    />
                    <Input
                      label="State/Province"
                      placeholder="Enter state or province"
                      value={secondaryGuardian.state}
                      onChange={(e) =>
                        handleSecondaryChange("state", e.target.value)
                      }
                      isRequired
                    />
                    <Input
                      label="ZIP/Postal Code"
                      placeholder="Enter ZIP or postal code"
                      value={secondaryGuardian.zipCode}
                      onChange={(e) =>
                        handleSecondaryChange("zipCode", e.target.value)
                      }
                      isRequired
                    />
                    <Input
                      label="Relationship to Child"
                      placeholder="e.g., Mother, Father, Grandparent"
                      value={secondaryGuardian.relationship}
                      onChange={(e) =>
                        handleSecondaryChange("relationship", e.target.value)
                      }
                      isRequired
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      <Button
        color="primary"
        onPress={handleSubmit}
        isDisabled={!isPrimaryValid() || !isSecondaryValid()}
        className="w-full"
      >
        Next: Children Information
      </Button>
    </div>
  );
}
