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
    const filteredData = mediaList.filter(
      (item) => item?.media?.mediaType == comparisionSlug,
    );
    setData(filteredData);
  }, [mediaList, mediaType, comparisionSlug]);

  return (
    <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2">
      {data.map((media) => (
        <WatchedMediaCard key={media.id} media={media} mediaType={mediaType} />
      ))}
    </div>
  );
}
