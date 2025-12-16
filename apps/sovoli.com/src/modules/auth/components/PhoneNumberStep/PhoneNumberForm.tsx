"use client";

import { useState, useActionState, useMemo } from "react";
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
import { parseFormData } from "@rvf/core";
import type { PhoneActionStates } from "../../actions/states";
import { whatsAppOTPFormSchema } from "../../actions/schemas";
import { useCountry } from "~/modules/core/context/CountryProvider";
import { countryCodeToPhoneCode } from "~/utils/currencyDetection";

// Define the country code type with only the countries we need
type CountryCode = "US" | "GB" | "GY" | "JM";

export interface PhoneNumberFormProps {
  defaultPhone?: string;
  defaultCountryCode?: CountryCode;
  sendAction: (
    prevState: PhoneActionStates,
    formData: FormData,
  ) => Promise<PhoneActionStates>;
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

const countryCodes: {
  code: string;
  name: string;
  countryCode: CountryCode;
}[] = [
  { code: "+1", name: "United States", countryCode: "US" },
  { code: "+44", name: "United Kingdom", countryCode: "GB" },
  { code: "+592", name: "Guyana", countryCode: "GY" },
  { code: "+1876", name: "Jamaica", countryCode: "JM" },
];

export function PhoneNumberForm({
  sendAction,
  defaultPhone,
  defaultCountryCode,
}: PhoneNumberFormProps) {
  // Get country code from context
  const countryCode = useCountry();
  const phoneCountryCodeFromContext = useMemo(
    () => (countryCode ? countryCodeToPhoneCode(countryCode) : undefined),
    [countryCode],
  );

  // Use prop if provided, otherwise use context value, otherwise default to "GY"
  const effectiveCountryCode: CountryCode = useMemo(
    () => defaultCountryCode ?? phoneCountryCodeFromContext ?? "GY",
    [defaultCountryCode, phoneCountryCodeFromContext],
  );

  // Derive country from props - this is the source of truth when user hasn't interacted
  const derivedCountry = useMemo((): {
    code: string;
    name: string;
    countryCode: CountryCode;
  } => {
    const countryToUse: CountryCode =
      defaultCountryCode ?? effectiveCountryCode;
    const match = countryCodes.find(
      (item) => item.countryCode === countryToUse,
    );
    return (
      match ?? {
        code: "+592",
        name: "Guyana",
        countryCode: "GY" as CountryCode,
      }
    );
  }, [defaultCountryCode, effectiveCountryCode]);

  // Track user input separately from props
  // Once user interacts, their input takes precedence over props
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [userSelectedCountry, setUserSelectedCountry] = useState<{
    code: string;
    name: string;
    countryCode: CountryCode;
  } | null>(null);

  // Use user input if available, otherwise derive from props
  const phone = userPhone ?? defaultPhone ?? "";
  const selectedCountry = userSelectedCountry ?? derivedCountry;

  const clientActionValidation = async (
    prevState: PhoneActionStates,
    formData: FormData,
  ): Promise<PhoneActionStates> => {
    // Get the raw phone number and country code from form data
    const rawPhone = formData.get("phone") as string;
    const countryCode = formData.get("countryCode") as string;

    // Combine country code with phone number
    const fullPhoneNumber = countryCode + rawPhone;

    // Create new FormData with the combined phone number
    const updatedFormData = new FormData();
    updatedFormData.set("phone", fullPhoneNumber);
    updatedFormData.set("countryCode", countryCode);
    updatedFormData.set("countryIso", selectedCountry.countryCode);
    updatedFormData.set("rawPhone", rawPhone);

    const validatedData = await parseFormData(
      updatedFormData,
      whatsAppOTPFormSchema,
    );
    if (validatedData.error) {
      return {
        status: "error",
        message: "",
        errors: validatedData.error.fieldErrors,
      };
    }

    return sendAction(prevState, updatedFormData);
  };

  const [state, formAction, isPending] = useActionState(
    clientActionValidation,
    null,
  );

  return (
    <div className="space-y-4">
      <div className="text-left">
        <h1 className="text-2xl font-bold mb-2">Your phone number?</h1>
        <p className="text-base">Enter your WhatsApp number.</p>
      </div>

      {/* Display error messages */}
      {state?.status === "error" && state.message && (
        <div className="p-3 rounded-lg bg-danger-50 text-danger-700 border border-danger-200">
          {state.message}
        </div>
      )}
      {state?.status === "success" && state.message && (
        <div className="p-3 rounded-lg bg-success-50 text-success-700 border border-success-200">
          {state.message}
        </div>
      )}

      <Form
        action={formAction}
        validationErrors={state?.errors}
        className="space-y-4"
      >
        <input type="hidden" name="countryCode" value={selectedCountry.code} />
        <Input
          name="phone"
          value={phone}
          onChange={(e) => {
            setUserPhone(e.target.value);
          }}
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
                  if (country) {
                    setUserSelectedCountry(country);
                  }
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
