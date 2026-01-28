"use client";

import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";
import { Chip } from "@sovoli/ui/components/chip";
import { FileText } from "lucide-react";
import type { BillingInvoice } from "~/modules/billing/types";
import type {
  AmountByCurrency,
  CurrencyCode,
} from "~/modules/core/economics/types";

interface InvoiceHistoryAccordionProps {
  invoices: BillingInvoice[];
}

function formatDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function currency(value: number, code: CurrencyCode = "USD") {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function amountUsd(amount?: AmountByCurrency): number {
  return amount?.USD ?? 0;
}

function getInvoiceStatusColor(status: BillingInvoice["status"]) {
  switch (status) {
    case "paid":
      return "success" as const;
    case "open":
      return "warning" as const;
    case "draft":
      return "default" as const;
    case "void":
    case "uncollectible":
    case "refunded":
      return "danger" as const;
  }
}

export function InvoiceHistoryAccordion({
  invoices,
}: InvoiceHistoryAccordionProps) {
  const validInvoices = invoices.filter(
    (inv) => inv && inv.id && typeof inv.id === "string",
  );

  if (validInvoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-default-100 p-3">
          <FileText className="h-6 w-6 text-default-400" />
        </div>
        <p className="mt-3 text-sm text-default-500">
          No past invoices available.
        </p>
      </div>
    );
  }

  return (
    <Accordion variant="splitted" className="px-2">
      {validInvoices.map((inv) => (
        <AccordionItem
          key={inv.id}
          aria-label={inv.id}
          classNames={{
            base: "group-[.is-splitted]:bg-transparent group-[.is-splitted]:shadow-none border-b border-default-100 last:border-0",
            trigger: "py-4",
          }}
          title={
            <div className="flex w-full items-center justify-between gap-2 pr-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-default-900">
                  {formatDate(inv.issuedAt)}
                </span>
                <span className="text-xs text-default-500 font-mono">
                  {inv.id}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Chip
                  size="sm"
                  variant="flat"
                  color={getInvoiceStatusColor(inv.status)}
                >
                  {inv.status}
                </Chip>
                <span className="text-sm font-semibold text-default-900">
                  {currency(amountUsd(inv.total))}
                </span>
              </div>
            </div>
          }
        >
          <div className="pb-4 pt-0 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-default-500 block">Due Date</span>
                <span className="text-default-900 font-medium">
                  {formatDate(inv.dueAt)}
                </span>
              </div>
              <div>
                <span className="text-default-500 block">Paid Date</span>
                <span className="text-default-900 font-medium">
                  {formatDate(inv.paidAt)}
                </span>
              </div>
            </div>

            {/* Simple line items list for history */}
            <div className="space-y-1 rounded bg-default-50 p-3">
              {inv.lineItems && inv.lineItems.length > 0 ? (
                inv.lineItems.map((li, idx) => (
                  <div
                    key={`${inv.id}-${li.pricingItemId}-${idx}`}
                    className="flex justify-between text-xs"
                  >
                    <span className="text-default-600 truncate max-w-[150px]">
                      {li.label ?? li.pricingItemId}
                    </span>
                    <span className="text-default-900">
                      {currency(amountUsd(li.lineAmount))}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-default-500">
                  No line items available.
                </div>
              )}
            </div>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
