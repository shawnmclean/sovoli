import { Button } from "@sovoli/ui/components/button";
import Link from "next/link";
import { MessageSquareIcon, MegaphoneIcon } from "lucide-react";

export default function GuidesPage() {
  return (
    <div className="flex min-h-[60vh] flex-col py-12">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Guides</h1>
          <p className="text-lg text-default-600">
            Step-by-step guides to help you get the most out of Sovoli
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            as={Link}
            href="/docs/guides/whatsapp"
            variant="bordered"
            className="h-auto flex-col items-start gap-3 p-6"
            radius="lg"
          >
            <div className="flex items-center gap-3">
              <MessageSquareIcon size={24} />
              <span className="text-lg font-semibold">WhatsApp</span>
            </div>
            <p className="text-left text-sm text-default-600">
              Learn how to set up and use WhatsApp features
            </p>
          </Button>

          <Button
            as={Link}
            href="/docs/guides/ads"
            variant="bordered"
            className="h-auto flex-col items-start gap-3 p-6"
            radius="lg"
          >
            <div className="flex items-center gap-3">
              <MegaphoneIcon size={24} />
              <span className="text-lg font-semibold">Ads</span>
            </div>
            <p className="text-left text-sm text-default-600">
              Create and manage advertising campaigns
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
}
