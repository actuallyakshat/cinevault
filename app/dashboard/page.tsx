"use client";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/providers/auth-provider";
import { WatchedWithMedia } from "@/types/user";
import { useClerk } from "@clerk/nextjs";
import { Media } from "@prisma/client";
import { useContext, useEffect, useMemo, useState } from "react";
import FavoriteMedia from "./_components/FavoriteMedia";
import SelectList from "./_components/SelectList";
import SelectMediaTypeButton from "./_components/SelectMediaTypeButton";
import SortSelection from "./_components/SortSelection";
import WatchedMedia from "./_components/WatchedMedia";
import WatchlistMedia from "./_components/WatchlistMedia";
import GenreFilter from "./GenreFilter";

type ListType = "Watchlist" | "Favorites" | "Watched";
type MediaType = "Movies" | "Shows";

export default function Dashboard() {
  const { userDetails, loading } = useContext(AuthContext);
  const { user } = useClerk();
  const [mediaType, setMediaType] = useState<MediaType>(
    (localStorage.getItem("mediaType") as MediaType) || "Movies",
  );
  const [selectedList, setSelectedList] = useState<ListType>(
    (localStorage.getItem("selectedList") as ListType) || "Watchlist",
  );

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortCriterion, setSortCriterion] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

  const processedMediaList = useMemo(() => {
    if (!userDetails || loading) return [];

    const getSelectedListData = (): Media[] | WatchedWithMedia[] => {
      switch (selectedList) {
        case "Watchlist":
          return userDetails.watchlist || [];
        case "Favorites":
          return userDetails.favorites || [];
        case "Watched":
          return userDetails.watched || [];
        default:
          return [];
      }
    };

    const selectedListData = getSelectedListData();
    const mediaTypeToExtract =
      mediaType.toLowerCase() === "movies" ? "movie" : "show";

    return selectedListData.filter((item) => {
      const itemMediaType =
        selectedList === "Watched"
          ? (item as WatchedWithMedia).media?.mediaType?.toLowerCase()
          : (item as Media).mediaType?.toLowerCase();

      return itemMediaType === mediaTypeToExtract;
    });
  }, [userDetails, selectedList, mediaType, loading]);

  // Genre filtering
  const filteredMediaList = useMemo(() => {
    if (selectedGenres.length === 0) return processedMediaList;

    return processedMediaList.filter((media) => {
      const genres =
        selectedList === "Watched"
          ? (media as WatchedWithMedia).media?.genres
          : (media as Media).genres;

      return genres?.some((genre) => selectedGenres.includes(genre));
    });
  }, [processedMediaList, selectedGenres, selectedList]);

  // Sorting logic
  const sortedMediaList = useMemo(() => {
    if (sortOrder === "none") return filteredMediaList;

    const sortedList = [...filteredMediaList].sort((a, b) => {
      let valueA: any, valueB: any;
      let comparisonType = "";

      // Handle different sorting scenarios for Watched and other lists
      if (selectedList === "Watched") {
        const mediaA = a as WatchedWithMedia;
        const mediaB = b as WatchedWithMedia;

        switch (sortCriterion) {
          case "name":
            valueA = mediaA.media?.title;
            valueB = mediaB.media?.title;
            comparisonType = "Watched Name";
            return (
              valueA?.localeCompare(valueB || "") *
              (sortOrder === "desc" ? -1 : 1)
            );

          case "releaseYear":
            valueA = mediaA.media?.releaseYear;
            valueB = mediaB.media?.releaseYear;
            comparisonType = "Watched Release Year";
            return (
              ((valueA || 0) - (valueB || 0)) * (sortOrder === "desc" ? -1 : 1)
            );

          case "rating":
            valueA = mediaA.rating;
            valueB = mediaB.rating;
            comparisonType = "Watched Rating";
            return (
              ((valueA || 0) - (valueB || 0)) * (sortOrder === "desc" ? -1 : 1)
            );

          default:
            return 0;
        }
      } else {
        const mediaA = a as Media;
        const mediaB = b as Media;

        switch (sortCriterion) {
          case "name":
            valueA = mediaA.title;
            valueB = mediaB.title;
            comparisonType = "Name";
            return (
              valueA?.localeCompare(valueB || "") *
              (sortOrder === "desc" ? -1 : 1)
            );

          case "releaseYear":
            valueA = Number(mediaA.releaseYear) || 0;
            valueB = Number(mediaB.releaseYear) || 0;
            comparisonType = "Release Year";
            return (valueA - valueB) * (sortOrder === "desc" ? -1 : 1);

          default:
            return 0;
        }
      }
    });

    return sortedList;
  }, [filteredMediaList, sortCriterion, sortOrder, selectedList]);

  // Final list with search filtering
  const finalMediaList = useMemo(() => {
    if (!searchQuery) return sortedMediaList;

    return sortedMediaList.filter((media) => {
      const title =
        selectedList === "Watched"
          ? (media as WatchedWithMedia).media?.title
          : (media as Media).title;

      return title?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [sortedMediaList, searchQuery, selectedList]);

  // Available genres extraction
  const availableGenres = useMemo(() => {
    const allGenres = processedMediaList.flatMap((media) =>
      selectedList === "Watched"
        ? (media as WatchedWithMedia).media?.genres || []
        : (media as Media).genres || [],
    );
    return Array.from(new Set(allGenres));
  }, [processedMediaList, selectedList]);

  // Genre change handler
  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  // Reset genres when list changes
  useEffect(() => {
    setSelectedGenres([]);
  }, [selectedList]);

  // Persist media type and list selection
  useEffect(() => {
    localStorage.setItem("mediaType", mediaType);
    localStorage.setItem("selectedList", selectedList);
  }, [mediaType, selectedList]);

  // Loading state
  if (!userDetails) {
    return (
      <div className="mx-auto max-w-screen-2xl animate-pulse px-6 py-12 lg:px-8">
        <div className="h-10 w-[200px] rounded-lg bg-muted sm:max-w-[350px]"></div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-[180px] rounded-lg bg-muted"></div>
              <div className="h-10 w-[180px] rounded-lg bg-muted"></div>
            </div>
            <div className="h-10 w-full rounded-lg bg-muted sm:w-[180px]"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-[80px] rounded-lg bg-muted"></div>
            <div className="h-10 w-[130px] rounded-lg bg-muted"></div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="col-span-1 h-[400px] w-full rounded-lg bg-muted"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-12 lg:px-8">
      <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 md:flex-nowrap">
        <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:flex-nowrap sm:justify-start">
          <div className="flex w-full items-center gap-3 sm:w-fit">
            <SelectList
              selectedList={selectedList}
              setSelectedList={setSelectedList}
            />
            <SelectMediaTypeButton
              mediaType={mediaType}
              setMediaType={setMediaType}
            />
          </div>

          <Input
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[180px]"
          />
        </div>
        <div className="flex items-center gap-3 sm:w-fit">
          <SortSelection
            sortCriterion={sortCriterion}
            setSortCriterion={setSortCriterion}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            selectedList={selectedList}
          />
          <GenreFilter
            uniqueGenres={availableGenres}
            selectedGenres={selectedGenres}
            handleGenreChange={handleGenreChange}
          />
        </div>
      </div>
      <div className="mt-6">
        {selectedList === "Watchlist" && (
          <WatchlistMedia mediaList={finalMediaList} mediaType={mediaType} />
        )}
        {selectedList === "Favorites" && (
          <FavoriteMedia mediaList={finalMediaList} mediaType={mediaType} />
        )}
        {selectedList === "Watched" && (
          <WatchedMedia mediaList={finalMediaList} mediaType={mediaType} />
        )}
      </div>
    </div>
  );
}
