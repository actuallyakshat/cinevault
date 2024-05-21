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

export default function Dashboard() {
  const [availableGenres, setAvailableGenres] = React.useState<any>([]);

  const [sortCriterion, setSortCriterion] = useState(""); // 'name', 'releaseYear', or ''
  const [sortOrder, setSortOrder] = useState("none");

  const [mediaType, setMediaType] = React.useState<string>(
    localStorage.getItem("mediaType") || "Movies",
  );
  const [selectedList, setSelectedList] = React.useState<string>(
    localStorage.getItem("selectedList") || "Watchlist",
  );
  const { userDetails } = useContext(AuthContext);
  const [mediaList, setMediaList] = React.useState([]);

  //Media assignment to specific lists
  useEffect(() => {
    if (userDetails) {
      if (selectedList == "Watchlist") {
        setMediaList(userDetails.watchlist);
      } else if (selectedList == "Favorites") {
        setMediaList(userDetails.favorites);
      } else if (selectedList == "Watched") {
        setMediaList(userDetails.watched);
      }
    }
  }, [userDetails, selectedList]);

  //Sorting logic
  const sortMediaList = () => {
    let sortedList = [...mediaList];

    if (sortCriterion === "name") {
      sortedList.sort((a: any, b: any) => a.title.localeCompare(b.title));
      if (sortOrder === "desc") sortedList.reverse();
    } else if (sortCriterion === "releaseYear") {
      sortedList.sort((a: any, b: any) => a.releaseYear - b.releaseYear);
      if (sortOrder === "desc") sortedList.reverse();
    }

    if (sortOrder === "none") {
      sortedList = [...mediaList]; // Reset to initial order if sortOrder is 'none'
    }

    setMediaList(sortedList);
  };

  useEffect(() => {
    sortMediaList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortCriterion, sortOrder]);

  useEffect(() => {
    if (mediaList) {
      const allGenres = mediaList.flatMap((media: any) => media.genres);
      const uniqueGenresArray = Array.from(new Set(allGenres));
      setAvailableGenres(uniqueGenresArray);
      console.log(mediaList);
    }
  }, [mediaList]);

  if (!userDetails) {
    return (
      <div className="mx-auto max-w-screen-2xl animate-pulse px-6 py-16 lg:px-8">
        <div className="h-10 max-w-[350px] rounded-lg bg-muted"></div>
        <div className="mt-4 flex gap-4">
          <div className="h-10 w-[180px] rounded-lg bg-muted"></div>
          <div className="h-10 w-[180px] rounded-lg bg-muted"></div>
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
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <SelectList
            selectedList={selectedList}
            setSelectedList={setSelectedList}
          />
          <SelectMediaTypeButton
            mediaType={mediaType}
            setMediaType={setMediaType}
          />
        </div>
        {selectedList !== "Watched" && (
          <div className="flex items-center gap-3">
            <SortSelection
              sortCriterion={sortCriterion}
              setSortCriterion={setSortCriterion}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <GenreFilter />
          </div>
        )}
      </div>
      <div className="mt-6">
        {selectedList == "Watchlist" && (
          <WatchlistMedia mediaList={mediaList} mediaType={mediaType} />
        )}
        {selectedList == "Favorites" && (
          <FavoriteMedia mediaList={mediaList} mediaType={mediaType} />
        )}
        {selectedList == "Watched" && (
          <WatchedMedia mediaList={mediaList} mediaType={mediaType} />
        )}
      </div>
    </div>
  );
}
