import { Button } from "@/components/ui/button";
import { Heart, Popcorn } from "lucide-react";
import React from "react";
import ReviewMediaModal from "./ReviewMediaModal";
import { addToFavorites, addToWatchlist } from "../_actions/actions";
import { getGenreById } from "@/lib/functions";

export default function MediaCrudButtons({
  title,
  details,
  mediaType,
}: {
  title: string;
  details: any;
  mediaType: string;
}) {
  const buttonStyle =
    "w-full bg-white text-black hover:bg-white/80 flex items-center justify-center gap-2";
  const userId = "45f50a5c-863a-4876-8537-ecc33d35f337";

  const handleAddToWatchlist = async () => {
    try {
      console.log("loading");
      const allGenres = details.genres.map((genre: any) =>
        getGenreById(genre.id),
      );
      const payload = {
        id: "",
        tmdbId: details.id.toString() as string,
        title: title as string,
        mediaType: "MOVIE",
        posterUrl: details.poster_path as string,
        releaseYear:
          (details?.release_date?.split("-")[0] as string) ||
          (details?.first_air_date?.split("-")[0] as string),
        genres: allGenres as string[],
      };
      const response = await addToWatchlist(payload, userId);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      console.log("loading");
      const allGenres = details.genres.map((genre: any) =>
        getGenreById(genre.id),
      );
      const payload = {
        id: "",
        tmdbId: details.id.toString() as string,
        title: title as string,
        mediaType: "MOVIE",
        posterUrl: details.poster_path as string,
        releaseYear:
          (details?.release_date?.split("-")[0] as string) ||
          (details?.first_air_date?.split("-")[0] as string),
        genres: allGenres as string[],
      };
      const response = await addToFavorites(payload, userId);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-3 lg:mx-0">
      <div className="flex items-center gap-3">
        <Button className={buttonStyle} onClick={handleAddToWatchlist}>
          Add To Watchlist <Popcorn className="size-4" />
        </Button>
        <Button className={buttonStyle} onClick={handleAddToFavorites}>
          Add To Favorites <Heart className="size-4" />
        </Button>
      </div>
      <ReviewMediaModal title={title} details={details} mediaType={mediaType} />
    </div>
  );
}
