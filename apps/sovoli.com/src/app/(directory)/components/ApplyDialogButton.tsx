"use client";

import React from "react";

import { useDisclosure } from "@sovoli/ui/components/dialog";
import { Button } from "@sovoli/ui/components/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@sovoli/ui/components/dialog";
import { Card } from "@sovoli/ui/components/card";
import { CheckCircleIcon, InfoIcon } from "lucide-react";
import { Divider } from "@sovoli/ui/components/divider";
import { WhatsAppButton } from "~/components/WhatsAppButton";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";

interface ApplyDialogButtonProps {
  orgName: string;
}

export function ApplyDialogButton({ orgName }: ApplyDialogButtonProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const documentList = [
    "Birth Certificate (scan or photo)",
    "Two Passport Photos",
    "Proof of Address",
    "Parent/Guardian ID (front & back)",
    "Immunization or Clinic Card",
    "Medical Records (if any)",
    "Previous School Report (if applicable)",
    "Transport Info (e.g., how child gets to school)",
  ];

  const additionalInfo = [
    "Child's Full Name and Date of Birth",
    "Grade level applying for",
    "Your name and contact info",
    "Preferred school (optional)",
  ];

  return (
    <>
      <Button color="primary" fullWidth onPress={onOpen}>
        Apply
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold">Apply to {orgName}</h2>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-primary-700">
                  Sovoli helps parents like you apply directly to top private
                  schools. We make the process easier by packaging your
                  documents and forwarding them to the school for review.
                </p>

                <h3 className="text-lg font-semibold mb-2">
                  What you'll need to send via WhatsApp:
                </h3>
                <ul className="space-y-2 mb-4">
                  {documentList.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="text-success mr-2 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Divider className="my-4" />
                <h3 className="text-lg font-semibold mb-2">Also include:</h3>
                <ul className="space-y-2 mb-4">
                  {additionalInfo.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <InfoIcon className="text-primary mr-2 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-warning-700">
                  We'll confirm your documents and submit them to the school. If
                  they aren't currently accepting, we'll notify you about
                  similar schools nearby.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <WhatsAppButton
                  phoneNumber="+5926082743"
                  message={`Hello, I'd like to apply to ${orgName}.`}
                >
                  <SiWhatsapp className="mr-2" />
                  Message Us
                </WhatsAppButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
