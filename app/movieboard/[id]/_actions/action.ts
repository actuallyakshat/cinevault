"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function addMediaToMovieBoard({
  tmdbId,
  title,
  posterUrl,
  releaseYear,
  genres,
  mediaType,
  movieBoardId,
}: {
  tmdbId: string;
  title: string;
  posterUrl: string;
  releaseYear: string;
  genres: (string | undefined)[];
  mediaType: "Movies" | "Shows";
  movieBoardId: string;
}) {
  try {
    if (
      !tmdbId ||
      !title ||
      !posterUrl ||
      !releaseYear ||
      !mediaType ||
      !movieBoardId
    ) {
      return { success: false, message: "Missing Fields", board: null };
    }

    const filteredGenres: string[] = genres.filter(
      (genre): genre is string => !!genre,
    );

    const finalMediaType =
      mediaType.charAt(0).toLowerCase() == "s" ? "show" : "movie";

    const media = await prisma.media.upsert({
      where: { tmdbId },
      create: {
        tmdbId,
        title,
        posterUrl,
        releaseYear,
        genres: filteredGenres,
        mediaType: finalMediaType,
      },
      update: {},
    });

    const updatedBoard = await prisma.movieBoard.update({
      where: { id: movieBoardId },
      data: {
        media: {
          connect: { id: media.id },
        },
      },
      include: {
        media: true,
      },
    });

    revalidatePath("/movieboard/" + updatedBoard.id);

    return {
      success: true,
      message: "Media successfully added to MovieBoard",
      board: updatedBoard,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong", board: null };
  }
}
