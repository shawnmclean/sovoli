import Link from "next/link";
import { Card, CardHeader } from "@sovoli/ui/components/card";
import { Image } from "@sovoli/ui/components/image";

export interface BusinessCardData {
  id: string;
  goal: string;
  description: string;
  href: string;
  image: string;
  gradient: string;
}

export function BusinessCard({ industry }: { industry: BusinessCardData }) {
  return (
    <Link href={industry.href} className="block aspect-square">
      <Card className="h-full relative overflow-hidden">
        <Image
          removeWrapper
          alt={industry.goal}
          className="z-0 w-full h-full object-cover"
          src={industry.image}
        />
        {/* Gradient overlay at bottom for text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <CardHeader className="absolute z-20 bottom-0 left-0 right-0 flex-col !items-start pb-4 px-4">
          <h4 className="text-white font-medium text-large drop-shadow-lg">
            {industry.goal}
          </h4>
        </CardHeader>
      </Card>
    </Link>
  );
}
