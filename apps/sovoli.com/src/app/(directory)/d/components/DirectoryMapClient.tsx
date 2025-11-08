"use client";

import dynamic from "next/dynamic";

import type { DirectoryMapProps } from "./DirectoryMap";

const DirectoryMapLazy = dynamic(
  () => import("./DirectoryMap").then((mod) => mod.DirectoryMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full animate-pulse border border-dashed border-default-300 bg-default-100" />
    ),
  },
);

export function DirectoryMapClient(props: DirectoryMapProps) {
  return <DirectoryMapLazy {...props} />;
}
