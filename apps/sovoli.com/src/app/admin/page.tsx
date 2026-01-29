import { ORGS } from "~/modules/data/organisations";
import { AdminLinkButton } from "./components/AdminLinkButton";
import { TenantListWithStatus } from "./components/TenantListWithStatus";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "~/env";

const ADMIN_PIN = "0000";
const ADMIN_COOKIE_NAME = "sovoli_admin_pin";
const ADMIN_COOKIE_VALUE = "ok";

async function verifyAdminPin(formData: FormData) {
  "use server";

  const pin = formData.get("pin");
  const next = formData.get("next");
  const nextValue = typeof next === "string" ? next : "";
  const safeNext = nextValue.startsWith("/admin") ? nextValue : "/admin";

  if (pin !== ADMIN_PIN) {
    const nextParam = `&next=${encodeURIComponent(safeNext)}`;
    redirect(`/admin?error=1${nextParam}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    secure: env.NODE_ENV === "production",
  });

  redirect(safeNext);
}

interface TenantWithDomain {
  username: string;
  name: string;
  domain: string;
  url: string;
}

function getAllTenantsWithWebsiteModule(): TenantWithDomain[] {
  const tenants: TenantWithDomain[] = [];

  for (const org of ORGS) {
    if (!org.websiteModule?.website.domain) continue;

    const domain = org.websiteModule.website.domain;
    const url = org.websiteModule.website.url;

    tenants.push({
      username: org.org.username,
      name: org.org.name,
      domain,
      url,
    });
  }

  return tenants;
}

interface AdminPageProps {
  searchParams?: {
    error?: string;
    next?: string;
  };
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get(ADMIN_COOKIE_NAME)?.value === ADMIN_COOKIE_VALUE;
  const tenants = getAllTenantsWithWebsiteModule();

  if (!isAuthenticated) {
    const nextCandidate =
      typeof searchParams?.next === "string" ? searchParams.next : "";
    const nextPath = nextCandidate.startsWith("/admin")
      ? nextCandidate
      : "/admin";
    const hasError = searchParams?.error === "1";

    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-default-200 bg-content1 p-8 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-default-900">
              Admin Access
            </h1>
            <p className="text-sm text-default-500">
              Enter the 4-digit PIN to continue.
            </p>
          </div>
          <form action={verifyAdminPin} className="space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <div className="space-y-2">
              <label
                htmlFor="pin"
                className="text-xs font-semibold uppercase tracking-wide text-default-500"
              >
                PIN
              </label>
              <input
                id="pin"
                name="pin"
                type="password"
                inputMode="numeric"
                pattern="\\d{4}"
                maxLength={4}
                required
                className="w-full rounded-xl border border-default-200 bg-default-50 px-4 py-3 text-lg tracking-[0.3em] text-default-900 placeholder:text-default-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="••••"
              />
              {hasError ? (
                <p className="text-sm text-danger-500">
                  Incorrect PIN. Please try again.
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Unlock Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Domain Status</h1>
          <p className="text-muted-foreground">
            {tenants.length} tenant{tenants.length !== 1 ? "s" : ""} with
            website modules
          </p>
          <div className="mt-4">
            <AdminLinkButton href="/admin/billing">
              View Billing Status
            </AdminLinkButton>
          </div>
        </div>

        <TenantListWithStatus tenants={tenants} />
      </div>
    </div>
  );
}
