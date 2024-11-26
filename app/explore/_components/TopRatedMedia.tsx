"use client";
import React, { useEffect } from "react";
import { getTopRatedMedia } from "../_actions/actions";
import ExploreMediaCard from "./ExploreMediaCard";
import PaginationComponent from "./Pagination";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import { FeaturedByTMDB } from "@/types/tmdb";
export default function TopRatedMedia({ mediaType }: { mediaType: string }) {
  const [topMedia, setTopMedia] = React.useState<FeaturedByTMDB[]>([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    async function handleGetTopRatedMedia() {
      if (!mediaType) return;
      const media = mediaType == "Movies" ? "movie" : "tv";
      setLoading(true);
      try {
        const response = await getTopRatedMedia({
          mediaType: media,
          pageNumber,
        });
        if (response && response.results) {
          setTopMedia(response.results);
        }
      } catch (error) {
        console.error("Failed to fetch top rated media:", error);
      } finally {
        setLoading(false);
      }
    }
    handleGetTopRatedMedia();
  }, [mediaType, pageNumber]);

  if (loading)
    return (
      <div className="mt-16">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="flex flex-col items-center">
      <div className="mx-auto mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {!loading &&
          topMedia.map((media) => (
            <ExploreMediaCard
              mediaType={mediaType}
              key={media.id}
              media={media}
            />
          ))}
      </div>
      <div className="mt-8 flex justify-center">
        <PaginationComponent
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </div>
    </div>
  );
}
