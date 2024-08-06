import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";

// import { ShelfScreen } from "@sovoli/ui/screens/mybooks/shelf";

// import { tsr } from "~/api/react";

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

  // const { isSuccess, data } = tsr.getShelfBooks.useQuery({
  //   queryKey: ["username", "slug"],
  //   queryData: {
  //     params: {
  //       username,
  //       slug,
  //     },
  //     query: {
  //       page: 1,
  //     },
  //   },
  // });

  // if (!isSuccess) {
  //   return null;
  // }

  // const shelf = data.body;

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: `User Books}` }} />

      {/* <ShelfScreen shelf={shelf} /> */}
    </SafeAreaView>
  );
}
