"use client";

import React from "react";
import { Button } from "@sovoli/ui/components/button";
import { Card } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { FileWarningIcon, InfoIcon, UserIcon } from "lucide-react";

export function AdminDashboard() {
  return (
    <dl className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
      <Card className="border border-transparent dark:border-default-100">
        <div className="flex p-4">
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-warning-50">
            <UserIcon width={20} />
          </div>

          <div className="flex flex-col gap-y-2">
            <dt className="mx-4 text-small font-medium text-default-500">
              Learners
            </dt>
            <dd className="px-4 text-2xl font-semibold text-default-700">
              112
            </dd>
          </div>

          <Chip
            className="absolute right-4 top-4"
            classNames={{
              content: "font-semibold text-[0.65rem]",
            }}
            color="warning"
            radius="sm"
            size="sm"
            startContent={<InfoIcon width={12} height={12} />}
            variant="flat"
          >
            4 Issues
          </Chip>
        </div>

        <div className="bg-default-100">
          <Button
            fullWidth
            className="flex justify-start text-xs text-default-500 data-[pressed]:scale-100"
            radius="none"
            variant="light"
          >
            View All
          </Button>
        </div>
      </Card>
      <Card className="border border-transparent dark:border-default-100">
        <div className="flex p-4">
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-warning-50">
            <UserIcon width={20} />
          </div>

          <div className="flex flex-col gap-y-2">
            <dt className="mx-4 text-small font-medium text-default-500">
              Instructors
            </dt>
            <dd className="px-4 text-2xl font-semibold text-default-700">8</dd>
          </div>

          <Chip
            className="absolute right-4 top-4"
            classNames={{
              content: "font-semibold text-[0.65rem]",
            }}
            color="default"
            radius="sm"
            size="sm"
            startContent={<FileWarningIcon width={12} height={12} />}
            variant="flat"
          >
            4 Issues
          </Chip>
        </div>

        <div className="bg-default-100">
          <Button
            fullWidth
            className="flex justify-start text-xs text-default-500 data-[pressed]:scale-100"
            radius="none"
            variant="light"
          >
            View All
          </Button>
        </div>
      </Card>
      <Card className="border border-transparent dark:border-default-100">
        <div className="flex p-4">
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-warning-50">
            <UserIcon width={20} />
          </div>

          <div className="flex flex-col gap-y-2">
            <dt className="mx-4 text-small font-medium text-default-500">
              Cohorts
            </dt>
            <dd className="px-4 text-2xl font-semibold text-default-700">8</dd>
          </div>

          <Chip
            className="absolute right-4 top-4"
            classNames={{
              content: "font-semibold text-[0.65rem]",
            }}
            color="default"
            radius="sm"
            size="sm"
            startContent={<FileWarningIcon width={12} height={12} />}
            variant="flat"
          >
            4 Issues
          </Chip>
        </div>

        <div className="bg-default-100">
          <Button
            fullWidth
            className="flex justify-start text-xs text-default-500 data-[pressed]:scale-100"
            radius="none"
            variant="light"
          >
            View All
          </Button>
        </div>
      </Card>
    </dl>
  );
}
