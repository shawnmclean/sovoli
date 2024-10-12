"use client";

import { Pressable } from "react-native";
import { Box } from "@sovoli/ui/components/ui/box";

import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
// import { Avatar, AvatarFallbackText } from "../ui/avatar";
import { HStack } from "../ui/hstack";
import { ChevronLeftIcon, Icon, MenuIcon } from "../ui/icon";
import { Link } from "../ui/link";
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
  // const router = useRouter();
  return (
    <HStack
      className="border-border-50 items-center justify-between border-b bg-background-0 px-4 py-6"
      space="md"
    >
      <HStack className="items-center">
        <Pressable
          onPress={() => {
            // router.back();
            console.log("back");
          }}
        >
          <Icon as={ChevronLeftIcon} className="mr-2" />
        </Pressable>
        <Link href={`/`}>
          <Text className="text-2xl">Sovoli</Text>
        </Link>
      </HStack>

      <ThemeToggle />
    </HStack>
  );
}

function WebHeader() {
  return (
    <HStack className="border-border-300 items-center justify-between border-b bg-background-0 pb-3 pr-10 pt-4">
      <HStack className="items-center">
        <Pressable
          onPress={() => {
            console.log("toggle sidebar");
          }}
        >
          <Icon as={MenuIcon} size="lg" className="mx-5" />
        </Pressable>
        <Link href={`/`}>
          <Text className="text-2xl">Sovoli</Text>
        </Link>
      </HStack>

      <HStack className="items-center space-x-2">
        <HStack className="mr-5 space-x-2">
          <Link href={`/users`}>
            <Text>Users</Text>
          </Link>
          <Link href={`/about`}>
            <Text>Sign Up</Text>
          </Link>
        </HStack>
        <ThemeToggle />
      </HStack>
    </HStack>
  );
}
