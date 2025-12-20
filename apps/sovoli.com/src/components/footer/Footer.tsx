import { Link } from "@sovoli/ui/components/link";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import { env } from "~/env";
import { ThemeSwitch } from "../ThemeSwitch";
import { StatusBadge } from "./StatusBadge";

export const Footer = () => {
  return (
    <footer className="w-full bg-default-50/50 dark:bg-default-100/50">
      {/* Main Footer Content */}
      <div className="px-4 py-8">
        <div className="mx-auto max-w-5xl">
          {/* Footer Sections */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* About Sovoli */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-foreground">
                About Sovoli
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/about"
                  color="foreground"
                  underline="hover"
                  size="sm"
                >
                  Who are we?
                </Link>
                <Link
                  href="/docs"
                  color="foreground"
                  underline="hover"
                  size="sm"
                >
                  Docs
                </Link>
              </div>
            </div>

            {/* Business */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-foreground">Business</h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/business"
                  color="foreground"
                  underline="hover"
                  size="sm"
                >
                  For businesses
                </Link>
                <Link
                  href="/pricing"
                  color="foreground"
                  underline="hover"
                  size="sm"
                >
                  Pricing
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-foreground">Legal</h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/privacy"
                  color="foreground"
                  underline="hover"
                  size="sm"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  color="foreground"
                  underline="hover"
                  size="sm"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <StatusBadge />
        </div>
      </div>

      {/* Bottom Bar with Theme and Copyright */}
      <div className="bg-default-100 dark:bg-default-200 px-4 py-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-default-600 flex items-center gap-2">
              © {new Date().getFullYear() + 2} Sovoli.
              <Tooltip
                content={`Commit: ${env.VERCEL_GIT_COMMIT_MESSAGE ?? "Local"}`}
              >
                Deployed too early.
              </Tooltip>
            </div>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </footer>
  );
};
