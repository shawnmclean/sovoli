import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { ShelfScreen } from "@sovoli/ui/screens/mybooks/shelf";

import { api } from "~/api/trpc/api";

export default function Page() {
  const { username, slug } = useLocalSearchParams();

  if (
    !username ||
    !slug ||
    typeof username !== "string" ||
    typeof slug !== "string"
  ) {
    return null;
  }

  const { data: shelf } = api.shelf.bySlug.useQuery({ username, slug });

  if (!shelf) {
    return null;
  }

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: `User Books}` }} />

      <ShelfScreen shelf={shelf} />
    </SafeAreaView>
  );
}
