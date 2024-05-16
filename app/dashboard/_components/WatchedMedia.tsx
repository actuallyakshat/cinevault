import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

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
    const printAll = mediaList.map((item) => console.log(item));
    const filteredData = mediaList.filter(
      (item) => item?.media?.mediaType == comparisionSlug,
    );
    setData(filteredData);
  }, [mediaList, mediaType, comparisionSlug]);

  useEffect(() => {
    console.log(mediaList);
  }, [data]);
  return (
    <div>
      {data.map((media) => (
        <div
          key={media.id}
          className="col-span-2 grid gap-3 md:grid-cols-3 lg:grid-cols-5"
        >
          <Link
            href={"/" + comparisionSlug + "/" + media.media.tmdbId}
            className="col-span-1 rounded-lg bg-secondary p-4 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${media?.media?.posterUrl}`}
              alt={media?.media?.title}
              width={500}
              height={500}
              className="w-full cursor-pointer rounded-lg transition-all duration-300"
            />
            <div>
              <h1 className="mt-3 text-xl font-bold">{media?.media?.title}</h1>
              <h4 className="flex items-center gap-2 font-bold text-foreground/80">
                <Star className="size-4" /> {media?.rating}/10
              </h4>
              <p>{media?.review}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
