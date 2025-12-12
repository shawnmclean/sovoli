"use client";

import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import overviewImage from "./overview.webp";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  ModalHeader,
} from "@sovoli/ui/components/dialog";
import { Button } from "@sovoli/ui/components/button";
import type { GrowthSystemContent } from "../content";

interface OverviewProps {
	content: GrowthSystemContent["overview"];
}

export function Overview({ content }: OverviewProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <section className="py-6 px-2 sm:py-16">
      <div className="mx-auto max-w-6xl text-center">
        {/* Title */}
        <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight text-foreground">
          Grow your{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {content.businessType}
          </span>{" "}
          with Digital Marketing Systems
        </h2>

        {/* Description */}
        <div className="text-base sm:text-xl text-foreground mb-8 max-w-4xl mx-auto leading-relaxed px-4">
          {content.description}
        </div>

        {/* Overview Image */}
        <div className="relative mx-2 sm:mx-4">
          <div className="relative aspect-[16/10] sm:aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="absolute inset-2 sm:inset-4 rounded-lg overflow-hidden">
              <Image
                src={overviewImage}
                alt="Growth System Dashboard Overview"
                fill
                className="object-contain cursor-pointer hover:opacity-90 transition-opacity"
                priority
                onClick={onOpen}
              />
            </div>
          </div>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-transparent to-white/5 pointer-events-none" />
        </div>
      </div>

      {/* Full Screen Modal */}
      <Modal isOpen={isOpen} onOpenChange={onClose} size="full" hideCloseButton>
        <ModalContent>
          <ModalHeader className="flex items-center justify-between">
            <Button variant="light" isIconOnly radius="full" onPress={onClose}>
              <ChevronLeftIcon />
            </Button>
          </ModalHeader>
          <ModalBody className="p-0 flex-1 overflow-hidden">
            <div className="w-full h-full relative flex items-center justify-center">
              <Image
                src={overviewImage}
                alt="Growth System Dashboard Overview"
                fill
                className="object-contain"
                priority
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  );
}
