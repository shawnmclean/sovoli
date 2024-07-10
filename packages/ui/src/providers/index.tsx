"use client";

// react-native will select .web.tsx for web versions
import { StylesProvider } from "./styles-provider";
import { ThemeProvider } from "./theme-provider";
import { SafeAreaProvider } from "./safe-area-provider";

export function UiProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <SafeAreaProvider> */}
      <ThemeProvider>
        <StylesProvider>{children}</StylesProvider>
      </ThemeProvider>
      {/* </SafeAreaProvider> */}
    </>
  );
}
