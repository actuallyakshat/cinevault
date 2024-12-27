"use client";

import { Clapperboard } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
  }, []);

  return (
    <div
      className={`fixed inset-0 top-0 z-[2000] flex items-center justify-center ${
        theme === "light" ? "" : "dark"
      } bg-background`}
    >
      <Clapperboard className="size-12 animate-spin text-foreground" />
    </div>
  );
}
