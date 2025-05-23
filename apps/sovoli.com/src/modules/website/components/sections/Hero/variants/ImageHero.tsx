import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { Image } from "@sovoli/ui/components/image";
import { tv } from "tailwind-variants";

import type { PageSection } from "~/modules/website/types";

export interface ImageHeroProps {
  section: PageSection;
  layout: string | undefined;
}

const hero = tv({
  slots: {
    base: "relative z-0 w-full",
  },
  variants: {
    layout: {
      default: {
        base: "h-[600px]",
      },
      condensed: {
        base: "h-[300px]",
      },
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

export function ImageHero({ section, layout = "default" }: ImageHeroProps) {
  const { title, subtitle, backgroundImage, actions } = section;

  const { base } = hero({ layout: layout as "default" | "condensed" });

  return (
    <section className={base()}>
      <Image
        removeWrapper
        alt="Modern Academy Campus"
        className="h-full w-full object-cover brightness-50"
        src={backgroundImage}
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-white">
        <h1 className="mb-4 max-w-4xl text-center text-4xl font-bold md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mb-8 max-w-2xl text-center text-lg md:text-xl">
            {subtitle}
          </p>
        )}
        {actions && actions.length > 0 && (
          <div className="flex flex-row gap-4">
            {actions.map((action, i) => (
              <Button
                key={i}
                size="lg"
                radius="sm"
                as={Link}
                href={action.href}
                color={i === 0 ? "primary" : "default"}
                className={i !== 0 ? "bg-foreground text-background" : ""}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
