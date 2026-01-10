"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@sovoli/ui/components/dialog";
import { XIcon } from "lucide-react";
import { Button } from "@sovoli/ui/components/button";

interface ClickableImageProps {
  src: StaticImageData | string;
  alt: string;
  className?: string;
}

export function ClickableImage({ src, alt, className = "" }: ClickableImageProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className={`cursor-pointer hover:opacity-90 transition-opacity ${className}`}
        aria-label={`Click to view full size: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          className="my-6 rounded-lg w-full h-auto"
        />
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full" hideCloseButton>
        <ModalContent className="max-w-full w-full h-full m-0 rounded-none">
          <ModalHeader className="flex items-center justify-end p-4">
            <Button
              isIconOnly
              onPress={onOpenChange}
              variant="light"
              aria-label="Close image"
            >
              <XIcon size={24} />
            </Button>
          </ModalHeader>
          <ModalBody className="p-0 flex-1 overflow-hidden flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center p-4">
              <Image
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
