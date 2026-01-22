"use client";

import { parseFormData } from "@rvf/core";
import { Button } from "@sovoli/ui/components/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import { Form } from "@sovoli/ui/components/form";
import { Input } from "@sovoli/ui/components/input";
import { GB, GY, JM, US } from "country-flag-icons/react/3x2";
import { ChevronDownIcon } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { useCountry } from "~/modules/core/context/CountryProvider";
import { countryCodeToPhoneCode } from "~/utils/currencyDetection";
import { whatsAppOTPFormSchema } from "../../actions/schemas";
import type { PhoneActionStates } from "../../actions/states";

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
  { code: "+1", name: "Jamaica", countryCode: "JM" },
];

/**
 * Formats phone number for display based on country format.
 *
 * @param digits - Digits only (no formatting)
 * @param countryIso - ISO country code (e.g., "US", "JM", "GB", "GY")
 * @returns Formatted phone number string
 */
function formatPhoneNumber(digits: string, countryIso: CountryCode): string {
  if (!digits) return "";

  // Handle +1 countries (US, JM) - NANP format
  if (countryIso === "JM") {
    // Jamaica: (876) xxx-xxxx
    if (digits.length <= 3) {
      return digits.length > 0 ? `(${digits}` : digits;
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    if (digits.length <= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    // Limit to 10 digits
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  if (countryIso === "US") {
    // US: (xxx) xxx-xxxx
    if (digits.length <= 3) {
      return digits.length > 0 ? `(${digits}` : digits;
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    if (digits.length <= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    // Limit to 10 digits
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  if (countryIso === "GB") {
    // UK: xxxx xxxxxx
    if (digits.length <= 4) {
      return digits;
    }
    if (digits.length <= 10) {
      return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    }
    // Limit to 10 digits
    return `${digits.slice(0, 4)} ${digits.slice(4, 10)}`;
  }

  // Guyana: xxx xxxx (countryIso === "GY" is the only remaining case)
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 7) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  }
  // Limit to 7 digits
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)}`;
}

/**
 * Normalizes phone number input to prevent duplication and handle various formats.
 * Inspired by libraries like intl-tel-input.
 *
 * @param input - Raw phone number input from user
 * @param selectedCountryCode - Selected country code (e.g., "+1", "+44")
 * @param countryIso - ISO country code (e.g., "US", "JM", "GB", "GY")
 * @returns Normalized digits only (no formatting, no country code prefix)
 */
function normalizePhoneInput(
  input: string,
  selectedCountryCode: string,
  countryIso: CountryCode,
): string {
  if (!input) return "";

  // Strip all non-digit characters
  let digits = input.replace(/\D/g, "");

  if (!digits) return "";

  // Extract country code digits (without +)
  const countryCodeDigits = selectedCountryCode.replace(/\D/g, "");

  // Handle +1 countries (US, JM) - NANP format - special handling needed
  if (selectedCountryCode === "+1") {
    // If input starts with "1" and length is 11, remove leading "1" (full international format)
    if (digits.startsWith("1") && digits.length === 11) {
      digits = digits.slice(1);
    }

    // For Jamaica: handle area code 876
    if (countryIso === "JM") {
      // If input starts with "876" and length is 10, keep as is (area code + 7 digits)
      if (digits.startsWith("876") && digits.length === 10) {
        return digits;
      }
      // If input is 7 digits, prepend Jamaica area code "876"
      if (digits.length === 7) {
        return "876" + digits;
      }
      // If input is 10 digits but doesn't start with 876, assume it's already normalized
      if (digits.length === 10) {
        return digits;
      }
    }

    // For US: if length is 10, assume area code is included
    // If length is 7, let validation handle it (invalid without area code)
    if (countryIso === "US") {
      if (digits.length === 10) {
        return digits;
      }
      // If 11 digits starting with 1, we already handled it above
    }

    // Return digits as-is for +1 countries (already normalized above)
    return digits;
  }

  // For non-+1 countries: remove country code if already present at the start
  if (digits.startsWith(countryCodeDigits)) {
    digits = digits.slice(countryCodeDigits.length);
  }

  return digits;
}

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
  const rawPhone = userPhone ?? defaultPhone ?? "";
  const selectedCountry = userSelectedCountry ?? derivedCountry;

  // Extract digits from raw phone for formatting
  const phoneDigits = rawPhone.replace(/\D/g, "");

  // Format phone number for display
  const formattedPhone = useMemo(() => {
    return formatPhoneNumber(phoneDigits, selectedCountry.countryCode);
  }, [phoneDigits, selectedCountry.countryCode]);

  const clientActionValidation = async (
    prevState: PhoneActionStates,
    formData: FormData,
  ): Promise<PhoneActionStates> => {
    // Get the formatted phone number and country code from form data
    const formattedPhoneFromForm = formData.get("phone") as string;
    const countryCode = formData.get("countryCode") as string;

    // Extract digits from formatted phone (form data contains formatted value)
    const digitsFromForm = formattedPhoneFromForm.replace(/\D/g, "");

    // Normalize the phone input to prevent duplication
    const normalizedDigits = normalizePhoneInput(
      digitsFromForm,
      countryCode,
      selectedCountry.countryCode,
    );

    // Combine country code with normalized phone number (E.164 format)
    const fullPhoneNumber = countryCode + normalizedDigits;

    // Create new FormData with the combined phone number
    const updatedFormData = new FormData();
    updatedFormData.set("phone", fullPhoneNumber);
    updatedFormData.set("countryCode", countryCode);
    updatedFormData.set("countryIso", selectedCountry.countryCode);
    updatedFormData.set("rawPhone", normalizedDigits);

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
          value={formattedPhone}
          onChange={(e) => {
            const input = e.target.value;
            // Extract digits only for storage
            const digits = input.replace(/\D/g, "");
            // Store the raw digits (will be formatted on next render)
            setUserPhone(digits);
          }}
          onKeyDown={(e) => {
            // Handle backspace to allow deletion even when cursor is on formatting characters
            if (
              e.key === "Backspace" &&
              formattedPhone &&
              phoneDigits.length > 0
            ) {
              const input = e.target as HTMLInputElement;
              const cursorPosition = input.selectionStart ?? 0;
              const beforeCursor = formattedPhone.slice(0, cursorPosition);

              // If cursor is right after a formatting character, delete the digit before it
              if (cursorPosition > 0 && /[^0-9]/.test(beforeCursor.slice(-1))) {
                const digitsBefore = beforeCursor.replace(/\D/g, "");
                if (digitsBefore.length > 0) {
                  const afterCursor = formattedPhone.slice(cursorPosition);
                  const digitsAfter = afterCursor.replace(/\D/g, "");
                  const newDigits = digitsBefore.slice(0, -1) + digitsAfter;
                  setUserPhone(newDigits);
                  e.preventDefault();
                  // Restore cursor position after formatting updates
                  setTimeout(() => {
                    const newFormatted = formatPhoneNumber(
                      newDigits,
                      selectedCountry.countryCode,
                    );
                    // Try to maintain cursor position relative to the formatting
                    const newCursorPos = Math.max(
                      0,
                      Math.min(cursorPosition - 1, newFormatted.length),
                    );
                    input.setSelectionRange(newCursorPos, newCursorPos);
                  }, 0);
                }
              }
            }
          }}
          fullWidth
          autoFocus
          type="tel"
          size="lg"
          variant="bordered"
          placeholder={
            selectedCountry.countryCode === "JM"
              ? "(876) xxx-xxxx"
              : selectedCountry.countryCode === "US"
                ? "(xxx) xxx-xxxx"
                : selectedCountry.countryCode === "GB"
                  ? "xxxx xxxxxx"
                  : "xxx xxxx"
          }
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
                selectedKeys={[selectedCountry.countryCode]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as CountryCode;
                  const country = countryCodes.find(
                    (c) => c.countryCode === selectedKey,
                  );
                  if (country) {
                    setUserSelectedCountry(country);
                  }
                }}
              >
                {countryCodes.map((country) => (
                  <DropdownItem
                    key={country.countryCode}
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
