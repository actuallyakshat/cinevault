import React, { useEffect, useState } from "react";
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
  sortOrder: string;
  setSortOrder: (order: string) => void;
  selectedList: string;
}) => {
  const [buttonTitle, setButtontitle] = useState("Sort");
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

  useEffect(() => {
    if (selectedList != "Watched" && sortCriterion == "rating") {
      setSortOrder("none");
      setSortCriterion("");
      return;
    }
    if (sortCriterion) {
      if (sortCriterion === "name") {
        setButtontitle(`Sort by Name ${getArrow("name")}`);
      } else if (sortCriterion === "releaseYear") {
        setButtontitle(`Sort by Release Year ${getArrow("releaseYear")}`);
      } else if (sortCriterion === "rating") {
        setButtontitle(`Sort by Rating ${getArrow("rating")}`);
      }
    } else {
      setButtontitle("Sort");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortCriterion, sortOrder, selectedList]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={`${sortOrder !== "none" ? "underline" : ""}`}
      >
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
