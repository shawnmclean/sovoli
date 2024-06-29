import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "@sovoli/ui/hooks/useColorScheme";
import { StylesProvider } from "@sovoli/ui/providers";
import { NAV_THEME } from "@sovoli/ui/lib/constants";
import { PortalHost } from "@rn-primitives/portal";
import { Text } from "@sovoli/ui/components/text";
import { Button } from "@sovoli/ui/components/button";

import "@sovoli/ui/config/tailwind/globals.css";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme, isDarkColorScheme, setColorScheme } = useColorScheme();

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StylesProvider>
        {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
        <Stack
          screenOptions={{
            headerTitle(props) {
              return (
                <Text className="text-xl font-semibold">
                  {toOptions(props.children)}
                </Text>
              );
            },
            headerRight: () => (
              <Button
                onPress={() => {
                  setColorScheme(colorScheme == "dark" ? "light" : "dark");
                }}
              >
                <Text>{colorScheme == "dark" ? "Light" : "Dark"}</Text>
              </Button>
            ),
          }}
        />
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <PortalHost />
      </StylesProvider>
    </ThemeProvider>
  );
}
function toOptions(name: string) {
  const title = name
    .split("-")
    .map(function (str: string) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    })
    .join(" ");
  return title;
}
