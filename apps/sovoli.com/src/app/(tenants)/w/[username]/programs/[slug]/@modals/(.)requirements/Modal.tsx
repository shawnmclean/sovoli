"use client";
import { Modal, ModalContent, ModalHeader } from "@sovoli/ui/components/dialog";
import { useRouter } from "next/navigation";
import type { Program } from "~/modules/academics/types";

interface RequirementsModalProps {
  program: Program;
}

export function RequirementsModal({ program }: RequirementsModalProps) {
  const router = useRouter();
  return (
    <Modal
      isOpen={true}
      onOpenChange={() => {
        // use 2 because the first page may be the browser's default page
        if (history.length <= 2) {
          router.push(`/programs/${program.slug}`);
        } else {
          router.back();
        }
      }}
      size="full"
    >
      <ModalContent>
        <ModalHeader>
          <h2>
            Requirements for{" "}
            {program.name ??
              program.standardProgramVersion?.program.name ??
              "Program"}
          </h2>
        </ModalHeader>
      </ModalContent>
    </Modal>
  );
}
