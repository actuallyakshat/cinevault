"use client";
import React, { useEffect } from "react";
import { getMediaDetails } from "../../_actions/actions";
import Image from "next/image";
import {
  formatMovieDate,
  getGenreById,
  getRuntimeFromMinutes,
} from "@/lib/functions";
import LoadingScreen from "@/app/_components/LoadingScreen";
import MediaCrudButtons from "../../_components/MediaCrudButtons";
export default function Movie({ params }: { params: { id: string } }) {
  const imagePrefix = "http://image.tmdb.org/t/p/w500";
  const [loading, setLoading] = React.useState(true);
  const [details, setDetails] = React.useState<any>(null);
  const { id } = params;
  const movieBackdrop = `${imagePrefix}${details?.backdrop_path}`;
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await getMediaDetails({
        mediaType: "movie",
        mediaId: id,
      });
      setDetails(response);
      console.log(response);
      console.log(imagePrefix + response?.poster_path);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  console.log(id);
  if (loading) return <LoadingScreen />;
  return (
    <div className="-mt-16 min-h-screen text-white">
      <div
        className="fixed inset-0 z-[-2] scale-110 overflow-y-auto bg-cover bg-center bg-no-repeat blur-lg"
        style={{
          backgroundImage: movieBackdrop ? `url(${movieBackdrop})` : "none",
        }}
      />
      <div className="fixed inset-0 z-[-1] scale-110 bg-black/40 backdrop-blur-lg"></div>
      <div className="container grid grid-cols-4 items-start gap-6 pt-28">
        <Image
          src={imagePrefix + details?.poster_path}
          alt={details?.title}
          width={500}
          height={500}
          className="col-span-1 aspect-auto rounded-lg object-cover"
        />
        <div className="col-span-3">
          <div className="flex items-center justify-between">
            <div className="max-w-3xl text-5xl font-black">
              {details?.title}
            </div>
            <div className="font-medium text-white/80">
              {formatMovieDate(details?.release_date)}
            </div>
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
          <div className="mt-8">
            <MediaCrudButtons title={details?.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
