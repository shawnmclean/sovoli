"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { Card, CardBody } from "@sovoli/ui/components/card";

export interface ROASCalculatorStepProps {
  adSpend: string | null;
  returnValue: number;
  onNext: () => void;
}

const JMD_TO_USD_RATE = 155;
const MIN_ROAS = 6;
const MAX_ROAS = 10;

function parseAdSpend(adSpend: string | null): number | null {
  if (!adSpend) return null;
  if (adSpend === "0") return 0;
  if (adSpend === "100-500") return 300; // Midpoint for calculation
  if (adSpend === "500-1000") return 750; // Midpoint for calculation
  if (adSpend === "1000+") return 1000; // Minimum estimate
  return null;
}

export function ROASCalculatorStep({
  adSpend,
  returnValue,
  onNext,
}: ROASCalculatorStepProps) {
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

  const roasData = useMemo(() => {
    // Parse the editable ad spend value (in JMD)
    const adSpendJmd = parseFloat(editableAdSpendJmd) || 0;
    // Parse the editable return value (in JMD)
    const returnJmd = parseFloat(editableReturnJmd) || 0;
    
    // Calculate current ROAS (can be null if ad spend or return is 0)
    const currentRoas = adSpendJmd > 0 && returnJmd > 0 ? returnJmd / adSpendJmd : null;

    // For potential calculations, use actual ad spend if > 0, otherwise use minimum estimate (100 JMD)
    const adSpendForPotential = adSpendJmd > 0 ? adSpendJmd : 100;
    
    // Calculate potential returns with our system (all in JMD)
    const minPotentialReturnJmd = adSpendForPotential * MIN_ROAS;
    const maxPotentialReturnJmd = adSpendForPotential * MAX_ROAS;
    const avgPotentialReturnJmd = adSpendForPotential * ((MIN_ROAS + MAX_ROAS) / 2);
    
    // Calculate percentage increase
    const percentageIncrease = currentRoas && currentRoas > 0
      ? ((MIN_ROAS - currentRoas) / currentRoas) * 100
      : null;
    const avgPercentageIncrease = currentRoas && currentRoas > 0 && returnJmd > 0
      ? ((avgPotentialReturnJmd - returnJmd) / returnJmd) * 100
      : null;
    
    return {
      adSpendJmd,
      returnJmd,
      currentRoas,
      minPotentialReturnJmd,
      maxPotentialReturnJmd,
      avgPotentialReturnJmd,
      percentageIncrease,
      avgPercentageIncrease,
    };
  }, [editableReturnJmd, editableAdSpendJmd]);

  const handleAdSpendChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setEditableAdSpendJmd(numericValue);
  };

  const handleReturnChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    setEditableReturnJmd(numericValue);
  };

  const formatCurrencyJMD = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} JMD`;
  };

  return (
    <div className="space-y-4">
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">Your Current ROAS</h1>
        <p className="text-default-600 mb-4">
          Based on your previous answers, here's your current ROAS (return on ad spend).
        </p>
      </div>

      {/* Editable Inputs Side by Side */}
      <div className="flex gap-4">
        <Input
          type="text"
          value={editableAdSpendJmd}
          onChange={(e) => handleAdSpendChange(e.target.value)}
          label="Ad Spend (JMD)"
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
          label="Your Return (JMD)"
          variant="bordered"
          size="lg"
          className="flex-1"
          placeholder="Enter amount"
          startContent={<span className="text-default-500">$</span>}
          endContent={<span className="text-default-500 text-sm">JMD</span>}
        />
      </div>

      {roasData.currentRoas !== null ? (
        <Card className="border-default-200">
          <CardBody className="p-4 bg-default-50">
            <div className="text-sm text-default-600 mb-1">Current ROAS</div>
            <div className="text-3xl font-bold text-foreground">
              {roasData.currentRoas.toFixed(1)}x
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="border-default-200">
          <CardBody className="p-4 bg-default-50">
            <div className="text-sm text-default-600 mb-1">Current ROAS</div>
            <div className="text-2xl font-bold text-foreground">
              Not calculated
            </div>
            <div className="text-xs text-default-500 mt-1">
              Enter ad spend and return values to calculate
            </div>
          </CardBody>
        </Card>
      )}

      <div className="text-left">
        <h2 className="text-2xl font-bold mb-2">Potential ROAS with Us</h2>
        <p className="text-default-600 mb-4">
          With our system, we've seen businesses achieve 6x-10x ROAS.
        </p>
      </div>

      <Card className="border-primary/20">
        <CardBody className="p-4 bg-primary/10">
          <div className="space-y-3">
            <div>
              <div className="text-sm text-default-600 mb-1">Potential ROAS</div>
              <div className="text-2xl font-bold text-primary">
                {MIN_ROAS}x - {MAX_ROAS}x
              </div>
            </div>
            
            <div className="pt-3 border-t border-default-200">
              <div className="text-sm text-default-600 mb-1">Potential return</div>
              <div className="text-xl font-bold text-foreground">
                {formatCurrencyJMD(roasData.avgPotentialReturnJmd)}
              </div>
              <div className="text-xs text-default-500 mt-1">
                Range: {formatCurrencyJMD(roasData.minPotentialReturnJmd)} - {formatCurrencyJMD(roasData.maxPotentialReturnJmd)}
              </div>
              {roasData.currentRoas !== null && roasData.avgPercentageIncrease !== null && roasData.avgPercentageIncrease > 0 && (
                <div className="text-sm font-medium text-primary mt-2">
                  {Math.round(roasData.avgPercentageIncrease)}% increase
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
