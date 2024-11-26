"use client";

import React, { useEffect, useState } from "react";
import { getMediaDetails, getTrailer } from "../../_actions/actions";
import Image from "next/image";
import {
  formatMovieDate,
  getGenreById,
  getRuntimeFromMinutes,
} from "@/lib/functions";
import LoadingScreen from "@/app/_components/LoadingScreen";
import MediaCrudButtons from "../../_components/MediaCrudButtons";
import { Button } from "@/components/ui/button";
import { MonitorPlay } from "lucide-react";
import TrailerFrame from "../../_components/TrailerFrame";
import { TMDBMovieDetails } from "@/types/tmdb";

export default function Movie({ params }: { params: { id: string } }) {
  const imagePrefix = "https://image.tmdb.org/t/p/w500";
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<TMDBMovieDetails | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [trailerFrame, setTrailerFrame] = useState(false);
  const { id } = params;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [response, trailerResponse] = await Promise.all([
          getMediaDetails({ mediaType: "movie", mediaId: id }),
          getTrailer({ mediaId: id, mediaType: "movie" }),
        ]);

        setDetails(response);
        const filteredTrailer = trailerResponse?.results?.find(
          (result: any) => result.type === "Trailer",
        );

        setTrailer(filteredTrailer ? filteredTrailer.key : null);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <LoadingScreen />;

  if (!details)
    return (
      <div>
        <h1 className="pt-16 text-center text-3xl font-bold text-foreground/80">
          Movie Not Found
        </h1>
        <p className="text-center font-medium text-foreground/50">
          The movie you are looking for does not exist.
        </p>
      </div>
    );

  const movieBackdrop = `${imagePrefix}${details?.backdrop_path}`;

  return (
    <div className="-mt-16 min-h-screen pb-16 text-white">
      <div
        className="fixed inset-0 z-[-2] scale-110 overflow-y-auto bg-cover bg-center bg-no-repeat blur-md"
        style={{
          backgroundImage: movieBackdrop ? `url(${movieBackdrop})` : "none",
        }}
      />
      <div className="fixed inset-0 z-[-1] scale-110 bg-gradient-to-t from-black/100 via-black/40 to-black/10"></div>
      <div className="container grid w-full grid-cols-1 pt-28 lg:grid-cols-4 lg:gap-6">
        <div className="col-span-1 mb-8 flex w-full flex-col items-center justify-center">
          <Image
            loading="lazy"
            src={imagePrefix + details?.poster_path}
            alt={details?.title}
            width={500}
            height={500}
            className="mx-auto aspect-auto min-h-[400px] w-[300px] rounded-lg object-cover shadow-2xl shadow-black/70"
          />
          {trailer && (
            <Button
              className="mt-4 flex w-full max-w-sm items-center justify-center gap-3 bg-yellow-500 text-black hover:bg-yellow-600"
              onClick={() => setTrailerFrame(true)}
            >
              Watch Trailer <MonitorPlay className="size-5" />
            </Button>
          )}
          {trailerFrame && (
            <TrailerFrame
              video_key={trailer || ""}
              onClose={() => setTrailerFrame(false)}
            />
          )}
        </div>

        <div className="col-span-3">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <div className="max-w-3xl text-5xl font-black">
              {details?.title}
            </div>
            <p className="font-medium text-white/80">
              {formatMovieDate(details?.release_date)}
            </p>
          </div>
          <div className="my-2 font-semibold text-white/80">
            {details?.tagline}
          </div>
          <div className="mb-2 mt-1">
            {details?.genres?.map((genreId: { id: number; name: string }) => {
              const genreName = getGenreById(genreId.id);
              if (!genreName) return null;
              return (
                <span
                  key={genreId.id}
                  className="mr-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {genreName}
                </span>
              );
            })}
          </div>

          <div className="mb-3 mt-1 flex items-center gap-3 font-medium text-white/80">
            <div>Rating: {(details?.vote_average).toFixed(2)}/10</div>
            {details.runtime && (
              <div>Runtime: {getRuntimeFromMinutes(details.runtime)}</div>
            )}
          </div>
          <p className="max-w-2xl text-lg">{details?.overview}</p>
          <div className="mt-8 w-full">
            <MediaCrudButtons
              title={details?.title}
              details={details}
              mediaType="movie"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
