"use client";

import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";
import {
  BookOpenIcon,
  HomeIcon,
  ImageIcon,
  MoreHorizontalIcon,
  SendIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { tv } from "tailwind-variants";
import type { OrgInstance } from "~/modules/organisations/types";

const footerButton = tv({
  base: "flex flex-col items-center justify-center h-16 w-16 text-foreground-500",
  variants: {
    isSelected: {
      true: "border-t-2 border-primary-500 ",
      false: "",
    },
  },
  defaultVariants: {
    isSelected: false,
  },
});

export interface MobileFooterProps {
  orgInstance: OrgInstance;
}

export function MobileFooter({ orgInstance: _orgInstance }: MobileFooterProps) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isPrograms = pathname === "/programs";
  const isGallery = pathname === "/gallery";
  const isMore = pathname === "/more";

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-content1 shadow-lg pb-2 px-2 md:hidden z-40">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 justify-start gap-2">
          <Button
            as={Link}
            href="/"
            variant="light"
            color="default"
            size="sm"
            className={footerButton({ isSelected: isHome })}
          >
            <HomeIcon className="text-sm mt-2" />
            <span className="text-xs mt-0.5">Home</span>
          </Button>
          <Button
            as={Link}
            href="/programs"
            variant="light"
            color="default"
            size="sm"
            className={footerButton({ isSelected: isPrograms })}
          >
            <BookOpenIcon className="text-sm mt-2" />
            <span className="text-xs mt-0.5">Programs</span>
          </Button>
        </div>
        <div className="flex justify-center">
          <Button
            as={Link}
            href="/apply"
            variant="shadow"
            color="primary"
            isIconOnly
            radius="md"
            className="-mt-8 mx-4"
            size="lg"
          >
            <SendIcon className="text-xl" />
          </Button>
        </div>
        <div className="flex flex-1 justify-end gap-2">
          <Button
            as={Link}
            href="/gallery"
            variant="light"
            color="default"
            size="sm"
            className={footerButton({ isSelected: isGallery })}
          >
            <ImageIcon className="text-sm mt-2" />
            <span className="text-xs mt-0.5">Gallery</span>
          </Button>
          <Button
            as={Link}
            href="/more"
            variant="light"
            color="default"
            size="sm"
            className={footerButton({ isSelected: isMore })}
          >
            <MoreHorizontalIcon className="text-sm mt-2" />
            <span className="text-xs mt-0.5">More</span>
          </Button>
        </div>
      </div>
    </footer>
  );
}
