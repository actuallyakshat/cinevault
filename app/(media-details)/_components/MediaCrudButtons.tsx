import { Button } from "@/components/ui/button";
import { Heart, Loader, Popcorn } from "lucide-react";
import React, { useContext } from "react";
import ReviewMediaModal from "./ReviewMediaModal";
import { addToFavorites, addToWatchlist } from "../_actions/actions";
import { getGenreById } from "@/lib/functions";
import { AuthContext } from "@/providers/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import { getUserDetails } from "@/app/dashboard/_actions/actions";

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
  const { userDetails, setUserDetails } = useContext(AuthContext);
  const [userId, setUserId] = React.useState<string>("");
  const [favoritesLoading, setFavoritesLoading] =
    React.useState<boolean>(false);
  const [watchlistLoading, setWatchlistLoading] =
    React.useState<boolean>(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (userDetails) {
      setUserId(userDetails.id);
    }
  }, [userDetails]);

  const refreshUserDetails = async () => {
    const freshUserDetails = await getUserDetails({
      email: userDetails.email,
      name: userDetails.name,
    });
    setUserDetails(freshUserDetails);
  };

  const handleAddToWatchlist = async () => {
    setWatchlistLoading(true);
    try {
      console.log("loading");
      const allGenres = details.genres.map((genre: any) =>
        getGenreById(genre.id),
      );
      const payload = {
        id: "",
        tmdbId: details.id.toString() as string,
        title: title as string,
        mediaType: mediaType,
        posterUrl: details.poster_path as string,
        releaseYear:
          (details?.release_date?.split("-")[0] as string) ||
          (details?.first_air_date?.split("-")[0] as string),
        genres: allGenres as string[],
      };
      const response = await addToWatchlist(payload, userId);
      if (response.success) {
        toast({
          title: "Success",
          description: `${title} has been added to your watchlist`,
        });
        refreshUserDetails();
      } else {
        toast({
          title: "Error",
          description: `${response.message}`,
        });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    setWatchlistLoading(false);
  };

  const handleAddToFavorites = async () => {
    setFavoritesLoading(true);
    try {
      const allGenres = details.genres.map((genre: any) =>
        getGenreById(genre.id),
      );
      const payload = {
        id: "",
        tmdbId: details.id.toString() as string,
        title: title as string,
        mediaType: mediaType,
        posterUrl: details.poster_path as string,
        releaseYear:
          (details?.release_date?.split("-")[0] as string) ||
          (details?.first_air_date?.split("-")[0] as string),
        genres: allGenres as string[],
      };
      const response = await addToFavorites(payload, userId);
      if (response.success) {
        toast({
          title: "Success",
          description: `${title} has been added to your favorites`,
        });
        refreshUserDetails();
      } else {
        toast({
          title: "Error",
          description: `${response.message}`,
        });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    setFavoritesLoading(false);
  };

  return (
    <div className="mx-auto max-w-xl space-y-3 lg:mx-0">
      <div className="flex items-center gap-3">
        <Button
          className={buttonStyle}
          onClick={handleAddToWatchlist}
          disabled={watchlistLoading || favoritesLoading}
        >
          {watchlistLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              Add To Watchlist <Popcorn className="size-4" />
            </span>
          )}
        </Button>
        <Button
          className={buttonStyle}
          onClick={handleAddToFavorites}
          disabled={favoritesLoading || watchlistLoading}
        >
          {favoritesLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              Add To Favorites <Heart className="size-4" />
            </span>
          )}
        </Button>
      </div>
      <ReviewMediaModal
        title={title}
        details={details}
        mediaType={mediaType}
        refreshUserDetails={refreshUserDetails}
      />
    </div>
  );
}
