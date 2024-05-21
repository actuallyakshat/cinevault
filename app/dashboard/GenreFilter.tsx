import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { UserPlus, Mail, MessageSquare, PlusCircle } from "lucide-react";

export default function GenreFilter({
  uniqueGenres,
}: {
  uniqueGenres: string[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Filter by Genre</DropdownMenuTrigger>
      <DropdownMenuContent>
        {uniqueGenres.map((genre: string) => (
          <DropdownMenuItem key={genre}>{genre}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
