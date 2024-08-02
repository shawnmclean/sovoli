"use client";

import "@sovoli/ui/config/tailwind/globals.css";

import React, { useRef, useState } from "react";
// @ts-expect-error see: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/70147
import { AppRegistry } from "react-native-web";
// eslint-disable-next-line @next/next/no-document-import-in-page
import { Main } from "next/document";
import { useServerInsertedHTML } from "next/navigation";
import { flush } from "@gluestack-ui/nativewind-utils/flush";
import { createStyleRegistry, StyleRegistry } from "styled-jsx";

// Explicitly define the types until they are fixed in DefinitelyTyped
interface AppRegistryType {
  registerComponent: (name: string, componentProvider: () => unknown) => void;
  getApplication: (name: string) => { getStyleElement: () => JSX.Element };
}

// Cast AppRegistry to the defined type
const TypedAppRegistry = AppRegistry as unknown as AppRegistryType;

export default function StyledJsxRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());
  const isServerInserted = useRef(false);

  useServerInsertedHTML(() => {
    TypedAppRegistry.registerComponent("Main", () => Main);
    const { getStyleElement } = TypedAppRegistry.getApplication("Main");
    if (!isServerInserted.current) {
      isServerInserted.current = true;
      const styles = [getStyleElement(), jsxStyleRegistry.styles(), flush()];
      jsxStyleRegistry.flush();
      return <>{styles}</>;
    }
  });

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>;
}
