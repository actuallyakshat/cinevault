"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

export default function SelectMediaTypeButton({
  setMediaType,
}: {
  setMediaType: Function;
}) {
  return (
    <div>
      <Select
        defaultValue="Movies"
        onValueChange={(value) => setMediaType(value)}
      >
        <SelectTrigger className="w-[180px] font-semibold">
          <SelectValue placeholder="Media Type" />
        </SelectTrigger>
        <SelectContent className="font-semibold">
          <SelectItem value="Movies">Movies</SelectItem>
          <SelectItem value="Shows">Shows</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
