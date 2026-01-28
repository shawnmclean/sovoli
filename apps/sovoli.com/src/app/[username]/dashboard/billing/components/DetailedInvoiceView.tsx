"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Divider } from "@sovoli/ui/components/divider";
import { FileText, Calendar, DollarSign } from "lucide-react";
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
        : "Not specified";

  // Get period dates for the grouped header display
  const periodStart = invoice.periodStart ?? derivedPeriod?.periodStart;
  const periodEnd = invoice.periodEnd ?? derivedPeriod?.periodEnd;

  const totalUsd = amountUsd(invoice.total);
  const subtotalUsd = amountUsd(invoice.subtotal);
  const discountUsd = amountUsd(invoice.discountTotal);
  const taxUsd = amountUsd(invoice.taxTotal);
  const amountPaidUsd = calculateAmountPaid(invoice.payments);
  const balanceDueUsd = totalUsd - amountPaidUsd;
  const currencyCode = invoice.currency ?? "USD";

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Invoice Header */}
      <Card className="shadow-sm print:shadow-none print:border-none">
        <CardHeader className="border-b border-default-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 print:hidden">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-default-900">
                  Invoice Details
                </h2>
                {invoice.invoiceNumber && (
                  <p className="text-sm text-default-500 font-mono mt-1">
                    {invoice.invoiceNumber}
                  </p>
                )}
                <p className="text-xs text-default-500 font-mono mt-1">
                  ID: {invoice.id}
                </p>
              </div>
            </div>
            <Chip
              size="sm"
              variant="flat"
              color={getInvoiceStatusColor(invoice.status)}
              className="capitalize"
            >
              {invoice.status}
            </Chip>
          </div>
        </CardHeader>
        <CardBody className="pt-6">
          {/* From / To Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-default-200">
            {/* From: Company Information */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-default-500 mb-2">
                From
              </h3>
              <div className="space-y-1 text-sm text-default-900">
                <div className="font-semibold">{config.company.name}</div>
                <div className="text-default-600">
                  {config.company.address.line1}
                  <br />
                  {config.company.address.city}, {config.company.address.state}
                  <br />
                  {config.company.address.country}
                </div>
                <div className="text-default-600 mt-2">
                  <a
                    href={`mailto:${config.company.email}`}
                    className="hover:text-primary"
                  >
                    {config.company.email}
                  </a>
                </div>
              </div>
            </div>
            {/* To: Customer Information */}
            {orgName && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-default-500 mb-2">
                  To
                </h3>
                <div className="space-y-1 text-sm text-default-900">
                  <div className="font-semibold">{orgName}</div>
                </div>
              </div>
            )}
          </div>

          {/* Invoice Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-default-500 block mb-1">
                  Billing Period
                </span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-default-400" />
                  <span className="text-sm font-medium text-default-900">
                    {invoicePeriod}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-default-500 block mb-1">
                  Issued Date
                </span>
                <span className="text-sm font-medium text-default-900">
                  {formatInvoiceDate(invoice.issuedAt)}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-default-500 block mb-1">
                  Due Date
                </span>
                <span className="text-sm font-medium text-default-900">
                  {formatInvoiceDate(invoice.dueAt)}
                </span>
              </div>
              {invoice.paidAt && (
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-default-500 block mb-1">
                    Paid Date
                  </span>
                  <span className="text-sm font-medium text-default-900">
                    {formatInvoiceDate(invoice.paidAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          {invoice.lineItems && invoice.lineItems.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-default-900 mb-3 uppercase">
                Items
              </h3>
              {/* Billing Period Header - shown once at top */}
              {periodStart && periodEnd && (
                <div className="mb-3 text-sm font-medium text-default-700">
                  {formatPeriod(periodStart, periodEnd, true)}
                </div>
              )}
              <div className="border border-default-200 rounded-lg overflow-hidden">
                <div className="bg-default-50 px-4 py-2 border-b border-default-200">
                  <div className="grid grid-cols-12 gap-4 text-xs font-medium text-default-600 uppercase tracking-wider">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-right">Quantity</div>
                    <div className="col-span-2 text-right">Unit Price</div>
                    <div className="col-span-2 text-right">Amount</div>
                  </div>
                </div>
                <div className="divide-y divide-default-100">
                  {invoice.lineItems.map((item, idx) => {
                    const unitPriceUsd = amountUsd(item.unitAmount);
                    const lineAmountUsd = amountUsd(item.lineAmount);

                    return (
                      <div
                        key={`${invoice.id}-${item.pricingItemId}-${idx}`}
                        className="px-4 py-3"
                      >
                        <div className="grid grid-cols-12 gap-4 items-start">
                          <div className="col-span-6">
                            <div className="font-medium text-sm text-default-900">
                              {item.label ?? item.pricingItemId}
                            </div>
                            {item.description && (
                              <div className="text-xs text-default-500 mt-1">
                                {item.description}
                              </div>
                            )}
                            {item.proration && (
                              <div className="text-xs text-default-500 mt-1">
                                Prorated: {formatProration(item.proration)}
                              </div>
                            )}
                            {item.type && (
                              <Chip
                                size="sm"
                                variant="flat"
                                className="mt-1 text-xs"
                              >
                                {item.type}
                              </Chip>
                            )}
                          </div>
                          <div className="col-span-2 text-right text-sm text-default-900">
                            Qty {item.quantity ?? 1}
                          </div>
                          <div className="col-span-2 text-right text-sm text-default-900">
                            {currency(unitPriceUsd, currencyCode)}
                          </div>
                          <div className="col-span-2 text-right font-semibold text-sm text-default-900">
                            {currency(lineAmountUsd, currencyCode)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 text-sm text-default-500">
              No line items available.
            </div>
          )}

          <Divider className="my-6" />

          {/* Totals Section */}
          <div className="space-y-2">
            {subtotalUsd > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-default-600">Subtotal</span>
                <span className="text-default-900 font-medium">
                  {currency(subtotalUsd, currencyCode)}
                </span>
              </div>
            )}
            {discountUsd > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span>Discounts</span>
                <span className="font-medium">
                  -{currency(discountUsd, currencyCode)}
                </span>
              </div>
            )}
            {taxUsd > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-default-600">Tax</span>
                <span className="text-default-900 font-medium">
                  {currency(taxUsd, currencyCode)}
                </span>
              </div>
            )}
            <Divider className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-default-900">Total</span>
              <span className="text-default-900">
                {currency(totalUsd, currencyCode)}
              </span>
            </div>
            {amountPaidUsd > 0 && (
              <>
                <div className="flex justify-between text-sm text-success mt-2">
                  <span>Amount Paid</span>
                  <span className="font-medium">
                    {currency(amountPaidUsd, currencyCode)}
                  </span>
                </div>
                {balanceDueUsd > 0 && (
                  <div className="flex justify-between text-sm text-warning mt-2">
                    <span>Balance Due</span>
                    <span className="font-medium">
                      {currency(balanceDueUsd, currencyCode)}
                    </span>
                  </div>
                )}
                {balanceDueUsd <= 0 && (
                  <div className="flex justify-between text-sm text-success mt-2">
                    <span>Balance</span>
                    <span className="font-medium">Paid in Full</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Payment Information */}
          {invoice.payments && invoice.payments.length > 0 && (
            <>
              <Divider className="my-6" />
              <div>
                <h3 className="text-sm font-semibold text-default-900 mb-3">
                  Payments
                </h3>
                <div className="space-y-2">
                  {invoice.payments.map((payment) => {
                    const paymentUsd = amountUsd(payment.amount);
                    const paymentStatusColor =
                      payment.status === "succeeded"
                        ? "success"
                        : payment.status === "pending"
                          ? "warning"
                          : payment.status === "failed"
                            ? "danger"
                            : "default";

                    return (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 bg-default-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-4 w-4 text-default-400" />
                          <div>
                            <div className="text-sm font-medium text-default-900">
                              {currency(
                                paymentUsd,
                                payment.currency ?? currencyCode,
                              )}
                            </div>
                            <div className="text-xs text-default-500">
                              {formatInvoiceDate(payment.paidAt)}
                              {payment.processor && ` • ${payment.processor}`}
                              {payment.transactionReference &&
                                ` • ${payment.transactionReference}`}
                            </div>
                          </div>
                        </div>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={paymentStatusColor}
                          className="capitalize"
                        >
                          {payment.status}
                        </Chip>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          {invoice.notes && (
            <>
              <Divider className="my-6" />
              <div>
                <h3 className="text-sm font-semibold text-default-900 mb-2">
                  Notes
                </h3>
                <p className="text-sm text-default-600 whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
