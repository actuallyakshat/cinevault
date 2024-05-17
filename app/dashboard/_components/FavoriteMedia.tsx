import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

export default function FavoriteMedia({
  mediaList,
  mediaType,
}: {
  mediaList: any[];
  mediaType: string;
}) {
  const [data, setData] = React.useState<any[]>([]);

  const imagePrefix = "https://image.tmdb.org/t/p/w500";
  const comparisionSlug = mediaType == "Movies" ? "movie" : "show";
  useEffect(() => {
    const filteredData = mediaList.filter(
      (media) => media.mediaType == comparisionSlug,
    );
    setData(filteredData);
  }, [mediaList, mediaType, comparisionSlug]);

  return (
    <div className="col-span-2 grid gap-3 md:grid-cols-3 lg:grid-cols-5">
      {data.map((media) => (
        <Link
          href={"/" + comparisionSlug + "/" + media.tmdbId}
          key={media.id}
          className="group col-span-1"
        >
          <Image
            src={`${imagePrefix}${media.posterUrl}`}
            alt={media.title}
            width={500}
            height={500}
            className="w-full cursor-pointer rounded-lg transition-all duration-300 md:group-hover:scale-105"
          />
        </Link>
      ))}
    </div>
  );
}
