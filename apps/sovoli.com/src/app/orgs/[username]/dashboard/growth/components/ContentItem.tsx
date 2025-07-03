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
                <h2 className="text-lg font-semibold">Enrollment Flier</h2>
                <p className="text-sm text-gray-600">
                  Pinch and zoom to view details
                </p>
              </ModalHeader>
              <ModalBody className="p-0">
                {/* Container with pinch and zoom support */}
                <div className="w-full h-full bg-gray-100 p-4 print:p-0 print:bg-white">
                  {/* Mobile container with pinch and zoom */}
                  <div className="w-full h-full overflow-auto">
                    {/* A4 Flier Container - starts at container size, allows zoom */}
                    <div className="w-full max-w-full h-auto bg-white border-3 border-blue-800 rounded-xl shadow-lg mx-auto relative overflow-hidden print:w-[210mm] print:h-[297mm] print:shadow-none print:rounded-none print:border-0 print:mx-0 print:max-w-none">
                      <EnrollmentFlier orgInstance={orgInstance} />
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Print
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
