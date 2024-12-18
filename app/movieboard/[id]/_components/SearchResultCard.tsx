import React from "react";
import { TMDBMovieSearchQuery, TMDBShowSearchQuery } from "@/types/tmdb";
import { Button } from "@/components/ui/button";
import { isMovie } from "@/types/guards";
import Image from "next/image";

interface SearchResultCardProps {
  result: TMDBMovieSearchQuery | TMDBShowSearchQuery;
  mediaType: "Movies" | "Shows";
  onAdd?: () => void;
  loading: boolean;
}

export default function SearchResultCard({
  result,
  loading,
  mediaType,
  onAdd,
}: SearchResultCardProps) {
  const title = isMovie(result) ? result.title : result.name;
  const releaseDate = isMovie(result)
    ? result.release_date
    : result.first_air_date;

  return (
    <div className="flex w-full max-w-[960px] gap-8">
      <div className="hidden h-[350px] w-[270px] lg:block">
        {result.poster_path && (
          <Image
            src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
            alt={title}
            width={1080}
            height={1080}
            className="h-full w-full rounded-lg object-cover"
          />
        )}
      </div>
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p>{new Date(releaseDate).getFullYear()}</p>
        </div>
        <p className="text-sm text-muted-foreground">{result.overview}</p>
        {onAdd && (
          <Button onClick={onAdd} className="self-start" disabled={loading}>
            Add to Movieboard
          </Button>
        )}
      </div>
    </div>
  );
}
