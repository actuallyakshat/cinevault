import { Button } from "@/components/ui/button";
import { Heart, Loader, Popcorn } from "lucide-react";
import React, { useContext, useEffect } from "react";
import ReviewMediaModal from "./ReviewMediaModal";
import {
  addToFavorites,
  addToWatchlist,
  removeFromFavorites,
  removeFromWatchlist,
} from "../_actions/actions";
import { getGenreById } from "@/lib/functions";
import { AuthContext } from "@/providers/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import { getUserDetails } from "@/app/dashboard/_actions/actions";
import EditReviewModal from "@/app/dashboard/_components/EditReviewModal";

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

  useEffect(() => {
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

  const handleWatchlist = async (request: string) => {
    setWatchlistLoading(true);
    if (request == "add") {
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
          await refreshUserDetails();
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
    } else if (request == "remove") {
      try {
        const response = await removeFromWatchlist(
          details.id.toString(),
          userId,
        );
        if (response.success) {
          toast({
            title: "Success",
            description: `${title} has been removed from your watchlist`,
          });
          await refreshUserDetails();
        } else {
          toast({
            title: "Error",
            description: `${response.message}`,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: `${error}`,
        });
        console.log(error);
      }
    } else {
      toast({
        title: "Error",
        description: `Something went wrong`,
      });
    }
    setWatchlistLoading(false);
  };

  const handleFavoriteList = async (request: string) => {
    setFavoritesLoading(true);
    if (request == "add") {
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
          await refreshUserDetails();
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
    } else if (request == "remove") {
      try {
        const response = await removeFromFavorites(
          details.id.toString(),
          userId,
        );
        if (response.success) {
          toast({
            title: "Success",
            description: `${title} has been removed from your favorites`,
          });
          await refreshUserDetails();
        } else {
          toast({
            title: "Error",
            description: `${response.message}`,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: `${error}`,
        });
        console.log(error);
      }
    }
    setFavoritesLoading(false);
  };

  const isInWatchlist = userDetails?.watchlist?.some(
    (item: any) => item.tmdbId == details.id,
  );
  const isInFavorites = userDetails?.favorites?.some(
    (item: any) => item.tmdbId == details.id,
  );

  const isInWatchedList = userDetails?.watched?.find(
    (item: any) => item.media.tmdbId == details.id,
  );

  console.log("isInWatchedList", isInWatchedList);

  if (!userDetails)
    return (
      <div className="mx-auto max-w-xl animate-pulse space-y-3 lg:mx-0">
        <div className="flex max-w-xl items-center gap-3">
          <div className="h-11 w-full rounded-lg bg-gray-300"></div>
          <div className="h-11 w-full rounded-lg bg-gray-300"></div>
        </div>
        <div className="h-11 w-full  rounded-lg bg-gray-300"></div>
      </div>
    );

  return (
    <div className="mx-auto max-w-xl space-y-3 lg:mx-0">
      <div className="flex items-center gap-3">
        <Button
          className={buttonStyle}
          onClick={() => handleWatchlist(isInWatchlist ? "remove" : "add")}
          disabled={watchlistLoading}
        >
          {watchlistLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              {isInWatchlist ? "Remove from Watchlist" : "Add To Watchlist"}{" "}
              <Popcorn className="size-4" />
            </span>
          )}
        </Button>
        <Button
          className={buttonStyle}
          onClick={() => handleFavoriteList(isInFavorites ? "remove" : "add")}
          disabled={favoritesLoading}
        >
          {favoritesLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              {isInFavorites ? "Remove from Favorites" : "Add To Favorites"}{" "}
              <Heart className="size-4" />
            </span>
          )}
        </Button>
      </div>
      <div className="relative w-full">
        {isInWatchedList ? (
          <div className="pb-10">
            <EditReviewModal details={isInWatchedList} />
          </div>
        ) : (
          <ReviewMediaModal
            title={title}
            details={details}
            mediaType={mediaType}
            refreshUserDetails={refreshUserDetails}
          />
        )}
      </div>
    </div>
  );
}
