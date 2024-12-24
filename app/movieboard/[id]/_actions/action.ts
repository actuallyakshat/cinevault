"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";
import cloudinary from "cloudinary";

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

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteFromCloudinary({
  publicIds,
}: {
  publicIds: string[];
}) {
  if (publicIds.length === 0) return;

  try {
    const result = await cloudinary.v2.api.delete_resources(publicIds);

    console.log("Deleted resources:", result.deleted);
    return result.deleted;
  } catch (error) {
    console.error("Error deleting resources from Cloudinary:", error);
    throw new Error("Failed to delete resources from Cloudinary");
  }
}

export async function deleteBoard({ boardId }: { boardId: string }) {
  try {
    const board = await prisma.movieBoard.findUnique({
      where: { id: boardId },
    });

    if (!board) return;

    try {
      if (!board.coverImage) return;
      const publicId = board.coverImage
        .split("/upload/")[1]
        .split("/")
        .filter((segment) => !segment.startsWith("v"))
        .join("/")
        .split(".")[0];

      if (publicId) {
        await deleteFromCloudinary({ publicIds: [publicId] });
      }
    } catch (error) {
      console.error("Error deleting cover image from Cloudinary:", error);
    }

    await prisma.movieBoard.delete({
      where: { id: boardId },
    });

    return true;
  } catch (error) {
    console.error("Error deleting board:", error);
    throw new Error("Failed to delete board");
  }
}
