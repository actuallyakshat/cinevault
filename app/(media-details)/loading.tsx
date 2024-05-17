import { Loader } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[2001] flex flex-col items-center justify-center gap-2 bg-background/80">
      <div>
        <Loader className="size-8 animate-spin" />
      </div>
      <p className="text-lg font-bold text-foreground/70">
        Hang tight, we&apos;re loading...
      </p>
    </div>
  );
}
