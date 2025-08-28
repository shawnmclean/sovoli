"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";

import type { State } from "../actions/signInAction";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@sovoli/ui/components/dropdown";
import { ChevronDownIcon } from "lucide-react";
import { US, GB, GY, JM } from "country-flag-icons/react/3x2";

// Define the country code type with only the countries we need
type CountryCode = "US" | "GB" | "GY" | "JM";

export interface WhatsAppOTPFormProps {
  onSuccess?: (phone: string) => void;
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

export function WhatsAppOTPForm({ onSuccess, onError }: WhatsAppOTPFormProps) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState<State>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      setState({
        status: "error",
        message: "Please enter a phone number",
      });
      return;
    }

    setIsSubmitting(true);
    setState(null);

    try {
      // Here you would typically call an API to save the names
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Combine country code and phone number
      const fullPhoneNumber = selectedCountry.code + phone;
      onSuccess?.(fullPhoneNumber);
      // Reset form on success
      setPhone("");
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again.";
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">Your phone number?</h1>
        <p className="text-base">Enter your WhatsApp number.</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="relative">
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
            isDisabled={isSubmitting}
            startContent={
              <Dropdown isDisabled={isSubmitting}>
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
        </div>
      </div>

      {/* Action state messages */}
      {state && (
        <div
          className={`p-3 rounded-lg ${
            state.status === "success"
              ? "bg-success-50 text-success-700 border border-success-200"
              : "bg-danger-50 text-danger-700 border border-danger-200"
          }`}
        >
          {state.message}
        </div>
      )}

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
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Continue"}
      </Button>
    </form>
  );
}
