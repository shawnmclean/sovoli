"use client";

import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { ArrowRightIcon } from "lucide-react";

export function BusinessStickyFooter() {
  return (
    <footer className="sticky bottom-0 left-0 right-0 z-50 border-t border-default-200 bg-background/95 backdrop-blur-md shadow-lg md:hidden">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <Button
          as={Link}
          href="/signup/business"
          color="primary"
          size="lg"
          fullWidth
          radius="full"
          className="font-semibold text-base"
          endContent={<ArrowRightIcon className="h-5 w-5" />}
        >
          Start now
        </Button>
      </div>
    </footer>
  );
}
