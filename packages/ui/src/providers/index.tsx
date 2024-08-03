"use client";

// react-native will select .web.tsx for web versions
import { StylesProvider } from "./styles-provider";
import { ThemeProvider } from "./theme-provider";
import { SafeAreaProvider } from "./safe-area-provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export function UiProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <SafeAreaProvider> */}
      <ThemeProvider>
        <StylesProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            {children}
          </GestureHandlerRootView>
        </StylesProvider>
      </ThemeProvider>
      {/* </SafeAreaProvider> */}
    </>
  );
}
