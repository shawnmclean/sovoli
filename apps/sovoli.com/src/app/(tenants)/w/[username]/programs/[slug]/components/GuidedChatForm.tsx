"use client";

import React from "react";
import { Input } from "@sovoli/ui/components/input";
import { NumberInput } from "@sovoli/ui/components/number-input";
import { Button } from "@sovoli/ui/components/button";
import { Card } from "@sovoli/ui/components/card";
import { MessageSquareIcon, SendIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { gradientBorderButton } from "~/components/GradientBorderButton";
import { ChatMessage } from "./ChatMessage";
import { useGuidedChat } from "./hooks/useGuidedChat";
import { pluralize } from "~/utils/pluralize";

interface GuidedChatFormProps {
  whatsappNumber?: string;
  onClose?: () => void;
  cycle?: string;
  level?: string;
}

export function GuidedChatForm({
  whatsappNumber,
  onClose: _onClose,
  cycle,
  level,
}: GuidedChatFormProps) {
  const {
    step,
    phoneNumber,
    setPhoneNumber,
    childCount,
    setChildCount,
    children,
    currentChildIndex,
    previewMessage,
    handleContinue,
    isDone,
    updateChildAge,
  } = useGuidedChat({ cycle, level });

  const renderInput = () => {
    if (step === 1) {
      return (
        <Input
          type="tel"
          placeholder="Enter your WhatsApp number"
          value={phoneNumber}
          onValueChange={setPhoneNumber}
          autoFocus
        />
      );
    }

    if (step === 2) {
      return (
        <NumberInput
          min={1}
          placeholder="Number of children"
          value={childCount}
          onValueChange={setChildCount}
        />
      );
    }

    if (step === 3) {
      return (
        <NumberInput
          min={2}
          max={5}
          placeholder={`Enter age for child ${currentChildIndex + 1}`}
          value={children[currentChildIndex]}
          onValueChange={(val) => updateChildAge(currentChildIndex, val)}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh]">
      <Card className="flex-grow overflow-hidden flex flex-col">
        <div className="flex-grow overflow-y-auto p-4 flex flex-col justify-end">
          <div className="space-y-4">
            <ChatMessage
              sender="system"
              message="Welcome! Let's get started."
            />

            {/* Step 1: Phone number */}
            {step >= 1 && (
              <ChatMessage
                sender="system"
                message="What's your WhatsApp number?"
              />
            )}
            {step >= 2 && phoneNumber && (
              <ChatMessage sender="user" message={phoneNumber} />
            )}

            {/* Step 2: Number of children */}
            {step >= 2 && (
              <ChatMessage
                sender="system"
                message="How many children do you have?"
              />
            )}
            {step >= 3 && childCount > 0 && (
              <ChatMessage
                sender="user"
                message={`I have ${childCount} ${pluralize(
                  childCount,
                  "child",
                  "children",
                )}.`}
              />
            )}

            {/* Step 3: Child ages - show each child's question and answer */}
            {step >= 3 && (
              <>
                {/* Show all previous child age questions and answers */}
                {Array.from({ length: currentChildIndex }, (_, index) => (
                  <React.Fragment key={`child-${index}`}>
                    <ChatMessage
                      sender="system"
                      message={`How old is child ${index + 1}?`}
                    />
                    {children[index] && (
                      <ChatMessage
                        sender="user"
                        message={`Child ${index + 1} is ${children[index]} years old.`}
                      />
                    )}
                  </React.Fragment>
                ))}
                {/* Show current child question if not done */}
                {currentChildIndex < childCount && (
                  <ChatMessage
                    sender="system"
                    message={`How old is child ${currentChildIndex + 1}?`}
                  />
                )}
              </>
            )}

            {/* Final summary */}
            {step === 4 && (
              <>
                <ChatMessage
                  sender="system"
                  message="Great! Here's what will be sent to the school's WhatsApp:"
                />
                <ChatMessage sender="user" message={`${previewMessage()}`} />
              </>
            )}
          </div>
        </div>

        {/* Chat input bar */}
        {step < 4 && (
          <div className="p-4 border-t border-divider flex items-center gap-2">
            <div className="flex-grow">{renderInput()}</div>
            <Button color="primary" onPress={handleContinue} isIconOnly>
              <SendIcon size={16} />
            </Button>
          </div>
        )}
      </Card>
      {isDone && (
        <Card className="mt-2 p-4">
          <Button
            as={WhatsAppLink}
            phoneNumber={whatsappNumber}
            message={previewMessage()}
            intent="Contact"
            page="mobile-footer"
            color="primary"
            fullWidth
            startContent={<MessageSquareIcon size={16} />}
            className={gradientBorderButton()}
          >
            Send & Start Chat
          </Button>
        </Card>
      )}
    </div>
  );
}
