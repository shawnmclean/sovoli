"use client";

import type { Area, Point } from "react-easy-crop";
import { useState } from "react";
import { Button } from "@sovoli/ui/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@sovoli/ui/components/ui/dialog";
import { Slider } from "@sovoli/ui/components/ui/slider";
import Cropper from "react-easy-crop";

import { ImageFileInput } from "./ImageFileInput";

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
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const onOpenChangeHandler = () => {
    onOpenChange();
    onClosed();
  };

  const onCancel = () => {
    if (imageSrc) {
      setImageSrc(null);
    } else {
      onClosed();
    }
  };

  const handleFileDropped = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageFile = event.target?.result as string;
      setImageSrc(imageFile);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChangeHandler}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Manage Media - {knowledgeId}
            </ModalHeader>
            <ModalBody className="p-5">
              {imageSrc ? (
                <ImageCropper imageSrc={imageSrc} />
              ) : (
                <ImageFileInput
                  name="csvFile"
                  onFileDropped={handleFileDropped}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onCancel}>
                Cancel
              </Button>
              <Button color="primary" onPress={onClose}>
                Upload
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function ImageCropper({ imageSrc }: { imageSrc: string }) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    console.log(croppedArea, croppedAreaPixels);
  };

  return (
    <div>
      <div className="relative h-48 w-full bg-gray-800 sm:h-96">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div>
        <Slider
          size="sm"
          aria-label="Zoom"
          value={zoom}
          minValue={1}
          maxValue={3}
          step={0.1}
          onChange={(value) => setZoom(value as number)}
        />
      </div>
    </div>
  );
}
