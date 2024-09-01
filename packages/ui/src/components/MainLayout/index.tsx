import { Header } from "../Header";
import { HStack } from "../ui/hstack";
// import { SafeAreaView } from "../ui/safe-area-view";
import { VStack } from "../ui/vstack";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // <SafeAreaView className="h-full w-full">
    <VStack className="h-full w-full bg-background-0">
      <Header />

      <VStack className="h-full w-full">
        <HStack className="h-full w-full">
          <VStack className="w-full">{children}</VStack>
        </HStack>
      </VStack>
    </VStack>
    // </SafeAreaView>
  );
};
