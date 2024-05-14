"use client";
import React, { useEffect } from "react";
import ExploreMediaCard from "./ExploreMediaCard";
import { getLatestMedia } from "../_actions/actions";
export default function LatestMedia({ mediaType }: { mediaType: string }) {
  const [latestMedia, setLatestMedia] = React.useState<any[]>([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  useEffect(() => {
    async function handleGetTopRatedMedia() {
      if (!mediaType) return;
      const media = mediaType == "Movies" ? "movie" : "tv";
      const response = await getLatestMedia({ mediaType: media, pageNumber });
      if (response) {
        setLatestMedia(response.results);
      }
    }
    handleGetTopRatedMedia();
  }, [mediaType]);

  return (
    <div className="flex justify-center">
      <div className="mx-auto mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {latestMedia.map((media) => (
          <ExploreMediaCard
            mediaType={mediaType}
            key={media.id}
            media={media}
          />
        ))}
      </div>
    </div>
  );
}
