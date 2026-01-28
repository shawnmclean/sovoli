"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Divider } from "@sovoli/ui/components/divider";
import { DollarSign, Calendar, CreditCard, FileText } from "lucide-react";
import Link from "next/link";
import type { BillingPayment } from "~/modules/billing/types";
import type { CurrencyCode } from "~/modules/core/economics/types";
import { formatInvoiceDateTime } from "~/modules/billing/utils/periodUtils";

interface PaymentDetailViewProps {
  payment: BillingPayment;
  invoiceId?: string;
  invoiceNumber?: string;
  orgUsername?: string;
}

function currency(value: number, code: CurrencyCode = "USD") {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function amountUsd(amount?: BillingPayment["amount"]): number {
  return amount?.USD ?? 0;
}

function getPaymentStatusColor(status: BillingPayment["status"]) {
  switch (status) {
    case "succeeded":
      return "success" as const;
    case "pending":
      return "warning" as const;
    case "failed":
      return "danger" as const;
    case "refunded":
      return "default" as const;
    default:
      return "default" as const;
  }
}

function getPaymentMethodLabel(method: BillingPayment["method"]): string {
  switch (method) {
    case "cash":
      return "Cash";
    case "bank_transfer":
      return "Bank Transfer";
    case "card":
      return "Card";
    case "mobile_money":
      return "Mobile Money";
    case "paypal":
      return "PayPal";
    case "other":
      return "Other";
    default:
      return method;
  }
}

export function PaymentDetailView({
  payment,
  invoiceId,
  invoiceNumber,
  orgUsername,
}: PaymentDetailViewProps) {
  const paymentUsd = amountUsd(payment.amount);
  const currencyCode = payment.currency ?? "USD";

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-default-100 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-default-900">
                Payment Details
              </h2>
              <p className="text-xs text-default-500 font-mono mt-1">
                ID: {payment.id}
              </p>
            </div>
          </div>
          <Chip
            size="sm"
            variant="flat"
            color={getPaymentStatusColor(payment.status)}
            className="capitalize"
          >
            {payment.status}
          </Chip>
        </div>
      </CardHeader>
      <CardBody className="pt-6">
        {/* Payment Amount */}
        <div className="mb-6">
          <div className="text-3xl font-bold text-default-900">
            {currency(paymentUsd, currencyCode)}
          </div>
          <div className="text-sm text-default-500 mt-1">{currencyCode}</div>
        </div>

        <Divider className="my-6" />

        {/* Payment Information Grid */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-default-500 block mb-1">
              Paid Date & Time
            </span>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-default-400" />
              <span className="text-sm font-medium text-default-900">
                {formatInvoiceDateTime(payment.paidAt)}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-default-500 block mb-1">
              Payment Method
            </span>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-default-400" />
              <span className="text-sm font-medium text-default-900">
                {getPaymentMethodLabel(payment.method)}
              </span>
            </div>
          </div>

          {payment.processor && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-default-500 block mb-1">
                Processor
              </span>
              <span className="text-sm font-medium text-default-900">
                {payment.processor}
              </span>
            </div>
          )}

          {payment.transactionReference && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-default-500 block mb-1">
                Transaction Reference
              </span>
              <span className="text-sm font-mono font-medium text-default-900">
                {payment.transactionReference}
              </span>
            </div>
          )}

          {payment.reference && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-default-500 block mb-1">
                Reference
              </span>
              <span className="text-sm font-medium text-default-900">
                {payment.reference}
              </span>
            </div>
          )}

          {invoiceId && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-default-500 block mb-1">
                Invoice
              </span>
              {orgUsername ? (
                <Link
                  href={`/${orgUsername}/dashboard/billing/invoices/${invoiceId}`}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  {invoiceNumber ?? invoiceId}
                </Link>
              ) : (
                <span className="text-sm font-mono font-medium text-default-900">
                  {invoiceNumber ?? invoiceId}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        {payment.notes && (
          <>
            <Divider className="my-6" />
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-default-500 block mb-2">
                Notes
              </span>
              <p className="text-sm text-default-600 whitespace-pre-wrap">
                {payment.notes}
              </p>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
