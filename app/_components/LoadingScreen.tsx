import { Clapperboard, MonitorPlay, Popcorn } from "lucide-react";
import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Clapperboard className="size-12 animate-spin" />
    </div>
  );
}
