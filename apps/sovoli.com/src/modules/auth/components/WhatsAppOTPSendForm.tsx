"use client";

import { useState, useActionState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { Form } from "@sovoli/ui/components/form";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@sovoli/ui/components/dropdown";
import { ChevronDownIcon } from "lucide-react";
import { US, GB, GY, JM } from "country-flag-icons/react/3x2";
import type { State } from "../actions/sendOTPAction";
import type { FieldErrors } from "@rvf/core";
import { parseFormData } from "@rvf/core";
import { whatsAppOTPFormSchema } from "../actions/schemas";

// Define the country code type with only the countries we need
type CountryCode = "US" | "GB" | "GY" | "JM";

export interface WhatsAppOTPSendFormProps {
  sendAction: (prevState: State, formData: FormData) => Promise<State>;
  onSuccess?: (phone: string, otpToken: string) => void;
  onError?: (message: string) => void;
}

// Flag component that maps country codes to flag components
function Flag({
  code,
  height,
}: {
  code: CountryCode;
  height: string | number;
}) {
  const flagComponents = {
    US: US,
    GB: GB,
    GY: GY,
    JM: JM,
  };

  const FlagComponent = flagComponents[code];
  return <FlagComponent height={height} />;
}

export function WhatsAppOTPSendForm({
  sendAction,
  onSuccess,
}: WhatsAppOTPSendFormProps) {
  const [state, formAction, isPending] = useActionState(sendAction, null);
  const [clientErrors, setClientErrors] = useState<FieldErrors | undefined>(
    undefined,
  );
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<{
    code: string;
    name: string;
    countryCode: CountryCode;
  }>({
    code: "+592",
    name: "Guyana",
    countryCode: "GY",
  });

  const countryCodes: {
    code: string;
    name: string;
    countryCode: CountryCode;
  }[] = [
    { code: "+1", name: "United States", countryCode: "US" },
    { code: "+44", name: "United Kingdom", countryCode: "GB" },
    { code: "+592", name: "Guyana", countryCode: "GY" },
    { code: "+876", name: "Jamaica", countryCode: "JM" },
  ];

  // Handle success and error cases
  if (state?.status === "success" && state.otpToken) {
    const fullPhoneNumber = selectedCountry.code + phone;
    onSuccess?.(fullPhoneNumber, state.otpToken);
  }

  const handleSubmit = async (formData: FormData) => {
    const fullPhoneNumber = selectedCountry.code + phone;
    formData.set("phone", fullPhoneNumber);

    const validatedData = await parseFormData(formData, whatsAppOTPFormSchema);
    if (validatedData.error) {
      setClientErrors(validatedData.error.fieldErrors);
      return;
    }
    formAction(formData);
  };

  return (
    <div className="space-y-4">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">Your phone number?</h1>
        <p className="text-base">Enter your WhatsApp number.</p>
      </div>

      {/* Display error messages */}
      {state?.status === "error" && (
        <div className="p-3 rounded-lg bg-danger-50 text-danger-700 border border-danger-200">
          {state.message}
        </div>
      )}

      <Form
        action={handleSubmit}
        validationErrors={state?.errors ?? clientErrors}
        className="space-y-4"
        validationBehavior="aria"
      >
        <Input
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          autoFocus
          type="tel"
          size="lg"
          variant="bordered"
          placeholder="Enter phone number"
          isRequired
          isDisabled={isPending}
          startContent={
            <Dropdown isDisabled={isPending}>
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="h-full min-w-[100px] border-r border-divider rounded-r-none pl-0 gap-1"
                  startContent={
                    <Flag code={selectedCountry.countryCode} height={18} />
                  }
                  endContent={
                    <ChevronDownIcon className="text-default-500" size={16} />
                  }
                >
                  {selectedCountry.code}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Country Codes"
                className="max-h-[300px]"
                selectionMode="single"
                selectedKeys={[selectedCountry.code]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  const country = countryCodes.find(
                    (c) => c.code === selectedKey,
                  );
                  if (country) setSelectedCountry(country);
                }}
              >
                {countryCodes.map((country) => (
                  <DropdownItem
                    key={country.code}
                    description={country.name}
                    startContent={
                      <Flag code={country.countryCode} height={20} />
                    }
                  >
                    {country.code}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          }
        />
        {/* Terms and Privacy Notice */}
        <div className="text-center text-xs text-default-500">
          By pressing continue, you agree to Sovoli's{" "}
          <a
            href="https://sovoli.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="https://sovoli.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Privacy
          </a>
          .
        </div>

        <Button
          type="submit"
          variant="solid"
          color="primary"
          radius="lg"
          fullWidth
          isLoading={isPending}
          isDisabled={isPending}
        >
          {isPending ? "Sending..." : "Continue"}
        </Button>
      </Form>
    </div>
  );
}
