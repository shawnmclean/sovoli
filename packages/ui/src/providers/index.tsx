"use client";

// react-native will select .web.tsx for web versions
import { StylesProvider } from "./styles-provider";
import { ThemeProvider } from "./theme-provider";

export function UiProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider>
        <StylesProvider>{children}</StylesProvider>
      </ThemeProvider>
    </>
  );
}
