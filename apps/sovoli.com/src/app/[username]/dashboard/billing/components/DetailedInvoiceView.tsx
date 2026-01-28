"use client";

import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Divider } from "@sovoli/ui/components/divider";
import { Download } from "lucide-react";
import type { BillingInvoice } from "~/modules/billing/types";
import type {
  AmountByCurrency,
  CurrencyCode,
} from "~/modules/core/economics/types";
import {
  formatPeriod,
  formatInvoiceDate,
  formatProration,
  deriveInvoicePeriod,
} from "~/modules/billing/utils/periodUtils";
import { config } from "~/utils/config";

interface DetailedInvoiceViewProps {
  invoice: BillingInvoice;
  orgName?: string;
}

function currency(value: number, code: CurrencyCode = "USD") {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
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

function calculateAmountPaid(payments?: BillingInvoice["payments"]): number {
  if (!payments) return 0;
  return payments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + amountUsd(p.amount), 0);
}

export function DetailedInvoiceView({
  invoice,
  orgName,
}: DetailedInvoiceViewProps) {
  const derivedPeriod = deriveInvoicePeriod(invoice.lineItems);
  const invoicePeriod =
    invoice.periodStart && invoice.periodEnd
      ? formatPeriod(invoice.periodStart, invoice.periodEnd)
      : derivedPeriod
        ? formatPeriod(derivedPeriod.periodStart, derivedPeriod.periodEnd)
        : null;

  const totalUsd = amountUsd(invoice.total);
  const subtotalUsd = amountUsd(invoice.subtotal);
  const discountUsd = amountUsd(invoice.discountTotal);
  const taxUsd = amountUsd(invoice.taxTotal);
  const amountPaidUsd = calculateAmountPaid(invoice.payments);
  const balanceDueUsd = totalUsd - amountPaidUsd;
  const currencyCode = invoice.currency ?? "USD";

  // Extract company info - config is a const object, safe to access
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const companyName = config.company.name;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const companyAddress = config.company.address;

  return (
    <div className="mx-auto max-w-md w-full space-y-6">
      <Card className="shadow-none border border-default-200 overflow-hidden bg-content1">
        <CardBody className="p-0">
          {/* Header Section: Amount & Status */}
          <div className="p-6 pb-8 bg-default-50 text-center border-b border-default-100">
            <div className="flex justify-center mb-4">
              <div className="h-10 w-10 rounded-full bg-content1 border border-default-200 flex items-center justify-center p-2 shadow-sm">
                {/* Brand Icon Placeholder or simple generic icon */}
                <span className="font-bold text-lg text-primary">S</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-default-500 text-xs font-semibold uppercase tracking-wider">
                Invoice {invoice.invoiceNumber ?? `#${invoice.id.slice(-6)}`}
              </span>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold text-default-900 tracking-tight">
                  {currency(totalUsd, currencyCode)}
                </h1>
              </div>
              <Chip
                size="sm"
                variant="flat"
                color={getInvoiceStatusColor(invoice.status)}
                className="mt-2 capitalize"
              >
                {invoice.status}
              </Chip>
            </div>

            <div className="mt-6 flex justify-center gap-8 text-sm">
              <div>
                <span className="text-default-400 block text-xs mb-0.5">
                  Issued
                </span>
                <span className="font-medium text-default-700">
                  {formatInvoiceDate(invoice.issuedAt)}
                </span>
              </div>
              <div>
                <span className="text-default-400 block text-xs mb-0.5">
                  Due
                </span>
                <span className="font-medium text-default-700">
                  {formatInvoiceDate(invoice.dueAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Line Items List - No Table */}
            <div className="space-y-4">
              {/* Period Information */}
              {invoicePeriod && (
                <div className="text-xs text-default-400">{invoicePeriod}</div>
              )}
              {invoice.lineItems && invoice.lineItems.length > 0 ? (
                invoice.lineItems.map((item, idx) => {
                  const lineAmountUsd = amountUsd(item.lineAmount);

                  // Extract proration values after type checks
                  // Type checks ensure safety, but linter is strict about error types
                  const proration =
                    item.proration &&
                    typeof item.proration.fullPeriodDays === "number" &&
                    typeof item.proration.usedDays === "number" &&
                    typeof item.proration.factor === "number"
                      ? {
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                          fullPeriodDays: item.proration.fullPeriodDays,
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                          usedDays: item.proration.usedDays,
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                          factor: item.proration.factor,
                        }
                      : null;

                  return (
                    <div
                      key={`${invoice.id}-${idx}`}
                      className="flex justify-between items-start gap-4"
                    >
                      <div className="flex flex-col gap-0.5 max-w-[70%]">
                        <span className="text-sm font-medium text-default-900 leading-snug">
                          {item.label ?? item.pricingItemId}
                          {(item.quantity ?? 1) > 1 && (
                            <span className="text-default-400 font-normal ml-1">
                              × {item.quantity}
                            </span>
                          )}
                        </span>

                        {(item.description ?? proration) && (
                          <span className="text-xs text-default-500 leading-snug">
                            {item.description}
                            {proration && (
                              <span className="block mt-0.5 opacity-80">
                                {formatProration(proration)}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-default-900 shrink-0">
                        {currency(lineAmountUsd, currencyCode)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-sm text-default-400 py-4">
                  No line items found
                </div>
              )}
            </div>

            <Divider className="opacity-50" />

            {/* Totals Section - Clean Horizontal Lines */}
            <div className="space-y-2 pt-1 text-sm">
              <div className="flex justify-between text-default-500">
                <span>Subtotal</span>
                <span>{currency(subtotalUsd, currencyCode)}</span>
              </div>

              {discountUsd > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-{currency(discountUsd, currencyCode)}</span>
                </div>
              )}

              {taxUsd > 0 && (
                <div className="flex justify-between text-default-500">
                  <span>Tax</span>
                  <span>{currency(taxUsd, currencyCode)}</span>
                </div>
              )}

              <Divider className="my-2 border-dashed opacity-50" />

              <div className="flex justify-between items-center text-base font-bold text-default-900">
                <span>Total</span>
                <span>{currency(totalUsd, currencyCode)}</span>
              </div>

              {amountPaidUsd > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between text-sm text-success">
                    <span>Paid</span>
                    <span>{currency(amountPaidUsd, currencyCode)}</span>
                  </div>
                  {balanceDueUsd > 0 ? (
                    <div className="flex justify-between text-sm font-medium text-warning">
                      <span>Balance Due</span>
                      <span>{currency(balanceDueUsd, currencyCode)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm text-default-400">
                      <span>Balance Due</span>
                      <span>{currency(0, currencyCode)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Metadata Grouped at Bottom */}
            <div className="pt-6 mt-6 border-t border-default-100">
              <div className="grid grid-cols-1 gap-6 text-xs">
                {/* Billed To */}
                {orgName && (
                  <div>
                    <span className="text-default-400 font-semibold uppercase tracking-wider block mb-1">
                      Billed To
                    </span>
                    <span className="text-default-700 font-medium text-sm">
                      {orgName}
                    </span>
                  </div>
                )}

                {/* Billed From */}
                <div>
                  <span className="text-default-400 font-semibold uppercase tracking-wider block mb-1">
                    From
                  </span>
                  <div className="text-default-600">
                    <span className="text-default-700 font-medium block text-sm">
                      {companyName}
                    </span>
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                    {companyAddress.line1}
                    <br />
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                    {companyAddress.city},{" "}
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                    {companyAddress.state}{" "}
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                    {companyAddress.country}
                  </div>
                </div>
              </div>
            </div>

            {/* Payments List (if relevant) */}
            {invoice.payments && invoice.payments.length > 0 && (
              <div className="pt-6 mt-2 border-t border-default-100">
                <span className="text-default-400 font-semibold uppercase tracking-wider block mb-3 text-xs">
                  Payment History
                </span>
                <div className="space-y-3">
                  {invoice.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex justify-between items-center text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${payment.status === "succeeded" ? "bg-success" : "bg-default-300"}`}
                        />
                        <span className="text-default-600">
                          {formatInvoiceDate(payment.paidAt)}
                          {payment.status !== "succeeded" &&
                            ` (${payment.status})`}
                        </span>
                      </div>
                      <span className="text-default-700 font-medium">
                        {currency(
                          amountUsd(payment.amount),
                          payment.currency ?? currencyCode,
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Download Buttons */}
            <div className="pt-4 mt-4 border-t border-default-100">
              <div className="flex gap-3">
                <Button
                  variant="bordered"
                  className="flex-1"
                  startContent={<Download size={16} />}
                  onPress={() => {
                    // TODO: Implement download invoice functionality
                  }}
                >
                  Download Invoice
                </Button>
                <Button
                  variant="bordered"
                  className="flex-1"
                  startContent={<Download size={16} />}
                  onPress={() => {
                    // TODO: Implement download receipt functionality
                  }}
                >
                  Download Receipt
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Footer Notes (outside card) */}
      {invoice.notes && (
        <div className="text-center px-4">
          <p className="text-xs text-default-500 max-w-xs mx-auto">
            {invoice.notes}
          </p>
        </div>
      )}
    </div>
  );
}
