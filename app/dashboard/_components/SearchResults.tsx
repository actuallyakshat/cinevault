import { Input } from "@/components/ui/input";
import React from "react";

export default function SearchResults({
  results,
  query,
  setQuery,
}: {
  results: any;
  query: string;
  setQuery: Function;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70">
      <div className="h-full items-center justify-center">
        <Input
          type="text"
          placeholder="Search"
          defaultValue={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm font-medium placeholder:font-medium"
        />
        <ul>
          {results.map((result: any, index: number) => (
            <li key={index}>{result.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
