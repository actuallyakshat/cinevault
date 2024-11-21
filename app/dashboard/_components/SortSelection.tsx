import React, { useCallback, useEffect, useState } from "react";
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
  selectedList,
}: {
  sortCriterion: string;
  setSortCriterion: (criterion: string) => void;
  sortOrder: "asc" | "desc" | "none";
  setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc" | "none">>;
  selectedList: string;
}) => {
  const [buttonTitle, setButtontitle] = useState("Sort");

  const toggleSortOrder = (criterion: string) => {
    if (sortCriterion !== criterion) {
      setSortCriterion(criterion);
      setSortOrder("asc");
    } else {
      setSortOrder((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? "none" : "asc",
      );
    }
  };

  const getArrow = useCallback(
    (criterion: string) => {
      if (sortCriterion !== criterion) return "";
      return sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : "";
    },
    [sortCriterion, sortOrder],
  );

  useEffect(() => {
    if (selectedList !== "Watched" && sortCriterion === "rating") {
      setSortOrder("none");
      setSortCriterion("");
      return;
    }

    const titleMap: Record<string, string> = {
      name: `Sort by Name ${getArrow("name")}`,
      releaseYear: `Sort by Release Year ${getArrow("releaseYear")}`,
      rating: `Sort by Rating ${getArrow("rating")}`,
    };

    setButtontitle(sortCriterion ? titleMap[sortCriterion] : "Sort");
  }, [
    sortCriterion,
    sortOrder,
    selectedList,
    setSortCriterion,
    setSortOrder,
    getArrow,
  ]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={sortOrder !== "none" ? "underline" : ""}>
        <Button variant="ghost" className="text-sm">
          {buttonTitle}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-medium">
        <DropdownMenuItem onSelect={() => toggleSortOrder("name")}>
          Name {getArrow("name")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toggleSortOrder("releaseYear")}>
          Release Year {getArrow("releaseYear")}
        </DropdownMenuItem>
        {selectedList === "Watched" && (
          <DropdownMenuItem onSelect={() => toggleSortOrder("rating")}>
            Rating {getArrow("rating")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortSelection;
