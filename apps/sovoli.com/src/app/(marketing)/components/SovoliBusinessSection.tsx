import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";

export function SovoliBusinessSection() {
  return (
    <section className="border-t border-default-200 bg-default-50/50 dark:bg-default-50/5 mt-12">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
          Sovoli for business
        </h2>
        <p className="mb-8 text-default-600">
          Run a school or training program? Better ads that send people to the
          right information, and better WhatsApp messages that lead to real
          enrollments.
        </p>
        <Button as={Link} href="/business" color="primary" radius="full">
          Learn more
        </Button>
      </div>
    </section>
  );
}
