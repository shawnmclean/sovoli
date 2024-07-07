import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function Page() {
  const { username, slug } = useLocalSearchParams();

  if (!username || !slug) {
    return null;
  }

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: `User Books - ${slug}` }} />
    </SafeAreaView>
  );
}
