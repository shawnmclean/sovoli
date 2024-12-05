"use client";

import type { Point } from "react-easy-crop";
import { useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@sovoli/ui/components/ui/alert";
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
import { useFormState, useFormStatus } from "react-dom";
import Cropper from "react-easy-crop";

import type { State } from "../actions/updateMediaAssetAction";
import type { CropOptions } from "~/core/image/getCroppedImage";
import { getCroppedImage } from "~/core/image/getCroppedImage";
import { updateMediaAssetAction } from "../actions/updateMediaAssetAction";
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
  const [crop, setCrop] = useState<CropOptions | null>(null);
  const [state, updateMediaAssetFormAction] = useFormState<State, FormData>(
    updateMediaAssetAction,
    null,
  );

  useEffect(() => {
    if (state?.status === "success") {
      onClosed();
    }
  }, [onClosed, state]);

  const handleOnOpen = () => {
    onOpenChange();
    onClosed();
  };

  const handleCancel = () => {
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

  const formAction = async (formData: FormData) => {
    if (imageSrc && crop) {
      const croppedImage = await getCroppedImage({
        imageSrc: imageSrc,
        crop: crop,
      });

      formData.set("image", croppedImage);
    }
    updateMediaAssetFormAction(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleOnOpen}
      size="2xl"
      placement="center"
      isDismissable={false}
    >
      <ModalContent>
        <form action={formAction} method="post">
          <input type="hidden" name="knowledgeId" value={knowledgeId} />
          <ModalHeader className="flex flex-col gap-1">
            Manage Media - {knowledgeId}
          </ModalHeader>
          <ModalBody className="p-5">
            <div className={imageSrc ? "hidden" : ""}>
              <ImageFileInput name="image" onFileDropped={handleFileDropped} />
            </div>
            {imageSrc ? (
              <ImageCropper imageSrc={imageSrc} onCropComplete={setCrop} />
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleCancel}>
              Cancel
            </Button>
            <SubmitButton isDisabled={imageSrc === null} />

            {state && (
              <Alert variant="danger">
                <AlertTitle>{state.status}</AlertTitle>
                <AlertDescription>
                  <p>{state.message}</p>
                  <ul>
                    {Object.entries(state.errors ?? {}).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}</strong>: {value}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedArea: CropOptions) => void;
}
function ImageCropper({ imageSrc, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-[400px] w-full bg-gray-800">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          // to match aspect ratio of recommended Open Graph ratio
          aspect={1.91 / 1}
          onCropChange={setCrop}
          onCropComplete={(croppedArea, croppedAreaPixels) =>
            onCropComplete(croppedAreaPixels)
          }
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

function SubmitButton({ isDisabled }: { isDisabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      color="primary"
      isLoading={pending}
      isDisabled={isDisabled}
    >
      Upload
    </Button>
  );
}
