"use client";

import Image from "next/image";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import type { ReliefFormData } from "./ReliefForm";
import { findItemById } from "~/modules/data/items";
import {
  CONTACT_ROLE_OPTIONS,
  ORG_TYPE_OPTIONS,
  PARISH_OPTIONS,
} from "./options";

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
  const selectedSupplies = formData.suppliesSelected
    .map((itemId) => {
      const item = findItemById(itemId);
      if (!item) {
        return null;
      }
      const quantity = formData.suppliesQuantities[itemId] ?? 0;
      if (quantity > 0) {
        return `${item.name} (x${quantity})`;
      }
      return item.name;
    })
    .filter((name): name is string => Boolean(name));
  const hasSupplies =
    selectedSupplies.length > 0 || formData.suppliesOther.trim().length > 0;
  const contactFullName = [formData.contactFirstName, formData.contactLastName]
    .filter((value) => value && value.trim().length > 0)
    .join(" ");
  const organisationTypeLabel =
    ORG_TYPE_OPTIONS.find((option) => option.key === formData.schoolType)
      ?.label ?? formData.schoolType;
  const contactRoleLabel =
    CONTACT_ROLE_OPTIONS.find((option) => option.key === formData.contactRole)
      ?.label ?? formData.contactRole;
  const parishLabel =
    PARISH_OPTIONS.find((option) => option.key === formData.locationParish)
      ?.label ?? formData.locationParish;
  const damagePhotos = formData.photos.filter(
    (photo) => photo.status === "success" && photo.url,
  );
  const hasDamagePhotos = damagePhotos.length > 0;

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-3">
        <p className="text-base text-default-500">
          Thanks for sharing your school&apos;s needs. Our team will reach out
          to coordinate next steps and keep you updated on support.
        </p>
      </div>

      {hasSupplies && (
        <Card className="rounded-2xl border border-default-200 bg-default-50/80 text-left">
          <CardHeader className="flex flex-col items-start gap-2 px-5 py-4 sm:px-6">
            <h3 className="text-lg font-semibold">Supplies Needed</h3>
            <p className="text-small text-default-500">
              We captured these items from your submission.
            </p>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4 px-5 py-4 text-sm sm:px-6">
            {selectedSupplies.length > 0 && (
              <ul className="list-disc space-y-1 pl-5 text-default-800">
                {selectedSupplies.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            )}
            {formData.suppliesOther && (
              <div className="text-default-800">
                <span className="font-medium">Other items: </span>
                {formData.suppliesOther}
              </div>
            )}
            {formData.notes && (
              <div className="rounded-lg border border-default-200 bg-white/60 p-3 text-default-700">
                <span className="font-medium">Notes: </span>
                {formData.notes}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {hasDamagePhotos && (
        <Card className="rounded-2xl border border-default-200 bg-default-50/80 text-left">
          <CardHeader className="flex flex-col items-start gap-2 px-5 py-4 sm:px-6">
            <h3 className="text-lg font-semibold">Damage Photos</h3>
            <p className="text-small text-default-500">
              These photos will help us verify the damage.
            </p>
          </CardHeader>
          <Divider />
          <CardBody className="px-5 py-4 sm:px-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {damagePhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square overflow-hidden rounded-xl border border-default-200 bg-default-100"
                >
                  <Image
                    src={photo.url ?? ""}
                    alt={photo.fileName}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 140px, 40vw"
                  />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="rounded-2xl border border-default-200 bg-default-50/80 text-left">
        <CardHeader className="flex flex-col items-start gap-2 px-5 py-4 sm:px-6">
          <h3 className="text-lg font-semibold">School & Location</h3>
          <p className="text-small text-default-500">
            Confirm we captured the correct campus details.
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4 px-5 py-4 text-sm sm:px-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <dt className="font-medium text-default-600">School</dt>
            <dd className="text-default-800">
              {formData.schoolName}
              {organisationTypeLabel && (
                <span className="block text-default-500 text-xs">
                  {organisationTypeLabel}
                </span>
              )}
            </dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <dt className="font-medium text-default-600">Location</dt>
            <dd className="text-default-800">
              {formData.locationAddressLine1}
              {formData.locationAddressLine2 && (
                <>
                  <br />
                  {formData.locationAddressLine2}
                </>
              )}
              <br />
              {formData.locationCity}, {parishLabel}
            </dd>
          </div>
        </CardBody>
      </Card>

      <Card className="rounded-2xl border border-default-200 bg-default-50/80 text-left">
        <CardHeader className="flex flex-col items-start gap-2 px-5 py-4 sm:px-6">
          <h3 className="text-lg font-semibold">Point of Contact</h3>
          <p className="text-small text-default-500">
            We use this information for follow-ups and confirmations.
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4 px-5 py-4 text-sm sm:px-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <dt className="font-medium text-default-600">Contact</dt>
            <dd className="text-default-800">
              {contactFullName}
              {contactRoleLabel && (
                <span className="block text-default-500 text-xs">
                  {contactRoleLabel}
                </span>
              )}
            </dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <dt className="font-medium text-default-600">Phone</dt>
            <dd className="text-default-800">{formData.contactPhone}</dd>
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
