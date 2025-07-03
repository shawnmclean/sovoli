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
import { Slider, SliderValue } from "@sovoli/ui/components/slider";
import { useState } from "react";

export interface ContentItemProps {
  orgInstance: OrgInstance;
}

export function ContentItem({ orgInstance }: ContentItemProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [zoomLevel, setZoomLevel] = useState<SliderValue>(100);

  // Convert zoom level to scale (100 = 1.0, 200 = 2.0, etc.)
  const scale = (zoomLevel as number) / 100;

  return (
    <div>
      <Button onPress={onOpen}>Enrollment Open</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
        <ModalContent className="flex flex-col h-screen max-h-screen">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 flex-shrink-0">
                <h2 className="text-lg font-semibold">Enrollment Flier</h2>
                <p className="text-sm text-gray-600">
                  Use the slider to zoom in and out
                </p>
              </ModalHeader>
              <ModalBody className="p-0 flex-1 overflow-hidden">
                {/* Canvas container with fixed aspect ratio and zoom support */}
                <div className="w-full h-full bg-gray-100 flex items-center justify-center p-4 print:p-0 print:bg-white">
                  {/* Canvas wrapper with overflow and centering */}
                  <div className="w-full h-full overflow-auto flex items-center justify-center">
                    {/* A4 Canvas Container - maintains aspect ratio */}
                    <div
                      className="relative bg-white border-3 border-blue-800 rounded-xl shadow-lg print:shadow-none print:rounded-none print:border-0 flex-shrink-0"
                      style={{
                        width: "794px",
                        height: "1123px",
                        transform: `scale(${scale})`,
                        transformOrigin: "center center",
                        transition: "transform 0.2s ease-out",
                      }}
                    >
                      <EnrollmentFlier orgInstance={orgInstance} />
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex-shrink-0">
                <div className="flex items-center gap-4 flex-1">
                  <Slider
                    aria-label="Zoom level"
                    classNames={{
                      filler: "hidden",
                    }}
                    size="sm"
                    minValue={25}
                    maxValue={300}
                    value={zoomLevel}
                    onChange={setZoomLevel}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 min-w-[40px]">
                    {zoomLevel}%
                  </span>
                </div>
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
