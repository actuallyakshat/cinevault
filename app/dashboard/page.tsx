"use client";
import React, { useContext, useEffect, useState } from "react";
import SelectMediaTypeButton from "./_components/SelectMediaTypeButton";
import { AuthContext } from "@/providers/auth-provider";
import SelectList from "./_components/SelectList";
import WatchlistMedia from "./_components/WatchlistMedia";
import FavoriteMedia from "./_components/FavoriteMedia";
import WatchedMedia from "./_components/WatchedMedia";
import SortSelection from "./_components/SortSelection";
import GenreFilter from "./GenreFilter";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [availableGenres, setAvailableGenres] = useState<any[]>([]);
  const [sortCriterion, setSortCriterion] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [mediaType, setMediaType] = useState<string>(
    localStorage.getItem("mediaType") || "Movies",
  );
  const [selectedList, setSelectedList] = useState<string>(
    localStorage.getItem("selectedList") || "Watchlist",
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [filteredMediaList, setFilteredMediaList] = useState<any[]>([]);
  const [sortedList, setSortedList] = useState<any[]>([]);
  const [finalMediaList, setFinalMediaList] = useState<any[]>([]);
  const { userDetails } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Media assignment to specific lists and filtering by media type
  useEffect(() => {
    if (userDetails && selectedList && mediaType) {
      let selectedListData: any[] = [];

      if (selectedList === "Watchlist") {
        selectedListData = userDetails.watchlist;
      } else if (selectedList === "Favorites") {
        selectedListData = userDetails.favorites;
      } else if (selectedList === "Watched") {
        selectedListData = userDetails.watched;
      }
      const mediaTypeToExtract =
        mediaType.toLowerCase() === "movies" ? "movie" : "show";
      if (selectedList === "Watched") {
        const filteredList = selectedListData.filter(
          (media: any) =>
            media.media.mediaType.toLowerCase() === mediaTypeToExtract,
        );
        setMediaList(filteredList);
        return;
      }

      const filteredList = selectedListData.filter(
        (media: any) => media.mediaType.toLowerCase() === mediaTypeToExtract,
      );
      setMediaList(filteredList);
    }
  }, [userDetails, selectedList, mediaType]);

  // Filter media list based on selected genres
  useEffect(() => {
    let tempFilteredList = [...mediaList];
    if (selectedGenres.length > 0) {
      if (selectedList === "Watched") {
        tempFilteredList = mediaList.filter((media: any) =>
          media?.media?.genres?.some((genre: string) =>
            selectedGenres.includes(genre),
          ),
        );
      } else {
        tempFilteredList = mediaList.filter((media: any) =>
          media?.genres?.some((genre: string) =>
            selectedGenres.includes(genre),
          ),
        );
      }
    }
    setFilteredMediaList(tempFilteredList);
  }, [mediaList, selectedGenres, selectedList]);

  // Sort filtered media list
  const sortMediaList = () => {
    let tempSortedList = [...filteredMediaList];
    if (sortOrder === "none") {
      setSortedList(tempSortedList);
      return;
    }
    if (selectedList === "Watched") {
      if (sortCriterion === "name") {
        tempSortedList.sort((a: any, b: any) =>
          a?.media?.title.localeCompare(b?.media?.title),
        );
      } else if (sortCriterion === "releaseYear") {
        tempSortedList.sort(
          (a: any, b: any) => a?.media?.releaseYear - b?.media?.releaseYear,
        );
      } else if (sortCriterion === "rating") {
        tempSortedList.sort((a: any, b: any) => a.rating - b.rating);
      }
    } else {
      if (sortCriterion === "name") {
        tempSortedList.sort((a: any, b: any) => a.title.localeCompare(b.title));
      } else if (sortCriterion === "releaseYear") {
        tempSortedList.sort((a: any, b: any) => a.releaseYear - b.releaseYear);
      }
    }
    if (sortOrder === "desc") tempSortedList.reverse();
    setSortedList(tempSortedList);
  };

  useEffect(() => {
    sortMediaList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredMediaList, sortCriterion, sortOrder]);

  // Combine search logic with sorted list
  useEffect(() => {
    let tempFinalList = [...sortedList];
    if (searchQuery.length > 0) {
      if (selectedList === "Watched") {
        tempFinalList = sortedList.filter((media: any) =>
          media?.media?.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      } else {
        tempFinalList = sortedList.filter((media: any) =>
          media?.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }
    }
    setFinalMediaList(tempFinalList);
  }, [searchQuery, sortedList, selectedList]);

  useEffect(() => {
    if (selectedGenres.length > 0) {
      setSelectedGenres([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedList]);

  // Extract available genres
  useEffect(() => {
    if (mediaList.length > 0) {
      let allGenres;
      if (selectedList === "Watched") {
        allGenres = mediaList.flatMap((media: any) => media?.media?.genres);
      } else {
        allGenres = mediaList.flatMap((media: any) => media?.genres);
      }
      const uniqueGenresArray = Array.from(new Set(allGenres));
      setAvailableGenres(uniqueGenresArray);
    }
  }, [mediaList, selectedList]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genre)
        ? prevSelectedGenres.filter((g) => g !== genre)
        : [...prevSelectedGenres, genre],
    );
  };

  if (!userDetails) {
    return (
      <div className="mx-auto max-w-screen-2xl animate-pulse px-6 py-16 lg:px-8">
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
