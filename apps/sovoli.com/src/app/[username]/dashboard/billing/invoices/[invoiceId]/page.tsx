import { notFound } from "next/navigation";
import { Button } from "@sovoli/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { BillingInvoice } from "~/modules/billing/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import type { GetOrgInstanceByUsernameResult } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { bus } from "~/services/core/bus";
import { DetailedInvoiceView } from "../../components/DetailedInvoiceView";

const retrieveOrgInstance = async (username: string): Promise<OrgInstance> => {
  const result: GetOrgInstanceByUsernameResult =
    await bus.queryProcessor.execute(
      new GetOrgInstanceByUsernameQuery(username),
    );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ username: string; invoiceId: string }>;
}) {
  const { username, invoiceId } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  const invoices = orgInstance.billingModule?.invoices ?? [];
  const invoice: BillingInvoice | undefined = invoices.find(
    (inv) => inv.id === invoiceId,
  );

  if (!invoice) {
    return notFound();
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link href={`/${username}/dashboard/billing`}>
          <Button
            variant="light"
            size="sm"
            startContent={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Billing
          </Button>
        </Link>
      </div>

      {/* Invoice Detail View */}
      <DetailedInvoiceView invoice={invoice} orgName={orgInstance.org.name} />
    </div>
  );
}
