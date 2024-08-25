"use client";

import { Box } from "@sovoli/ui/components/ui/box";

import { Text } from "../ui/text";

export function Header() {
  return (
    <>
      <Box className="md:hidden">
        <MobileHeader />
      </Box>
      <Box className="hidden md:flex">
        <WebHeader />
      </Box>
    </>
  );
}

function MobileHeader() {
  return <Text>Mobile Header</Text>;
}

function WebHeader() {
  return <Text>Web Header</Text>;
}
