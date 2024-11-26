import EditReviewModal from "@/app/dashboard/_components/EditReviewModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getGenreById } from "@/lib/functions";
import { AuthContext } from "@/providers/auth-provider";
import { Genre, TMDBMovieDetails, TMDBShowDetails } from "@/types/tmdb";
import { UserDetailsWithLists } from "@/types/user";
import { Heart, Loader, Popcorn } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import {
  addToFavorites,
  addToWatchlist,
  removeFromFavorites,
  removeFromWatchlist,
} from "../_actions/actions";
import ReviewMediaModal from "./ReviewMediaModal";
import RecommendToAFriendModal from "./RecommendToAFriendModal";
import { Media } from "@prisma/client";

export type MediaDetails = (TMDBMovieDetails | TMDBShowDetails) & {
  first_air_date?: string;
  release_date?: string;
  poster_path: string;
  genres: { id: number; name: string }[];
  title?: string;
  name?: string;
};

interface MediaCrudButtonsProps {
  title: string;
  details: MediaDetails | undefined;
  mediaType: string;
}

const buttonStyle =
  "w-full bg-white text-black hover:bg-white/80 flex items-center justify-center gap-2";

export default function MediaCrudButtons({
  title,
  details,
  mediaType,
}: MediaCrudButtonsProps) {
  const { userDetails, refreshUserDetails } = useContext(AuthContext);
  const [userId, setUserId] = React.useState<string>("");
  const [media, setMedia] = useState<Media>();

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

  useEffect(() => {
    if (details) {
      const mediaObject: Media = {
        id: String(details.id),
        tmdbId: String(details.id),
        title: details.title || details.name || "",
        posterUrl: details.poster_path,
        releaseYear:
          (details?.release_date?.split("-")[0] as string) ||
          (details?.first_air_date?.split("-")[0] as string),
        genres: details.genres.map((genre: Genre) => genre.name),
        mediaType: mediaType,
      };
      setMedia(mediaObject);
    }
  }, [details, mediaType]);

  if (!details) return null;

  const handleWatchlist = async (request: string) => {
    setWatchlistLoading(true);
    if (request == "add") {
      try {
        const allGenres = details.genres
          .map((genre: Genre) => getGenreById(genre.id))
          .filter(Boolean);

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
      } catch (error) {
        console.error(error);
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
        console.error(error);
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
        const allGenres = details.genres.map((genre: Genre) =>
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
      } catch (error) {
        console.error(error);
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
        console.error(error);
      }
    }
    setFavoritesLoading(false);
  };

  const { isInWatchlist, isInFavorites, isInWatchedList } = isPresentInUser(
    userDetails,
    details,
  );

  if (!userDetails)
    return (
      <div className="mx-auto max-w-xl animate-pulse space-y-3 lg:mx-0">
        <div className="flex max-w-xl items-center gap-3">
          <div className="h-11 w-full rounded-lg bg-muted"></div>
          <div className="h-11 w-full rounded-lg bg-muted"></div>
        </div>
        <div className="h-11 w-full  rounded-lg bg-muted"></div>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl space-y-3 lg:mx-0">
      <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2">
        <Button
          className={`${buttonStyle} col-span-1`}
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
          className={`${buttonStyle} col-span-1`}
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
      <div className="relative grid grid-cols-1 gap-3 md:grid-cols-2">
        {isInWatchedList ? (
          <EditReviewModal styles="MediaCrudButton" details={isInWatchedList} />
        ) : (
          <ReviewMediaModal
            title={title}
            details={details}
            mediaType={mediaType}
            refreshUserDetails={refreshUserDetails}
          />
        )}

        <RecommendToAFriendModal
          mediaTitle={title}
          mediaId={String(details.id)}
          media={media}
        />
      </div>
    </div>
  );
}

function isPresentInUser(
  userDetails: UserDetailsWithLists | undefined,
  details: MediaDetails,
) {
  const isInWatchlist = userDetails?.watchlist?.some(
    (item) => String(item.tmdbId) == String(details.id),
  );
  const isInFavorites = userDetails?.favorites?.some(
    (item) => String(item.tmdbId) == String(details.id),
  );
  const isInWatchedList = userDetails?.watched?.find(
    (item) => String(item.media.tmdbId) == String(details.id),
  );

  return { isInWatchlist, isInFavorites, isInWatchedList };
}
