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
import { OrgInstance } from "~/modules/organisations/types";
import { EnrollmentFlier } from "./EnrollmentFlier";

export interface ContentItemProps {
  orgInstance: OrgInstance;
}

export function ContentItem({ orgInstance }: ContentItemProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div>
      <Button onPress={onOpen}>Enrollment Open</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <EnrollmentFlier orgInstance={orgInstance} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
