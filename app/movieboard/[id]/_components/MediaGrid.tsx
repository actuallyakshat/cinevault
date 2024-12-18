"use client";

import { Media } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import SortSelection from "@/app/dashboard/_components/SortSelection";
import GenreFilter from "@/app/dashboard/GenreFilter";

export default function MediaGrid({ media }: { media: Media[] }) {
  const [sortCriterion, setSortCriterion] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const imagePrefix = "https://image.tmdb.org/t/p/w500";

  const genres = useMemo(() => {
    const allGenres = media.flatMap((item) => item.genres);
    return Array.from(new Set(allGenres));
  }, [media]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const sortedAndFilteredMedia = useMemo(() => {
    return media
      .filter(
        (item) =>
          (selectedGenres.length === 0 ||
            selectedGenres.some((genre) => item.genres.includes(genre))) &&
          item.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        if (sortOrder === "none") return 0;

        let comparison = 0;
        if (sortCriterion === "name") {
          comparison = a.title.localeCompare(b.title);
        } else if (sortCriterion === "releaseYear") {
          comparison =
            new Date(a.releaseYear).getTime() -
            new Date(b.releaseYear).getTime();
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [media, sortCriterion, sortOrder, selectedGenres, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <SortSelection
          sortCriterion={sortCriterion}
          setSortCriterion={setSortCriterion}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          selectedList="All"
        />
        <GenreFilter
          uniqueGenres={genres}
          selectedGenres={selectedGenres}
          handleGenreChange={handleGenreChange}
        />
        <Input
          type="text"
          placeholder="Search titles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[200px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {sortedAndFilteredMedia.map((item) => (
          <Link
            href={`/${item.mediaType.toLowerCase()}/${item.tmdbId}`}
            key={item.id}
            className="flex flex-col gap-2"
          >
            <div className="aspect-[2/3] w-full overflow-hidden rounded-lg">
              <Image
                loading="lazy"
                src={`${imagePrefix}${item.posterUrl}`}
                alt={item.title}
                width={500}
                height={750}
                className="h-full w-full cursor-pointer object-cover transition-all duration-300 hover:scale-105"
              />
            </div>
            <div className="flex w-full flex-col items-center gap-1 text-center">
              <h2 className="line-clamp-1 text-sm font-semibold">
                {item.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                {new Date(item.releaseYear).getFullYear()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
