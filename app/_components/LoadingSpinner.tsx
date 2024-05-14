import { Loader } from "lucide-react";
import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <Loader className="size-10 animate-spin" />
    </div>
  );
}
