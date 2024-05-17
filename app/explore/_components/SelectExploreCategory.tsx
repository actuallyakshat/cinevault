import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function SelectExploreCategory({
  setExploreCategory,
  exploreCategory,
}: {
  setExploreCategory: Function;
  exploreCategory: string;
}) {
  return (
    <div>
      <Select
        defaultValue={exploreCategory}
        onValueChange={(value) => {
          localStorage.setItem("exploreCategory", value);
          setExploreCategory(value);
        }}
      >
        <SelectTrigger className="w-[180px] font-semibold">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent className="font-semibold">
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="top-rated">Top Rated</SelectItem>
          <SelectItem value="popular">Popular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
