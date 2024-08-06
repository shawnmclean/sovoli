/* eslint-disable @typescript-eslint/no-floating-promises */

import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PortalHost } from "@rn-primitives/portal";
import { Button } from "@sovoli/ui/components/button";
import { Text } from "@sovoli/ui/components/text";
import { useColorScheme } from "@sovoli/ui/hooks/useColorScheme";
import { UiProviders } from "@sovoli/ui/providers";

import "@sovoli/ui/config/tailwind/globals.css";

import React from "react";

import { QueryProviders } from "~/api/react";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme, isDarkColorScheme, setColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const initialLoadRef = React.useRef(true);
  // Effect to load and set the initial color scheme
  React.useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      (async () => {
        console.log("running effect");
        const theme = await AsyncStorage.getItem("theme");

        console.log("theme", theme);
        if (!theme) {
          await AsyncStorage.setItem("theme", colorScheme);
          setIsColorSchemeLoaded(true);
          return;
        }
        const colorTheme = theme === "dark" ? "dark" : "light";
        if (colorTheme !== colorScheme) {
          setColorScheme(colorTheme);
        }
        setIsColorSchemeLoaded(true);
      })().finally(() => {
        SplashScreen.hideAsync();
      });
    }
  }, [colorScheme, setColorScheme]);

  // Effect to update storage whenever colorScheme changes
  React.useEffect(() => {
    if (isColorSchemeLoaded) {
      AsyncStorage.setItem("theme", colorScheme);
    }
  }, [colorScheme, isColorSchemeLoaded]);

  if (!isColorSchemeLoaded) {
    return null;
  }
  return (
    <QueryProviders>
      <UiProviders>
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
                <Text>{colorScheme}</Text>
              </Button>
            ),
          }}
        />
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <PortalHost />
      </UiProviders>
    </QueryProviders>
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
