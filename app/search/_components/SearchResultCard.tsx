import { formatMovieDate, formatShowDate, getGenreById } from "@/lib/functions";
import { TMDBMovieSearchQuery, TMDBShowSearchQuery } from "@/types/tmdb";
import Image from "next/image";
import { useRouter } from "next/navigation";

const imagePrefix = "https://image.tmdb.org/t/p/w500";

export default function SearchResultCard({
  result,
  mediaType,
}: {
  result: TMDBMovieSearchQuery | TMDBShowSearchQuery;
  mediaType: "Movies" | "Shows";
}) {
  const router = useRouter();

  if (!result.poster_path || !result.overview) return null;

  const title =
    mediaType === "Movies"
      ? (result as TMDBMovieSearchQuery).title
      : (result as TMDBShowSearchQuery).name;

  const date =
    mediaType === "Movies"
      ? (result as TMDBMovieSearchQuery).release_date
      : (result as TMDBShowSearchQuery).first_air_date;

  return (
    <div
      onClick={() => {
        router.push(
          `/${mediaType === "Movies" ? "movie" : "show"}/${result.id}`,
        );
      }}
      className="mx-auto grid w-full max-w-[960px] cursor-pointer grid-cols-4 gap-5"
    >
      <Image
        loading="lazy"
        src={imagePrefix + result.poster_path}
        alt={title}
        width={500}
        height={500}
        className="col-span-1 hidden w-full max-w-[300px] rounded-lg object-cover lg:block"
      />
      <div className="col-span-4 lg:col-span-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-3xl font-bold">{title}</h3>
          <p className="font-medium text-muted-foreground">
            {mediaType === "Movies"
              ? formatMovieDate(date)
              : formatShowDate(date)}
          </p>
        </div>
        <div className="mt-1">
          {result.genre_ids.map((genreId: number) => {
            const genreName = getGenreById(genreId);
            return (
              genreName && (
                <span
                  key={genreId}
                  className="mr-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground"
                >
                  {genreName}
                </span>
              )
            );
          })}
        </div>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {result.overview}
        </p>
      </div>
    </div>
  );
}
