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
  mediaType,
  setMediaType,
}: {
  setMediaType: Function;
  mediaType: string;
}) {
  return (
    <Select
      defaultValue={mediaType}
      onValueChange={(value) => {
        localStorage.setItem("mediaType", value);
        setMediaType(value);
      }}
    >
      <SelectTrigger className="w-full font-semibold sm:w-[180px]">
        <SelectValue placeholder="Media Type" />
      </SelectTrigger>
      <SelectContent className="font-semibold">
        <SelectItem value="Movies">Movies</SelectItem>
        <SelectItem value="Shows">Shows</SelectItem>
      </SelectContent>
    </Select>
  );
}
