import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import { UserScreen } from "@sovoli/ui/screens/user";

import { tsr } from "~/api/react";

export default function Page() {
  const { username } = useLocalSearchParams();

  if (!username || typeof username !== "string") {
    return null;
  }

  const { isSuccess, data } = tsr.getUserMyBooksProfile.useQuery({
    queryKey: ["username"],
    queryData: {
      params: {
        username,
      },
    },
  });

  if (!isSuccess) {
    return null;
  }

  const profile = data.body;

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "User Page" }} />
      <UserScreen profile={profile} />
    </SafeAreaView>
  );
}
