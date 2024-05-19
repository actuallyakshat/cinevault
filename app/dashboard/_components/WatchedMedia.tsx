import React, { useEffect } from "react";
import WatchedMediaCard from "./WatchedMediaCard";

export default function WatchedMedia({
  mediaList,
  mediaType,
}: {
  mediaList: any[];
  mediaType: string;
}) {
  const [data, setData] = React.useState<any[]>([]);
  const comparisionSlug = mediaType == "Movies" ? "movie" : "show";

  useEffect(() => {
    if (mediaList.length == 0) {
      setData([]);
      return;
    }
    const filteredData = mediaList.filter(
      (item) => item?.media?.mediaType == comparisionSlug,
    );
    setData(filteredData);
  }, [mediaList, mediaType, comparisionSlug]);

  return (
    <div>
      {data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
          {data.map((media) => (
            <WatchedMediaCard
              key={media.id}
              media={media}
              mediaType={mediaType}
            />
          ))}
        </div>
      )}
      <div>
        {data.length == 0 && (
          <div className="mt-8 w-full">
            <h1 className="text-center text-xl font-bold text-foreground/70">
              No {mediaType} found
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
