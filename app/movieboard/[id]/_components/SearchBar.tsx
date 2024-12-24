"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  console.log("infinite loop");

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search boards..."
        onChange={(e) => onSearch(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
