import { Button } from "@sovoli/ui/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@sovoli/ui/components/ui/dialog";

export interface MediaManagerProps {
  knowledgeId: string;
  onClosed: () => void;
}

export function MediaManagerDialog({
  knowledgeId,
  onClosed,
}: MediaManagerProps) {
  const { isOpen, onOpenChange } = useDisclosure({
    defaultOpen: true,
  });

  const onOpenChangeHandler = () => {
    onOpenChange();
    onClosed();
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChangeHandler}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Modal Title
            </ModalHeader>
            <ModalBody>
              <p>{knowledgeId}</p>
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
  );
}
