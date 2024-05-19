import { Clapperboard, MonitorPlay, Popcorn } from "lucide-react";
import React from "react";

export default function LoadingScreen() {
  const theme = localStorage.getItem("theme") || "light";
  return (
    <div
      className={`fixed inset-0 top-0 z-[2000] flex items-center justify-center ${theme == "light" ? "" : "dark"} bg-background`}
    >
      <Clapperboard className="size-12 animate-spin text-foreground" />
    </div>
  );
}
