import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function ExploreMediaCard({
  media,
  mediaType,
}: {
  media: any;
  mediaType: string;
}) {
  const imagePrefix = "https://image.tmdb.org/t/p/w500";
  const router = useRouter();
  const slug = mediaType === "Movies" ? "movie" : "show";
  return (
    <div
      onClick={() => router.push(`/${slug}/${media.id}`)}
      className="group mx-auto w-full cursor-pointer"
    >
      <Image
        src={imagePrefix + media.poster_path}
        alt={media.title}
        width={200}
        height={300}
        className="h-full w-full rounded-lg object-cover transition-all duration-300 group-hover:scale-105"
      />
    </div>
  );
}
