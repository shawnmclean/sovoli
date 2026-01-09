"use client";

import { useState, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import { ArrowLeftIcon, CheckCircle2Icon } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import posthog from "posthog-js";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { AdSpendStep } from "./steps/AdSpendStep";
import { ReturnStep } from "./steps/ReturnStep";
import { ROASCalculatorStep } from "./steps/ROASCalculatorStep";
import { BusinessNameStep } from "./steps/BusinessNameStep";
import { PhoneStep } from "./steps/PhoneStep";
import { NameStep } from "./steps/NameStep";

type WizardStep =
  | "ad-spend"
  | "return"
  | "roas-calculator"
  | "business-name"
  | "phone"
  | "name"
  | "success";

interface QualificationFormData {
  adSpend: string | null;
  returnValue: number;
  businessName: string;
  phone: string | null;
  phoneRaw: string;
  phoneCountryCode: "US" | "GB" | "GY" | "JM" | undefined;
  firstName: string | null;
  lastName: string | null;
}

export function QualificationWizard() {
  const [step, setStep] = useState<WizardStep>("ad-spend");
  const [formData, setFormData] = useState<QualificationFormData>({
    adSpend: null,
    returnValue: 0,
    businessName: "",
    phone: null,
    phoneRaw: "",
    phoneCountryCode: undefined,
    firstName: null,
    lastName: null,
  });
  const [error, setError] = useState<string | null>(null);

  // Track initial page view with ViewContent
  useEffect(() => {
    posthog.capture("ViewContent", {
      content_name: "Business Qualification Survey",
      content_category: "Business",
      content_type: "survey",
    });
    posthog.capture("QualificationSurveyStarted");
  }, []);

  const handleAdSpendChange = (value: string) => {
    setFormData((prev) => ({ ...prev, adSpend: value }));
    const questionNumber = 1;
    const question = "How much did you spend on ads the past month?";
    posthog.capture("QualificationQuestionAnswered", {
      question_number: questionNumber,
      question,
      response: value,
      step: "ad-spend",
    });
    // Auto-advance to next step
    setTimeout(() => {
      setStep("return");
    }, 300);
  };

  const handleReturnChange = (value: number) => {
    setFormData((prev) => ({ ...prev, returnValue: value }));
  };

  const handleReturnNext = () => {
    const questionNumber = 2;
    const question = "What was your return? How much did you make?";
    posthog.capture("QualificationQuestionAnswered", {
      question_number: questionNumber,
      question,
      response: formData.returnValue,
      response_formatted: `$${formData.returnValue.toLocaleString()} JMD`,
      step: "return",
    });
    setStep("roas-calculator");
  };

  const handleROASCalculatorNext = () => {
    // This is a presentation step, just track that it was viewed
    posthog.capture("QualificationStepViewed", {
      step: "roas-calculator",
    });
    setStep("business-name");
  };

  const handleBusinessNameNext = () => {
    if (
      !formData.businessName.trim() ||
      formData.businessName.trim().length < 2
    ) {
      setError("Business name must be at least 2 characters");
      return;
    }
    setError(null);
    const questionNumber = 4;
    const question = "What's the name of your business?";
    posthog.capture("QualificationQuestionAnswered", {
      question_number: questionNumber,
      question,
      response: formData.businessName.trim(),
      step: "business-name",
    });
    setStep("phone");
  };

  const handlePhoneSuccess = (
    phoneNumber: string,
    rawPhone?: string,
    countryIso?: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      phone: phoneNumber,
      phoneRaw: rawPhone ?? "",
      phoneCountryCode:
        countryIso === "US" ||
        countryIso === "GB" ||
        countryIso === "GY" ||
        countryIso === "JM"
          ? countryIso
          : undefined,
    }));
    const questionNumber = 5;
    const question = "What's your phone number?";
    posthog.capture("QualificationQuestionAnswered", {
      question_number: questionNumber,
      question,
      response: phoneNumber,
      step: "phone",
      $set: {
        phone: phoneNumber,
      },
    });
    setStep("name");
  };

  const handleNameSuccess = (firstName: string, lastName: string) => {
    setFormData((prev) => ({
      ...prev,
      firstName,
      lastName,
    }));
    const questionNumber = 6;
    const question = "What's your name?";
    const fullName = `${firstName} ${lastName}`;

    // Track the final question
    posthog.capture("QualificationQuestionAnswered", {
      question_number: questionNumber,
      question,
      response: fullName,
      step: "name",
      $set: {
        first_name: firstName,
        last_name: lastName,
        name: fullName,
      },
    });

    // Track Lead event (end of funnel)
    posthog.capture("Lead", {
      content_name: "Business Qualification Survey",
      content_category: "Business",
      content_type: "product",
      ad_spend: formData.adSpend,
      return_value: formData.returnValue,
      business_name: formData.businessName,
      phone: formData.phone,
      first_name: firstName,
      last_name: lastName,
      $set: {
        phone: formData.phone,
        first_name: firstName,
        last_name: lastName,
        name: fullName,
      },
    });

    // Complete the survey
    posthog.capture("QualificationSurveyCompleted", {
      ad_spend: formData.adSpend,
      return_value: formData.returnValue,
      business_name: formData.businessName,
      phone: formData.phone,
      first_name: firstName,
      last_name: lastName,
    });

    // For now, just log the data. In the future, submit to API
    console.log("Qualification survey completed:", {
      ...formData,
      firstName,
      lastName,
    });

    setStep("success");
  };

  const handleBack = () => {
    if (step === "return") {
      setStep("ad-spend");
    } else if (step === "roas-calculator") {
      setStep("return");
    } else if (step === "business-name") {
      setStep("roas-calculator");
    } else if (step === "phone") {
      setStep("business-name");
    } else if (step === "name") {
      setStep("phone");
    }
  };

  const getStepInfo = () => {
    const steps: WizardStep[] = [
      "ad-spend",
      "return",
      "roas-calculator",
      "business-name",
      "phone",
      "name",
    ];
    const currentStepIndex = steps.indexOf(step);
    const totalSteps = steps.length;
    const currentStepNumber = currentStepIndex >= 0 ? currentStepIndex + 1 : 0;
    return { currentStepNumber, totalSteps };
  };

  const renderStepCounter = () => {
    if (step === "success") return null;

    const { currentStepNumber, totalSteps } = getStepInfo();

    return (
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 border border-default-200">
          <span className="text-sm font-medium text-default-600">
            {currentStepNumber} / {totalSteps}
          </span>
        </div>
      </div>
    );
  };

  const renderBackButton = () => {
    if (step === "success") return null;

    const isFirstStep = step === "ad-spend";

    return (
      <div className="absolute top-4 left-4 z-10">
        {isFirstStep ? (
          <Button
            as={Link}
            href="/business"
            variant="light"
            isIconOnly
            radius="full"
            className="bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="light"
            isIconOnly
            onPress={handleBack}
            radius="full"
            className="bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
    );
  };

  if (step === "ad-spend") {
    return (
      <div className="min-h-screen flex flex-col">
        {renderBackButton()}
        {renderStepCounter()}
        <div className="flex flex-col px-4 py-8 pt-16">
          <AdSpendStep
            value={formData.adSpend}
            onChange={handleAdSpendChange}
          />
        </div>
      </div>
    );
  }

  if (step === "return") {
    return (
      <div className="min-h-screen flex flex-col">
        {renderBackButton()}
        {renderStepCounter()}
        <div className="flex flex-col px-4 py-8 pt-16 pb-24">
          <ReturnStep
            value={formData.returnValue}
            onChange={handleReturnChange}
          />
        </div>
        {/* Sticky Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-default-200 p-4 z-10">
          <Button
            variant="solid"
            color="primary"
            radius="lg"
            fullWidth
            size="lg"
            onPress={handleReturnNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  if (step === "roas-calculator") {
    return (
      <div className="min-h-screen flex flex-col">
        {renderBackButton()}
        {renderStepCounter()}
        <div className="flex flex-col px-4 py-8 pt-16 pb-24">
          <ROASCalculatorStep
            adSpend={formData.adSpend}
            returnValue={formData.returnValue}
            onNext={handleROASCalculatorNext}
          />
        </div>
        {/* Sticky Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-default-200 p-4 z-10">
          <Button
            variant="solid"
            color="primary"
            radius="lg"
            fullWidth
            size="lg"
            onPress={handleROASCalculatorNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (step === "business-name") {
    const isBusinessNameValid = formData.businessName.trim().length >= 2;
    
    return (
      <div className="min-h-screen flex flex-col">
        {renderBackButton()}
        {renderStepCounter()}
        <div className="flex flex-col px-4 py-8 pt-16 pb-24">
          <BusinessNameStep
            value={formData.businessName}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, businessName: value }))
            }
            onNext={handleBusinessNameNext}
            error={error}
          />
        </div>
        {/* Sticky Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-default-200 p-4 z-10">
          <Button
            variant="solid"
            color="primary"
            radius="lg"
            fullWidth
            size="lg"
            onPress={handleBusinessNameNext}
            isDisabled={!isBusinessNameValid}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  if (step === "phone") {
    return (
      <div className="min-h-screen flex flex-col">
        {renderBackButton()}
        {renderStepCounter()}
        <div className="flex flex-col px-4 py-8 pt-16">
          <PhoneStep
            defaultPhone={formData.phoneRaw || undefined}
            defaultCountryCode={formData.phoneCountryCode}
            onSuccess={handlePhoneSuccess}
          />
        </div>
      </div>
    );
  }

  if (step === "name") {
    return (
      <div className="min-h-screen flex flex-col">
        {renderBackButton()}
        {renderStepCounter()}
        <div className="flex flex-col px-4 py-8 pt-16">
          <NameStep
            defaultFirstName={formData.firstName ?? undefined}
            defaultLastName={formData.lastName ?? undefined}
            onSuccess={handleNameSuccess}
            onError={(message) => setError(message)}
          />
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-danger/10 text-danger border border-danger/20">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === "success") {
    const whatsappMessage = formData.businessName
      ? `Hello! I just completed the qualification survey for ${formData.businessName}. I'd like to learn more about how Sovoli can help improve my ROAS.`
      : "Hello! I just completed the qualification survey. I'd like to learn more about how Sovoli can help improve my ROAS.";

    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2Icon className="h-16 w-16 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2 sm:text-3xl">
              Thank you{formData.firstName ? `, ${formData.firstName}` : ""}!
            </h2>
            <p className="text-base text-default-600 sm:text-lg mb-6">
              We&apos;ll review your information and get back to you soon.
            </p>
          </div>
          <div className="w-full max-w-md">
            <Button
              as={WhatsAppLink}
              message={whatsappMessage}
              size="lg"
              color="primary"
              variant="solid"
              radius="full"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              event="WhatsAppContactFromQualification"
              eventProperties={{
                intent: "Contact",
                role: "admin",
                page: "qualification-success",
                funnel: "business_qualification",
                source: "sovoli_web",
              }}
            >
              <SiWhatsapp className="mr-2 h-5 w-5" />
              Contact Us on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
