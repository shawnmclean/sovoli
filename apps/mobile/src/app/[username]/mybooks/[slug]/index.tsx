import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text } from "@sovoli/ui/components/ui/text";
import MyBookDetailsScreen from "@sovoli/ui/screens/mybooks/details";

import { tsr } from "~/api/tsr";

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

  const { isSuccess, data } = tsr.myBook.getMyBook.useQuery({
    queryKey: ["username", "slug"],
    queryData: {
      params: {
        username,
        slug,
      },
    },
  });

  if (!isSuccess) {
    return null;
  }

  const myBook = data.body;

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "My Book" }} />

      <Text>{slug}</Text>
      <MyBookDetailsScreen myBook={myBook} />
    </SafeAreaView>
  );
}
