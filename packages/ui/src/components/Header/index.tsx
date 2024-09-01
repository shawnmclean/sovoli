"use client";

import { Pressable } from "react-native";
import { Box } from "@sovoli/ui/components/ui/box";

import { Avatar, AvatarFallbackText } from "../ui/avatar";
import { HStack } from "../ui/hstack";
import { ChevronLeftIcon, Icon, MenuIcon } from "../ui/icon";
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
      className="border-border-50 items-center border-b bg-background-0 px-4 py-6"
      space="md"
    >
      <Pressable
        onPress={() => {
          // router.back();
          console.log("back");
        }}
      >
        <Icon as={ChevronLeftIcon} />
      </Pressable>
      <Text className="text-xl">Mobile Header</Text>
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
        <Text className="text-2xl">Web Header</Text>
      </HStack>

      <Avatar className="h-9 w-9">
        <AvatarFallbackText className="font-light">A</AvatarFallbackText>
      </Avatar>
    </HStack>
  );
}
