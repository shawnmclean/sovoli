"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Button } from "@sovoli/ui/components/button";
import type { ReliefFormData } from "./ReliefForm";
import { SUPPLIES_ITEMS } from "./SuppliesContribution";

interface ConfirmationProps {
  formData: ReliefFormData;
  onResetForm: () => void;
  onReviewAnswers: () => void;
}

export function Confirmation({
  formData,
  onResetForm,
  onReviewAnswers,
}: ConfirmationProps) {
  const isSupplies = formData.contributionType === "supplies";
  const hasSuppliesItems =
    Object.keys(formData.suppliesItems).length > 0 ||
    formData.suppliesOther.trim().length > 0;

  const selectedSuppliesItems = Object.keys(formData.suppliesItems)
    .filter(
      (itemId) =>
        formData.suppliesItems[itemId] && formData.suppliesItems[itemId] > 0,
    )
    .map((itemId) => {
      const item = SUPPLIES_ITEMS.find((i) => i.id === itemId);
      const quantity = formData.suppliesItems[itemId];
      return item ? { id: itemId, name: item.name, quantity } : null;
    })
    .filter(
      (item): item is { id: string; name: string; quantity: number } =>
        item !== null,
    );

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-3">
        <p className="text-base text-default-500">
          Our relief team will reach out shortly to coordinate your
          contribution. We truly appreciate your support during this recovery
          effort.
        </p>
      </div>

      {isSupplies && hasSuppliesItems && (
        <Card className="rounded-2xl border border-default-200 bg-default-50/80 text-left">
          <CardHeader className="flex flex-col items-start gap-2 px-5 py-4 sm:px-6">
            <h3 className="text-lg font-semibold">Supplies Information</h3>
            <p className="text-small text-default-500">
              Details about your supplies contribution.
            </p>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4 px-5 py-4 text-sm sm:px-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <dt className="font-medium text-default-600">Supplies</dt>
              <dd className="text-default-800">
                {selectedSuppliesItems.length > 0 && (
                  <div className="space-y-1">
                    {selectedSuppliesItems.map((item, idx) => (
                      <div key={idx}>
                        {item.name}{" "}
                        <span className="font-medium">({item.quantity})</span>
                        {formData.suppliesItemNotes[item.id] && (
                          <span className="block text-default-500 text-xs mt-1">
                            {formData.suppliesItemNotes[item.id]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {formData.suppliesOther && (
                  <div
                    className={selectedSuppliesItems.length > 0 ? "mt-2" : ""}
                  >
                    Other: {formData.suppliesOther}
                  </div>
                )}
              </dd>
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="rounded-2xl border border-default-200 bg-default-50/80 text-left">
        <CardHeader className="flex flex-col items-start gap-2 px-5 py-4 sm:px-6">
          <h3 className="text-lg font-semibold">Shipping Information</h3>
          <p className="text-small text-default-500">
            Where to send your contribution and your point of contact.
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4 px-5 py-4 text-sm sm:px-6">
          <div className="flex flex-col gap-1">
            <dt className="font-medium text-default-600">Foundation</dt>
            <dd className="text-default-800">
              <div className="space-y-1">
                <div className="font-semibold">Jamaica Relief Foundation</div>
                <div className="text-default-500 text-xs">
                  123 Main Street
                  <br />
                  Kingston, Jamaica
                </div>
              </div>
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="font-medium text-default-600">Contact Person</dt>
            <dd className="text-default-800">
              <div className="space-y-1">
                <div className="font-semibold">Larren Peart</div>
                <div className="text-default-500 text-xs">
                  BlueDot - On the ground logistics and distribution
                </div>
              </div>
            </dd>
          </div>
        </CardBody>
      </Card>

      <Card className="rounded-2xl border border-default-200 bg-default-50/80 text-left">
        <CardHeader className="flex flex-col items-start gap-2 px-5 py-4 sm:px-6">
          <h3 className="text-lg font-semibold">Submission Summary</h3>
          <p className="text-small text-default-500">
            Review the details you shared with our relief team.
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4 px-5 py-4 text-sm sm:px-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <dt className="font-medium text-default-600">Contribution type</dt>
            <dd className="text-default-800 capitalize">
              {formData.contributionType}
            </dd>
          </div>
          {formData.contributionType === "labour" && (
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <dt className="font-medium text-default-600">Availability</dt>
              <dd className="text-default-800">
                {formData.labourAvailability === "end-of-nov"
                  ? "End of November"
                  : formData.labourAvailability === "other"
                    ? formData.labourAvailabilityOther
                    : "Now"}
              </dd>
            </div>
          )}
          {formData.contributionType === "financial" && (
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <dt className="font-medium text-default-600">Amount</dt>
              <dd className="text-default-800">
                {formData.financialCurrency}{" "}
                {Number(formData.financialAmount).toLocaleString()}
              </dd>
            </div>
          )}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <dt className="font-medium text-default-600">Your details</dt>
            <dd className="text-default-800">
              {formData.name}
              <br />
              {formData.phone}
              <br />
              {formData.addressLine1}
              {formData.addressLine2 && (
                <>
                  <br />
                  {formData.addressLine2}
                </>
              )}
              <br />
              {formData.city}, {formData.stateCountry}
            </dd>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onPress={onResetForm} variant="flat" color="primary">
          Submit another response
        </Button>
        <Button onPress={onReviewAnswers} variant="ghost" className="sm:ml-2">
          Review your answers
        </Button>
      </div>
    </div>
  );
}
