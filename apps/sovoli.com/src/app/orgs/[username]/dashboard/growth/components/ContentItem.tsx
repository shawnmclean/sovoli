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
import { useState, useRef, useCallback, useEffect } from "react";

export interface ContentItemProps {
  orgInstance: OrgInstance;
}

export function ContentItem({ orgInstance }: ContentItemProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [zoomLevel, setZoomLevel] = useState<SliderValue>(100);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPinching, setIsPinching] = useState(false);
  const [initialDistance, setInitialDistance] = useState(0);
  const [initialZoom, setInitialZoom] = useState(100);

  // Convert zoom level to scale (100 = 1.0, 200 = 2.0, etc.)
  const scale = (zoomLevel as number) / 100;

  // Calculate distance between two touch points
  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle touch start for pinch gestures
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 2) {
        setIsPinching(true);
        const distance = getDistance(e.touches[0], e.touches[1]);
        setInitialDistance(distance);
        setInitialZoom(zoomLevel as number);
        e.preventDefault();
      }
    },
    [zoomLevel],
  );

  // Handle touch move for pinch gestures
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isPinching && e.touches.length === 2) {
        const distance = getDistance(e.touches[0], e.touches[1]);
        const scale = distance / initialDistance;
        const newZoom = Math.max(25, Math.min(300, initialZoom * scale));
        setZoomLevel(newZoom);
        e.preventDefault();
      }
    },
    [isPinching, initialDistance, initialZoom],
  );

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    setIsPinching(false);
  }, []);

  // Add touch event listeners to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

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
                  Use the slider or pinch to zoom in and out
                </p>
              </ModalHeader>
              <ModalBody className="p-0 flex-1 overflow-hidden">
                {/* Canvas container */}
                <div className="w-full h-full flex items-center justify-center p-4">
                  {/* Canvas wrapper with zoom support */}
                  <div
                    ref={canvasRef}
                    className="w-full h-full overflow-auto flex items-center justify-center"
                    style={{
                      touchAction: "none",
                      WebkitOverflowScrolling: "touch",
                      WebkitUserSelect: "none",
                      userSelect: "none",
                    }}
                  >
                    {/* Canvas content container */}
                    <div
                      className="relative bg-white border border-gray-300 rounded-lg shadow-lg flex-shrink-0"
                      style={{
                        width: "816px", // 8.5 inches at 96 DPI
                        height: "1056px", // 11 inches at 96 DPI
                        transform: `scale(${scale})`,
                        transformOrigin: "center center",
                        transition: isPinching
                          ? "none"
                          : "transform 0.2s ease-out",
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
