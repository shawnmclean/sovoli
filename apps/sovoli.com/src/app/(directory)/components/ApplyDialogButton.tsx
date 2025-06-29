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
import { CheckCircleIcon, InfoIcon } from "lucide-react";
import { Divider } from "@sovoli/ui/components/divider";
import { WhatsAppLink } from "~/components/WhatsAppLink";

interface ApplyDialogButtonProps {
  orgName: string;
  orgId: string;
  children?: React.ReactNode;
}

export function ApplyDialogButton({
  orgName,
  orgId,
  children,
}: ApplyDialogButtonProps) {
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
      <Button
        color="primary"
        fullWidth
        onPress={onOpen}
        data-attr="apply-dialog-open"
        data-school={orgName}
      >
        {children ?? "Apply to School Now"}
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
                <h2 className="text-2xl font-semibold">Requirements</h2>
              </ModalHeader>
              <ModalBody>
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
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  as={WhatsAppLink}
                  message={`Hello, I'd like to apply to ${orgName}.`}
                  intent="apply_school"
                  role="parent"
                  page="details"
                  orgId={orgId}
                  orgName={orgName}
                  funnel="application"
                >
                  Begin Application
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
