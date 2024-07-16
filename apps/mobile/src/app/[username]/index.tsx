import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { UserScreen } from "@sovoli/ui/screens/user";

export default function Page() {
  const { username } = useLocalSearchParams();

  // Ensure username is a string
  const usernameString = Array.isArray(username) ? username[0] : username;

  if (!usernameString) {
    return null;
  }

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "User Page" }} />
      <UserScreen username={usernameString} />
    </SafeAreaView>
  );
}
