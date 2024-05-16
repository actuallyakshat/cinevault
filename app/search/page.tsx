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
    setLoading(true);
    const debouncedSearch = debounce(async () => {
      if (!searchQuery) return;
      const results = await searchMedia(
        searchQuery,
        mediaType === "Movies" ? "movie" : "tv",
      );
      setSearchResults(results);
      setLoading(false);
    }, 1000);
    debouncedSearch();
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, mediaType]);

  useEffect(() => {
    setSearchResults([]);
  }, [searchQuery]);

  return (
    <div className="mt-8 w-full px-6 pb-8">
      <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-1">
        <SearchMedia setSearchQuery={setSearchQuery} />
        <SelectMediaTypeButton setMediaType={setMediaType} />
      </div>
      {searchQuery && loading && (
        <div className="my-6 flex flex-col items-center gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex w-full max-w-[960px] gap-8">
              <div className="h-[350px] w-[270px] animate-pulse rounded-lg bg-gray-400"></div>
              <div className="flex w-full flex-col gap-4">
                <div className="flex h-10 w-full items-center gap-6">
                  <div className="h-full flex-[4] animate-pulse rounded-lg bg-gray-400"></div>
                  <div className="h-full flex-[1] animate-pulse rounded-lg bg-gray-400"></div>
                </div>
                <div className="h-4 w-[20%] animate-pulse rounded-lg bg-gray-400"></div>
                <div className="h-36 w-[60%] animate-pulse rounded-lg bg-gray-400"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {searchQuery && !loading && searchResults?.length === 0 && (
        <div className="container my-6">
          <div className="flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              No results found
            </div>
          </div>
        </div>
      )}
      {!loading && searchQuery && searchResults?.length > 0 && (
        <div className="mt-10 space-y-8 lg:space-y-3">
          {searchResults.map((result: any) => (
            <SearchResultCard
              key={result.id}
              result={result}
              mediaType={mediaType}
            />
          ))}
        </div>
      )}
      {!searchQuery && (
        <div className="container my-6">
          <div className="flex items-center justify-center">
            <h4 className="text-center font-medium text-muted-foreground">
              What {mediaType} are you looking for?
            </h4>
          </div>
        </div>
      )}

      {/* {!searchQuery && (
        <div className="container my-6">
          <div className="flex items-center justify-center">
            <h4 className="text-center font-medium text-muted-foreground">
              What {mediaType} are you looking for?
            </h4>
          </div>
        </div>
      )}
      {searchQuery && loading && (
        <div className="my-6 flex flex-col items-center gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex w-full max-w-[960px] gap-8">
              <div className="h-[350px] w-[270px] animate-pulse rounded-lg bg-gray-400"></div>
              <div className="flex w-full flex-col gap-4">
                <div className="flex h-10 w-full items-center gap-6">
                  <div className="h-full flex-[4] animate-pulse rounded-lg bg-gray-400"></div>
                  <div className="h-full flex-[1] animate-pulse rounded-lg bg-gray-400"></div>
                </div>
                <div className="h-4 w-[20%] animate-pulse rounded-lg bg-gray-400"></div>
                <div className="h-36 w-[60%] animate-pulse rounded-lg bg-gray-400"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && searchQuery && searchResults?.length === 0 && (
        <div className="container my-6">
          <div className="flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              No results found
            </div>
          </div>
        </div>
      )}
      {!loading && searchQuery && searchResults?.length > 0 && (
        <div className="mt-10 space-y-8 lg:space-y-3">
          {searchResults.map((result: any) => (
            <SearchResultCard
              key={result.id}
              result={result}
              mediaType={mediaType}
            />
          ))}
        </div>
      )} */}
    </div>
  );
}
