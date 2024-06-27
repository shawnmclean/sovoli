"use client";

// react-native will select .web.tsx for web versions
import { StylesProvider as RNStylesProvider } from "./styles-provider";

export function StylesProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RNStylesProvider>{children}</RNStylesProvider>
    </>
  );
}
