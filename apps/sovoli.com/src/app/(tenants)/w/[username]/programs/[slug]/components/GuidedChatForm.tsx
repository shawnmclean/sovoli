"use client";

import React from "react";
import { Input } from "@sovoli/ui/components/input";
import { NumberInput } from "@sovoli/ui/components/number-input";
import { Button } from "@sovoli/ui/components/button";
import { MessageSquareIcon, SendIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { gradientBorderButton } from "~/components/GradientBorderButton";
import { ChatMessage } from "./ChatMessage";
import { useGuidedChat } from "./hooks/useGuidedChat";
import { pluralize } from "~/utils/pluralize";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@sovoli/ui/components/dialog";

interface GuidedChatFormProps {
  whatsappNumber?: string;
  cycle?: string;
  level?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuidedChatForm({
  whatsappNumber,
  cycle,
  level,
  isOpen,
  onOpenChange,
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
          fullWidth
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
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      size="full"
      onOpenChange={onOpenChange}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.3,
            },
          },
          exit: {
            y: 100,
            opacity: 0,
            transition: {
              duration: 0.3,
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Enrollment Assistant</ModalHeader>
            <ModalBody className="p-0 h-[calc(100vh-200px)]">
              <div className="flex flex-col h-full">
                <div className="flex-grow overflow-y-auto p-4 flex flex-col justify-end">
                  <div className="space-y-4">
                    <ChatMessage
                      sender="system"
                      message="👋 Welcome! Let's get you started."
                    />

                    {/* Step 1: Phone number */}
                    {step >= 1 && (
                      <ChatMessage
                        sender="system"
                        message="📱 What's your WhatsApp number so we can reach you?"
                      />
                    )}
                    {step >= 2 && phoneNumber && (
                      <ChatMessage sender="user" message={phoneNumber} />
                    )}

                    {/* Step 2: Number of children */}
                    {step >= 2 && (
                      <ChatMessage
                        sender="system"
                        message="👶 How many children are you enrolling?"
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
                        {/* Show all child age questions and answers */}
                        {Array.from({ length: childCount }, (_, index) => (
                          <React.Fragment key={`child-${index}`}>
                            <ChatMessage
                              sender="system"
                              message={`✅ Got it. How old is child ${index + 1}?`}
                            />
                            {children[index] && children[index] > 0 && (
                              <ChatMessage
                                sender="user"
                                message={`Child #${index + 1} is ${children[index]} years old.`}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </>
                    )}

                    {/* Final summary */}
                    {step === 4 && (
                      <>
                        <ChatMessage
                          sender="system"
                          message="🎉 All set! Tap below to send this to our enrollment assistant on WhatsApp."
                        />
                        <ChatMessage
                          sender="user"
                          message={`${previewMessage()}`}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              {/* Chat input bar */}
              {step < 4 && (
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-grow">{renderInput()}</div>
                  <Button color="primary" onPress={handleContinue} isIconOnly>
                    <SendIcon size={16} />
                  </Button>
                </div>
              )}
              {isDone && (
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
                  onPress={onClose}
                >
                  Send & Start Chat
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
