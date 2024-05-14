"use client";
import React, { useEffect } from "react";
import { getMediaDetails } from "../../_actions/actions";
import Image from "next/image";
import {
  formatMovieDate,
  formatShowDate,
  getGenreById,
  getRuntimeFromMinutes,
} from "@/lib/functions";
import LoadingScreen from "@/app/_components/LoadingScreen";
import MediaCrudButtons from "../../_components/MediaCrudButtons";
export default function Show({ params }: { params: { id: string } }) {
  const imagePrefix = "http://image.tmdb.org/t/p/w500";
  const [loading, setLoading] = React.useState(true);
  const [details, setDetails] = React.useState<any>(null);
  const { id } = params;
  const movieBackdrop = `${imagePrefix}${details?.backdrop_path}`;
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await getMediaDetails({
        mediaType: "tv",
        mediaId: id,
      });
      setDetails(response);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!loading && !details)
    return (
      <div>
        <h1 className="pt-16 text-center text-3xl font-bold text-foreground/80">
          Show Not Found
        </h1>
        <p className="text-center font-medium text-foreground/50">
          The show you are looking for does not exist.
        </p>
      </div>
    );
  return (
    <div className="-mt-16 min-h-screen pb-16 text-white">
      <div
        className="fixed inset-0 z-[-2] scale-110 overflow-y-auto bg-cover bg-center bg-no-repeat blur-lg"
        style={{
          backgroundImage: movieBackdrop ? `url(${movieBackdrop})` : "none",
        }}
      />
      <div className="fixed inset-0 z-[-1] scale-110 bg-gradient-to-t from-black/100 via-black/40 to-black/10 backdrop-blur-lg"></div>
      <div className="container grid w-full grid-cols-1 pt-28 lg:grid-cols-4 lg:gap-6">
        <div className="col-span-1 mb-8 flex w-full items-center justify-center">
          <Image
            src={imagePrefix + details?.poster_path}
            alt={details?.name}
            width={500}
            height={500}
            className="mx-auto aspect-auto min-h-[400px] w-[300px] rounded-lg object-cover shadow-2xl shadow-black/70"
          />
        </div>

        <div className="col-span-3">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <div className="max-w-3xl text-5xl font-black">{details?.name}</div>
            <p className="font-medium text-white/80">
              {formatShowDate(details?.first_air_date)}
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
            <MediaCrudButtons title={details?.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
