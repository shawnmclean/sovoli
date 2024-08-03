"use client";

// react-native will select .web.tsx for web versions
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useColorScheme } from "../hooks/useColorScheme/useColorScheme";
import { GluestackUIProvider } from "./gluestack-ui-provider";
// import { StylesProvider } from "./styles-provider";
import { ThemeProvider } from "./theme-provider";

export function UiProviders({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  return (
    <>
      {/* <SafeAreaProvider> */}
      <GluestackUIProvider mode={colorScheme}>
        <ThemeProvider mode={colorScheme}>
          {/* <StylesProvider> */}
          <GestureHandlerRootView style={{ flex: 1 }}>
            {children}
          </GestureHandlerRootView>
          {/* </StylesProvider> */}
        </ThemeProvider>
      </GluestackUIProvider>
      {/* </SafeAreaProvider> */}
    </>
  );
}
