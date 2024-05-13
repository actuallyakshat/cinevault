import { formatMovieDate, formatShowDate, getGenreById } from "@/lib/functions";
import Image from "next/image";
import React from "react";

export default function SearchResultCard({ result }: { result: any }) {
  const imagePrefix = "https://image.tmdb.org/t/p/w500";

  return (
    <>
      {result.poster_path && (
        <div
          onClick={() => {
            console.log(result);
          }}
          className="mx-auto my-3 grid w-full max-w-[960px] cursor-pointer grid-cols-4 gap-5"
          key={result.id}
        >
          <Image
            src={imagePrefix + result.poster_path}
            alt={result.title}
            width={500}
            height={500}
            className="col-span-1 w-full max-w-[300px] rounded-lg object-cover"
          />
          <div className="col-span-3">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {result.title || result.name}
              </div>
              <div className="font-medium text-muted-foreground">
                {result.release_date
                  ? formatMovieDate(result.release_date)
                  : formatShowDate(result.first_air_date)}
              </div>
            </div>
            <div className="mt-1">
              {result.genre_ids.map((genreId: number) => {
                const genreName = getGenreById(genreId);
                if (!genreName) return null;
                return (
                  <span
                    key={genreId}
                    className="mr-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {genreName}
                  </span>
                );
              })}
            </div>
            <div className="mt-2 max-w-xl text-sm text-muted-foreground">
              {result.overview}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
