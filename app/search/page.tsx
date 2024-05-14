"use client";
import React, { useEffect } from "react";
import SearchMedia from "../dashboard/_components/SearchMedia";
import SelectMediaTypeButton from "../dashboard/_components/SelectMediaTypeButton";
import { debounce } from "lodash";
import { searchMedia } from "../dashboard/_actions/actions";
import SearchResultCard from "./_components/SearchResultCard";

export default function Search() {
  const [mediaType, setMediaType] = React.useState("Movies");
  const [searchResults, setSearchResults] = React.useState<any>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const debouncedSearch = debounce(async () => {
      if (!searchQuery) return;
      setLoading(true);
      const results = await searchMedia(
        searchQuery,
        mediaType == "Movies" ? "movie" : "tv",
      );
      setSearchResults(results);
      console.log(results);
      setLoading(false);
    }, 1000);
    debouncedSearch();
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, mediaType]);

  return (
    <div className="mt-8 w-full px-6 pb-8">
      <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-1">
        <SearchMedia setSearchQuery={setSearchQuery} />
        <SelectMediaTypeButton setMediaType={setMediaType} />
      </div>
      {!searchQuery && (
        <div className="container my-6">
          <div className="flex items-center justify-center">
            <h4 className="text-center font-medium text-muted-foreground">
              What {mediaType} are you looking for?
            </h4>
          </div>
        </div>
      )}
      {searchQuery &&
        !loading &&
        (searchResults?.length > 0 ? (
          <div className="mt-10 space-y-8 lg:space-y-0">
            {searchResults.map((result: any) => (
              <SearchResultCard
                key={result.id}
                result={result}
                mediaType={mediaType}
              />
            ))}
          </div>
        ) : (
          <div className="container my-6">
            <div className="flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                No results found
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
