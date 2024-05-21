import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const SortSelection = ({
  sortCriterion,
  setSortCriterion,
  sortOrder,
  setSortOrder,
}: {
  sortCriterion: string;
  setSortCriterion: (criterion: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}) => {
  const toggleSortOrder = (criterion: string) => {
    if (sortCriterion !== criterion) {
      setSortCriterion(criterion);
      setSortOrder("asc");
    } else {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortOrder("none");
        setSortCriterion("");
      } else {
        setSortOrder("asc");
      }
    }
  };

  const getArrow = (criterion: string) => {
    if (sortCriterion !== criterion) return "";
    if (sortOrder === "asc") return "↑";
    if (sortOrder === "desc") return "↓";
    return "";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`${sortOrder != "none" ? "underline" : ""}`}
      >
        <Button variant="ghost" className="text-sm">
          Sort{" "}
          {sortCriterion &&
            (sortCriterion === "name"
              ? `by Name ${getArrow("name")}`
              : `Release Year ${getArrow("releaseYear")}`)}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => toggleSortOrder("name")}>
          Name {getArrow("name")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toggleSortOrder("releaseYear")}>
          Release Year {getArrow("releaseYear")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortSelection;
