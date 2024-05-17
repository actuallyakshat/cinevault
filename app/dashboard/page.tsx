"use client";
import React, { useContext, useEffect } from "react";
import SelectMediaTypeButton from "./_components/SelectMediaTypeButton";
import { AuthContext } from "@/providers/auth-provider";
import LoadingScreen from "../_components/LoadingScreen";
import SelectList from "./_components/SelectList";
import WatchlistMedia from "./_components/WatchlistMedia";
import FavoriteMedia from "./_components/FavoriteMedia";
import WatchedMedia from "./_components/WatchedMedia";

export default function Dashboard() {
  const [mediaType, setMediaType] = React.useState<string>(
    localStorage.getItem("mediaType" || "Movies") as string,
  );
  const [selectedList, setSelectedList] = React.useState<string>(
    localStorage.getItem("selectedList") as string,
  );
  const { userDetails, loading } = useContext(AuthContext);
  const [mediaList, setMediaList] = React.useState([]);
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-12 lg:px-8">
      <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SelectList
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        />
        <SelectMediaTypeButton
          mediaType={mediaType}
          setMediaType={setMediaType}
        />
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
