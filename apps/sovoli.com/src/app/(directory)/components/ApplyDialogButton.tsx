"use client";

import { Button } from "@sovoli/ui/components/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@sovoli/ui/components/dialog";
import { WhatsAppButton } from "~/components/WhatsAppButton";

interface ApplyDialogButtonProps {
  orgName: string;
}

export function ApplyDialogButton({ orgName }: ApplyDialogButtonProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button color="primary" fullWidth onPress={onOpen}>
        Apply
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader>Apply to {orgName}</ModalHeader>
              <ModalBody>
                Send us a WhatsApp message and we will package and forward your
                application to the school of your choice.
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={close}>
                  Close
                </Button>
                <WhatsAppButton
                  phoneNumber="+5926082743"
                  message={`Applying to ${orgName}`}
                >
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
