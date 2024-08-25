import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { RoadmapScreen } from "@sovoli/ui/screens/roadmap";

export default function Index() {
  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Roadmap" }} />
      <RoadmapScreen />
    </SafeAreaView>
  );
}
