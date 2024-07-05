import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { MyBooksScreen } from "@sovoli/ui/screens/mybooks";

import { ScrollView, Text } from "react-native";

export default function Page() {
  const { username } = useLocalSearchParams();

  if (!username) {
    return null;
  }

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "User Books" }} />
      <MyBooksScreen />
    </SafeAreaView>
  );
}
