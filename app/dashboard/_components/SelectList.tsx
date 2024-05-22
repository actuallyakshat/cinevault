"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

export default function SelectList({
  selectedList,
  setSelectedList,
}: {
  setSelectedList: Function;
  selectedList: string;
}) {
  return (
    <Select
      defaultValue={selectedList}
      onValueChange={(value) => {
        localStorage.setItem("selectedList", value);
        setSelectedList(value);
      }}
    >
      <SelectTrigger className="w-full font-semibold sm:w-[180px]">
        <SelectValue placeholder="Select List" />
      </SelectTrigger>
      <SelectContent className="font-semibold">
        <SelectItem value="Watchlist">Watchlist</SelectItem>
        <SelectItem value="Favorites">Favorites</SelectItem>
        <SelectItem value="Watched">Watched</SelectItem>
      </SelectContent>
    </Select>
  );
}
