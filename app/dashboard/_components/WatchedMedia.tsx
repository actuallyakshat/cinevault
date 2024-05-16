import { Button } from "@/components/ui/button";
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
  const [showMore, setShowMore] = React.useState(false);

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
          className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2"
        >
          <Link
            href={"/" + comparisionSlug + "/" + media.media.tmdbId}
            className="col-span-1 flex gap-6 rounded-lg bg-secondary/70 p-4 shadow-lg transition-all duration-300 hover:scale-[1.01]"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${media?.media?.posterUrl}`}
              alt={media?.media?.title}
              width={500}
              height={500}
              className="w-[100px] cursor-pointer rounded-lg transition-all duration-300"
            />
            <div className="w-full">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-3xl font-bold">{media?.media?.title}</h1>
                <h4 className="flex items-center gap-2 text-2xl font-bold text-foreground/80">
                  <Star className="size-5" /> {media?.rating}/10
                </h4>
              </div>
              <div className="my-1">
                {media.media.genres.map((genre: string) => (
                  <span
                    key={genre}
                    className="mr-1 rounded-full bg-background px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {!showMore && (
                <p className="mt-2 text-foreground/90">
                  {media.review.length > 120
                    ? `${media.review.substring(0, 120)}...`
                    : media.review}
                  {media.review.length > 120 && (
                    <span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMore(true);
                        }}
                        variant={"link"}
                      >
                        Read more
                      </Button>
                    </span>
                  )}
                </p>
              )}
              {showMore && (
                <p className="mt-2 text-foreground/90">
                  {media}
                  <span>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMore(false);
                      }}
                      variant={"link"}
                    >
                      Read less
                    </Button>
                  </span>
                </p>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
