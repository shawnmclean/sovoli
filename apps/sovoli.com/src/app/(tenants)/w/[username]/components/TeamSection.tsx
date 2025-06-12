"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";
import { motion, useAnimation } from "framer-motion";

import type { OrgInstance } from "~/modules/organisations/types";

interface TeamSectionProps {
  orgInstance: OrgInstance;
}

export function TeamSection({ orgInstance }: TeamSectionProps) {
  const controls = useAnimation();
  const scrollDuration = 80; // Adjust the speed (higher = slower)
  const touchPauseRef = useRef(false);

  const members = orgInstance.workforceModule?.members ?? [];

  // Centralized animation configuration with useMemo
  const scrollConfig = useMemo(
    () => ({
      x: "-100%",
      transition: {
        repeat: Infinity,
        duration: scrollDuration,
        ease: "linear",
      },
    }),
    [scrollDuration],
  );

  useEffect(() => {
    void controls.start(scrollConfig);
    return () => void controls.stop();
  }, [controls, scrollConfig]);

  const handleMouseEnter = () => {
    void controls.stop();
  };

  const handleMouseLeave = () => {
    if (!touchPauseRef.current) void controls.start(scrollConfig);
  };

  const handleTouchStart = () => {
    touchPauseRef.current = true;
    void controls.stop();
  };

  const handleTouchEnd = () => {
    touchPauseRef.current = false;
    void controls.start(scrollConfig);
  };

  return (
    <section className="bg-background3 px-4 py-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden">
        <div className="mb-12 text-center">
          <h2 className="mb-6 text-3xl font-bold">Meet Our Team</h2>
          <p className="mx-auto max-w-2xl text-default-600">
            Our dedicated faculty and staff are committed to providing the
            highest quality education and support for all students.
          </p>
        </div>
        <div
          className="flex"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="flex gap-8"
            animate={controls}
            style={{ display: "flex", width: "auto" }}
          >
            {[...members, ...members, ...members].map((member, index) => (
              <Link
                href={`/workforce/people/${member.slug}`}
                key={index}
                className="group flex w-[160px] flex-col items-center"
              >
                <Avatar
                  src={member.image}
                  alt={member.name}
                  isBordered
                  className="h-28 w-28"
                  radius="full"
                />
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-semibold leading-tight">
                    {member.name}
                  </h3>
                  <p className="max-w-full truncate text-sm text-default-600">
                    {member.roleAssignments
                      .map((role) => role.position.name)
                      .join(", ")}
                  </p>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            color="default"
            variant="bordered"
            radius="sm"
            as={Link}
            href="/workforce/people"
          >
            View All Team Members
          </Button>
        </div>
      </div>
    </section>
  );
}
