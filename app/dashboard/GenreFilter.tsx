import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";

export default function GenreFilter({
  uniqueGenres,
  selectedGenres,
  handleGenreChange,
}: {
  uniqueGenres: string[];
  selectedGenres: string[];
  handleGenreChange: (genre: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          className={`${selectedGenres.length > 0 ? "underline" : ""} text-sm`}
        >
          Filter by Genre
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-medium">
        {uniqueGenres.length > 0 ? (
          uniqueGenres.map((genre: string) => (
            <DropdownMenuItem key={genre} onClick={(e) => e.preventDefault()}>
              <label
                onClick={() => handleGenreChange(genre)}
                className="flex w-full cursor-pointer items-center gap-2"
              >
                <Checkbox checked={selectedGenres.includes(genre)} />
                <span className="h-full w-full">{genre}</span>
              </label>
            </DropdownMenuItem>
          ))
        ) : (
          <div>
            <p className="text-medium p-3 text-sm text-muted-foreground">
              No genres found
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
