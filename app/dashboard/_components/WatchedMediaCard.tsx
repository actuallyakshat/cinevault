"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import EditReviewModal from "./EditReviewModal";

export default function WatchedMediaCard({
  media,
  mediaType,
}: {
  media: any;
  mediaType: string;
}) {
  const comparisionSlug = mediaType == "Movies" ? "movie" : "show";
  return (
    <div
      key={media.id}
      className="col-span-1 flex flex-col gap-6 rounded-lg border bg-secondary/70 p-4 shadow-lg lg:flex-row"
    >
      <div className="min-h-[300px]">
        <Image
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w500${media?.media?.posterUrl}`}
          alt={media?.media?.title}
          width={500}
          height={500}
          className="mx-auto h-full w-[200px] rounded-lg object-cover transition-all duration-300 lg:w-[300px]"
        />
      </div>

      <div className="flex h-full w-full flex-col">
        <Link
          href={"/" + comparisionSlug + "/" + media.media.tmdbId}
          className="flex w-full items-center justify-between gap-4"
        >
          <h1 className="text-3xl font-bold">{media?.media?.title}</h1>
          <h4 className="flex items-center gap-2 text-2xl font-bold text-foreground/80">
            <Star className="size-5 fill-primary" /> {media?.rating}/10
          </h4>
        </Link>

        <div className="my-1">
          {media.media.genres.map((genre: string) => (
            <span
              key={genre}
              className="mr-1 rounded-full border bg-background px-3 py-1 text-xs font-medium text-foreground"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <p className="mt-3 text-sm font-medium text-foreground">
            {media.review.length > 360
              ? `${media.review.substring(0, 360)}...`
              : media.review}
          </p>
          <div className="mt-4">
            <EditReviewModal styles="" details={media} />
          </div>
        </div>
      </div>
    </div>
  );
}
