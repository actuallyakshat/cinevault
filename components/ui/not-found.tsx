import React from "react";

export default function NotFound({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mt-16 flex h-screen w-full flex-col items-center justify-center gap-1.5">
      {children}
    </div>
  );
}
