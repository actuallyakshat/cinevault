"use client";

import { searchMedia } from "@/app/dashboard/_actions/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { isMovie } from "@/types/guards";
import { TMDBMovieSearchQuery, TMDBShowSearchQuery } from "@/types/tmdb";
import { debounce } from "lodash";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import SearchResultCard from "./SearchResultCard";
import { addMediaToMovieBoard } from "../_actions/action";
import { getGenreById } from "@/lib/functions";
import { toast, useToast } from "@/components/ui/use-toast";

export default function AddMediaSearch({ boardId }: { boardId: string }) {
  const [open, setOpen] = useState(false);
  const [mediaType, setMediaType] = useState<"Movies" | "Shows">("Movies");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMovieSearchQuery[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [addMediaLoading, setAddMediaLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const debouncedSearch = debounce(async () => {
      if (!searchQuery) {
        setSearchResults([]);
        setLoading(false);
        return;
      }
      const results = await searchMedia(
        searchQuery,
        mediaType === "Movies" ? "movie" : "tv",
      );
      setSearchResults(results);
      setLoading(false);
    }, 300);
    debouncedSearch();
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, mediaType]);

  async function onAddHandler(
    result: TMDBMovieSearchQuery | TMDBShowSearchQuery,
  ) {
    setAddMediaLoading(true);
    try {
      const response = await addMediaToMovieBoard({
        tmdbId: String(result.id),
        title: isMovie(result) ? result.title : result.name,
        posterUrl: result.poster_path,
        releaseYear: isMovie(result)
          ? result.release_date
          : result.first_air_date,
        genres: isMovie(result)
          ? result.genre_ids.map((id) => getGenreById(id))
          : [],
        mediaType: mediaType,
        movieBoardId: boardId,
      });

      if (response.success) {
        console.log(
          `Added ${isMovie(result) ? result.title : result.name} to movieboard`,
        );
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      console.log("Something went wrong");
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setAddMediaLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Add Media</Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] max-w-4xl overflow-hidden p-0 md:h-[85vh]">
        <div className="noscrollbar flex h-full flex-col overflow-y-scroll">
          <div className="border-b p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">Add Media</DialogTitle>
              <DialogDescription className="text-base">
                Search for a movie or a show and add it to your movieboard
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search for a movie or show..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12"
                />
                {loading && (
                  <div className="absolute right-3 top-2.5">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  setMediaType(mediaType === "Movies" ? "Shows" : "Movies")
                }
                className="min-w-[100px]"
              >
                {mediaType}
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "noscrollbar flex-1 overflow-y-auto p-6",
              loading && "opacity-50",
            )}
          >
            {!searchQuery && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">
                  Start typing to search for {mediaType.toLowerCase()}
                </p>
              </div>
            )}

            {searchQuery && !loading && searchResults?.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No results found for &quot;{searchQuery}&quot;
                </p>
              </div>
            )}

            <div className="space-y-6">
              {searchResults?.map(
                (result: TMDBMovieSearchQuery | TMDBShowSearchQuery) => (
                  <SearchResultCard
                    loading={addMediaLoading}
                    key={result.id}
                    result={result}
                    mediaType={mediaType}
                    onAdd={() => {
                      onAddHandler(result);
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
