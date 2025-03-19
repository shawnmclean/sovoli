import { Link } from "@sovoli/ui/components/link";

export const Footer = () => {
  return (
    <footer className="my-2 w-full border-t-1 border-default-200 px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-default-600">
            {new Date().getFullYear()} © Sovoli
          </div>
          <div className="flex gap-6">
            <Link href="/about" color="foreground" underline="hover" size="sm">
              About
            </Link>
            <Link
              href="/privacy"
              color="foreground"
              underline="hover"
              size="sm"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
