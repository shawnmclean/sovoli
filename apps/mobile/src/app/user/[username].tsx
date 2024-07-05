import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { UserScreen } from "@sovoli/ui/screens/user";

import { ScrollView, Text } from "react-native";

export default function Page() {
  const { username } = useLocalSearchParams();

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "User Page" }} />
      <UserScreen username={username} />
    </SafeAreaView>
  );
}
