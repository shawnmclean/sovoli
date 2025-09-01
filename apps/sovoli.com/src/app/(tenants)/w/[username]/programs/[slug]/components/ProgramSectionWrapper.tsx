"use client";

import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { Divider } from "@sovoli/ui/components/divider";
import { trackProgramAnalytics } from "../lib/programAnalytics";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import Link from "next/link";

interface ProgramSectionWrapperProps {
  children: React.ReactNode;
  section: string;
  program: Program;
  cycle?: ProgramCycle;
  className?: string;
  href?: string;
}

export function ProgramSectionWrapper({
  children,
  program,
  section,
  cycle,
  className,
  href,
}: ProgramSectionWrapperProps) {
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
