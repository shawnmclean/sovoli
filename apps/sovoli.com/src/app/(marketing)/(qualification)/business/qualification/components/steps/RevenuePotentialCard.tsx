"use client";

import { Alert } from "@sovoli/ui/components/alert";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Input } from "@sovoli/ui/components/input";
import { useEffect, useMemo, useState } from "react";

const JMD_TO_USD_RATE = 155;
const MIN_ROAS = 6;
const MAX_ROAS = 20;

function parseAdSpend(adSpend: string | null): number | null {
  if (!adSpend) return null;
  if (adSpend === "0") return 0;
  if (adSpend === "100-500") return 300; // Midpoint for calculation
  if (adSpend === "500-1000") return 750; // Midpoint for calculation
  if (adSpend === "1000+") return 1000; // Minimum estimate
  return null;
}

export interface RevenuePotentialCardProps {
  adSpend: string | null;
  returnValue: number;
  onNext: () => void;
}

export function RevenuePotentialCard({
  adSpend,
  returnValue,
  onNext: _onNext,
}: RevenuePotentialCardProps) {
  // Initialize editable ad spend from parsed value (convert USD to JMD)
  const initialAdSpendUsd = parseAdSpend(adSpend) ?? 0;
  const initialAdSpendJmd = initialAdSpendUsd * JMD_TO_USD_RATE;
  const [editableAdSpendJmd, setEditableAdSpendJmd] = useState<string>(
    initialAdSpendJmd.toString(),
  );

  // Initialize editable return value
  const [editableReturnJmd, setEditableReturnJmd] = useState<string>(
    returnValue.toString(),
  );

  // Update editable values when props change
  useEffect(() => {
    const parsedAdSpendUsd = parseAdSpend(adSpend);
    if (parsedAdSpendUsd !== null) {
      const adSpendJmd = parsedAdSpendUsd * JMD_TO_USD_RATE;
      setEditableAdSpendJmd(adSpendJmd.toString());
    }
  }, [adSpend]);

  useEffect(() => {
    setEditableReturnJmd(returnValue.toString());
  }, [returnValue]);

  const calculations = useMemo(() => {
    // Parse the editable ad spend value (in JMD)
    const adSpendJmd = parseFloat(editableAdSpendJmd) || 0;
    // Parse the editable return value (in JMD)
    const returnJmd = parseFloat(editableReturnJmd) || 0;

    // Current revenue (in JMD)
    const currentRevenueJmd = returnJmd;

    // For potential calculations, use actual ad spend if > 0, otherwise use minimum estimate
    const adSpendForPotential = adSpendJmd > 0 ? adSpendJmd : 100;

    // Calculate potential revenue (using average ROAS of 13x for 6x-20x range)
    const avgRoas = (MIN_ROAS + MAX_ROAS) / 2;
    const minPotentialRevenueJmd = adSpendForPotential * MIN_ROAS;
    const maxPotentialRevenueJmd = adSpendForPotential * MAX_ROAS;
    const potentialRevenueJmd = adSpendForPotential * avgRoas;

    // Calculate returns (efficiency multipliers)
    const currentReturn =
      adSpendJmd > 0 && currentRevenueJmd > 0
        ? currentRevenueJmd / adSpendJmd
        : null;
    const potentialReturn = avgRoas;

    // Calculate the revenue gap (using maximum potential for most compelling message)
    const revenueGap = maxPotentialRevenueJmd - currentRevenueJmd;

    // Check if operating at a loss (revenue < ad spend)
    const isLoss = adSpendJmd > 0 && currentRevenueJmd < adSpendJmd;
    const lossAmount = isLoss ? adSpendJmd - currentRevenueJmd : 0;

    return {
      adSpendJmd,
      currentRevenueJmd,
      potentialRevenueJmd,
      minPotentialRevenueJmd,
      maxPotentialRevenueJmd,
      currentReturn,
      potentialReturn,
      revenueGap,
      isLoss,
      lossAmount,
    };
  }, [editableAdSpendJmd, editableReturnJmd]);

  const handleAdSpendChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setEditableAdSpendJmd(numericValue);
  };

  const handleReturnChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setEditableReturnJmd(numericValue);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      const millions = amount / 1000000;
      const formatted = millions.toLocaleString(undefined, {
        maximumFractionDigits: millions % 1 === 0 ? 0 : 1,
      });
      return `$${formatted}m JMD`;
    }
    if (amount >= 100000) {
      const thousands = amount / 1000;
      const formatted = thousands.toLocaleString(undefined, {
        maximumFractionDigits: thousands % 1 === 0 ? 0 : 1,
      });
      return `$${formatted}k JMD`;
    }
    return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} JMD`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">Your Spend vs Result</h1>
      </div>

      {/* Editable Inputs Side by Side */}
      <div className="flex gap-4">
        <Input
          type="text"
          value={editableAdSpendJmd}
          onChange={(e) => handleAdSpendChange(e.target.value)}
          label="Ad Spend"
          variant="bordered"
          size="lg"
          className="flex-1"
          placeholder="Enter amount"
          startContent={<span className="text-default-500">$</span>}
          endContent={<span className="text-default-500 text-sm">JMD</span>}
        />

        <Input
          type="text"
          value={editableReturnJmd}
          onChange={(e) => handleReturnChange(e.target.value)}
          label="Money In"
          variant="bordered"
          size="lg"
          className="flex-1"
          placeholder="Enter amount"
          startContent={<span className="text-default-500">$</span>}
          endContent={<span className="text-default-500 text-sm">JMD</span>}
        />
      </div>

      {/* Two Separate Cards */}
      {calculations.adSpendJmd > 0 && (
        <div className="space-y-4">
          {/* Current Result Card */}
          <Card
            className={
              calculations.isLoss
                ? "border-warning/30 shadow-sm"
                : "border-default-200 shadow-sm"
            }
          >
            <CardHeader
              className={
                calculations.isLoss ? "bg-warning/10" : "bg-default-100"
              }
            >
              <div className="flex items-center justify-between w-full">
                <h3
                  className={
                    calculations.isLoss
                      ? "text-sm font-medium text-warning-700"
                      : "text-sm font-medium text-default-600"
                  }
                >
                  Your Current Result
                </h3>
                {calculations.isLoss ? (
                  <Chip
                    variant="flat"
                    color="warning"
                    size="sm"
                    className="bg-warning/20 text-warning-700"
                  >
                    LOSS
                  </Chip>
                ) : (
                  calculations.currentReturn !== null && (
                    <Chip
                      variant="flat"
                      color="default"
                      size="sm"
                      className="bg-default-200 text-default-700"
                    >
                      {Math.round(calculations.currentReturn)}x Return
                    </Chip>
                  )
                )}
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex justify-center">
                <span
                  className={
                    calculations.isLoss
                      ? "text-xl font-bold text-warning-700"
                      : "text-xl font-bold text-default-900"
                  }
                >
                  {formatCurrency(calculations.currentRevenueJmd)}
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Properly Configured Card */}
          {calculations.revenueGap > 0 && (
            <Card className="border-default-200 shadow-sm">
              <CardHeader className="bg-primary/10">
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-sm font-medium text-primary-700">
                    When Properly Configured
                  </h3>
                  <Chip
                    variant="flat"
                    color="primary"
                    size="sm"
                    className="bg-primary/20 text-primary-700"
                  >
                    {MIN_ROAS}x-{MAX_ROAS}x
                  </Chip>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center">
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(calculations.minPotentialRevenueJmd)} -{" "}
                    {formatCurrency(calculations.maxPotentialRevenueJmd)}
                  </span>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Warning Alert - Below Cards */}
          {calculations.revenueGap > 0 && (
            <Alert
              color="warning"
              variant="flat"
              className="border-warning/30 bg-warning/20"
            >
              <span className="text-base text-warning-700">
                You are leaving up to{" "}
                <span className="font-bold">
                  {formatCurrency(calculations.revenueGap)}
                </span>{" "}
                on the table.
              </span>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
