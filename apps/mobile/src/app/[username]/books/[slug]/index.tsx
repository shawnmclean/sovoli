import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import MyBookDetailsScreen from "@sovoli/ui/screens/mybooks/details";
import { Text } from "@sovoli/ui/components/text";

export default function Page() {
  const { username, slug } = useLocalSearchParams();

  if (!username || !slug) {
    return null;
  }

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "My Book" }} />

      <Text>{slug}</Text>
      <MyBookDetailsScreen />
    </SafeAreaView>
  );
}
