import { FeaturedByTMDB } from "@/types/tmdb";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface mediaProp extends FeaturedByTMDB {
  name?: string;
}
interface ExploreMediaCardProps {
  media: mediaProp;
  mediaType: string;
}

export default function ExploreMediaCard({
  media,
  mediaType,
}: ExploreMediaCardProps) {
  const imagePrefix = "https://image.tmdb.org/t/p/w500";
  const router = useRouter();
  const slug = mediaType === "Movies" ? "movie" : "show";
  return (
    <div
      onClick={() => router.push(`/${slug}/${media.id}`)}
      className="group mx-auto w-full cursor-pointer"
    >
      <Image
        loading="lazy"
        src={imagePrefix + media.poster_path}
        alt={media.title || media.name || ""}
        width={200}
        height={300}
        className="h-full w-full rounded-lg object-cover transition-all duration-300 md:group-hover:scale-105"
      />
    </div>
  );
}
