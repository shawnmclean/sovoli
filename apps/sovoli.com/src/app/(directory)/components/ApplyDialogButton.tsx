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
              <ModalBody>Applications are coming soon.</ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={close}>
                  Close
                </Button>
                <Button
                  as="a"
                  href={`https://wa.me/5926082743?text=${encodeURIComponent(
                    `Applying to ${orgName}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="success"
                >
                  WhatsApp Us
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
