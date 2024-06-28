import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { HomeScreen } from "@sovoli/ui/screens/home";

export default function Index() {
  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <HomeScreen />
    </SafeAreaView>
  );
}
