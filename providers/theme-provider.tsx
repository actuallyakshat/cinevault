"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import NextTopLoader from "nextjs-toploader";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function NavigationLoader({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [color, setColor] = React.useState<string>("");

  React.useEffect(() => {
    setTheme(localStorage.getItem("theme") || "light");
  }, [setTheme]);

  React.useEffect(() => {
    setColor(theme === "dark" ? "#fff" : "#000");
  }, [theme]);
  return (
    <>
      <NextTopLoader showSpinner={false} color={color} />
      {children}
    </>
  );
}
