"use client";

import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { SearchIcon } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-12">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Learning Center
          </h1>
        </div>

        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Search documentation..."
            className="flex-1"
            startContent={<SearchIcon size={16} className="text-default-400" />}
            readOnly
          />
        </div>

        <div className="pt-4">
          <Button as={Link} href="/docs/guides" radius="full" size="lg">
            Browse Guides
          </Button>
        </div>
      </div>
    </div>
  );
}
