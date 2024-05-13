"use client";

import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import React from "react";

export default function ThemeToggler() {
  const { setTheme, theme } = useTheme();
  return (
    <div className="flex items-center gap-4">
      <Switch
        defaultChecked={theme === "dark" ? true : false}
        onCheckedChange={(checked: boolean) =>
          setTheme(checked ? "dark" : "light")
        }
      />
      <span className="font-medium text-foreground">
        {theme == "dark" ? "Dark" : "Light"}
      </span>
    </div>
  );
}
