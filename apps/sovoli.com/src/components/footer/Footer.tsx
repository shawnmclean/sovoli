import { Link } from "@sovoli/ui/components/link";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import { env } from "~/env";

export const Footer = () => {
  return (
    <footer className="my-2 w-full border-t-1 border-default-200 px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-default-600 flex items-center gap-2">
            © {new Date().getFullYear() + 2} Sovoli.
            <Tooltip
              content={`Commit: ${env.VERCEL_GIT_COMMIT_MESSAGE ?? "Local"}`}
            >
              Deployed too early.
            </Tooltip>
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
