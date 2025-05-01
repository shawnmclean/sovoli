"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@sovoli/ui/components/dialog";

import mockupStudentProfile from "./mockup-student-profile.png";

const mockups = [
  {
    src: mockupStudentProfile,
    alt: "Student Profile View",
  },
];

export function GallerySection() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<{
    src: StaticImageData;
    alt: string;
  } | null>(null);

  const handleImageClick = (mockup: { src: StaticImageData; alt: string }) => {
    setSelectedImage(mockup);
    onOpen();
  };

  return (
    <section className="w-full pt-12">
      <div className="mx-auto max-w-5xl px-2 text-center">
        <h2 className="mb-2 text-xl font-semibold text-default-900">
          See how Sovoli transforms school recordkeeping
        </h2>
        <p className="mb-8 text-default-500">
          Simple, secure, and built for your daily flow.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {mockups.map((mockup, i) => (
            <button
              key={i}
              onClick={() => handleImageClick(mockup)}
              className="rounded-xl border border-default-200 p-2 shadow-sm transition-shadow hover:shadow-md focus:outline-none"
            >
              <Image
                src={mockup.src}
                alt={mockup.alt}
                className="h-auto w-full rounded-md object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        size="3xl"
        placement="center"
      >
        <ModalContent>
          <ModalHeader>{selectedImage?.alt}</ModalHeader>
          <ModalBody>
            {selectedImage && (
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="h-auto w-full rounded-lg"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  );
}
