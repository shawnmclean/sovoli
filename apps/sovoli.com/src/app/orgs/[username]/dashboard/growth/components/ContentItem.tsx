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
import type { OrgInstance } from "~/modules/organisations/types";
import { EnrollmentFlier } from "./EnrollmentFlier";
import type { SliderValue } from "@sovoli/ui/components/slider";
import { Slider } from "@sovoli/ui/components/slider";
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PrinterIcon } from "lucide-react";

export interface ContentItemProps {
  orgInstance: OrgInstance;
}

export function ContentItem({ orgInstance }: ContentItemProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [zoomLevel, setZoomLevel] = useState<SliderValue>(29);
  const printRef = useRef<HTMLDivElement>(null);

  // Convert zoom level to scale (100 = 1.0, 200 = 2.0, etc.)
  const scale = (zoomLevel as number) / 100;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: `
      @page { size: 8.5in 11in; margin: 0; }
      body { background: white !important; color-adjust: exact !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .enrollment-flier-container {
        width: 8.5in !important;
        height: 11in !important;
        background: white !important;
        box-shadow: none !important;
        border: none !important;
      }
      @media print {
        .enrollment-flier-container {
          transform: none !important;
          transition: none !important;
        }
      }
    `,
  });

  return (
    <div>
      <Button onPress={onOpen}>Enrollment Open</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
        <ModalContent className="flex flex-col h-screen max-h-screen">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 flex-shrink-0">
                <h2 className="text-lg font-semibold">Enrollment Flier</h2>
                <p className="text-sm text-gray-600">
                  Use the slider to zoom in and out
                </p>
              </ModalHeader>
              <ModalBody className="p-2 flex-1 overflow-hidden">
                <div
                  className="w-full h-full overflow-auto flex items-center justify-center"
                  style={{
                    WebkitOverflowScrolling: "touch",
                    WebkitUserSelect: "none",
                    userSelect: "none",
                  }}
                >
                  <div
                    ref={printRef}
                    className="relative bg-white border border-gray-300 rounded-lg shadow-lg flex-shrink-0 enrollment-flier-container"
                    style={{
                      width: "816px", // 8.5 inches at 96 DPI
                      height: "1056px", // 11 inches at 96 DPI
                      transform: `scale(${scale})`,
                      transformOrigin: "center center",
                      transition: "transform 0.2s ease-out",
                    }}
                  >
                    <EnrollmentFlier orgInstance={orgInstance} />
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
                  <Button
                    isIconOnly
                    color="primary"
                    onPress={() => handlePrint()}
                  >
                    <PrinterIcon className="w-5 h-5" />
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
