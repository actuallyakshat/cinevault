"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import NextTopLoader from "nextjs-toploader";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function NavigationLoader({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <>
      <NextTopLoader
        showSpinner={false}
        color={theme === "dark" ? "#fff" : "#000"}
      />
      {children}
    </>
  );
}
