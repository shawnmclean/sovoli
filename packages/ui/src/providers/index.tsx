"use client";

// react-native will select .web.tsx for web versions
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { GluestackUIProvider } from "./gluestack-ui-provider";
import { SafeAreaProvider } from "./safe-area-provider";
import { ThemeProvider } from "./theme-provider";

export function UiProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SafeAreaProvider>
        <GluestackUIProvider>
          <ThemeProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              {children}
            </GestureHandlerRootView>
          </ThemeProvider>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </>
  );
}
