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

    await revalidatePath("/movieboard/" + updatedBoard.id);

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

    console.log("Board", board);

    if (!board) {
      console.log("Board not found");
      return;
    }

    try {
      if (board.coverImage) {
        const publicId = board.coverImage
          .split("/upload/")[1]
          .split("/")
          .filter((segment) => !segment.startsWith("v"))
          .join("/")
          .split(".")[0];

        if (publicId) {
          await deleteFromCloudinary({ publicIds: [publicId] });
        }
      }
    } catch (error) {
      console.error("Error deleting cover image from Cloudinary:", error);
    }

    await prisma.movieBoard.delete({
      where: { id: boardId },
    });

    await revalidatePath("/movieboard");

    return true;
  } catch (error) {
    console.error("Error deleting board:", error);
    throw new Error("Failed to delete board");
  }
}

export async function addCollaboratorToBoard({
  boardId,
  userId,
}: {
  boardId: string;
  userId: string;
}) {
  try {
    const board = await prisma.movieBoard.findUnique({
      where: { id: boardId },
      include: {
        collaborators: true,
      },
    });

    if (!board) return;

    if (board.collaborators.some((item) => item.id === userId)) {
      return;
    }

    await prisma.$transaction([
      prisma.movieBoard.update({
        where: { id: boardId },
        data: {
          collaborators: {
            connect: {
              id: userId,
            },
          },
        },
      }),
      prisma.boardVisibility.create({
        data: {
          userId,
          boardId,
          visibility: "PRIVATE",
        },
      }),
    ]);

    await revalidatePath("/movieboard/" + boardId);
  } catch (error) {
    console.error("Error adding collaborator to board:", error);
    throw new Error("Failed to add collaborator to board");
  }
}

export async function removeCollaboratorFromBoard({
  boardId,
  userId,
}: {
  boardId: string;
  userId: string;
}) {
  try {
    const board = await prisma.movieBoard.findUnique({
      where: { id: boardId },
      include: {
        collaborators: true,
      },
    });

    if (!board) return false;

    if (!board.collaborators.some((item) => item.id == userId)) {
      return false;
    }

    await prisma.movieBoard.update({
      where: { id: boardId },
      data: {
        collaborators: {
          disconnect: {
            id: userId,
          },
        },
        visibilities: {
          deleteMany: {
            userId,
          },
        },
      },
    });

    await revalidatePath("/movieboard/" + boardId);
    return true;
  } catch (error) {
    console.error("Error removing collaborator from board:", error);
    throw new Error("Failed to remove collaborator from board");
  }
}

export async function getFriendsToAdd({
  boardId,
  userId,
}: {
  boardId: string;
  userId: string;
}) {
  try {
    // First get the board and its collaborators
    const board = await prisma.movieBoard.findUnique({
      where: { id: boardId },
      include: {
        collaborators: true,
      },
    });

    if (!board) return;

    const friends = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              notIn: board.collaborators.map((item) => item.id),
            },
          },
          {
            OR: [
              {
                // User is the requester
                receivedFriendships: {
                  some: {
                    requesterId: userId,
                    status: "ACCEPTED",
                  },
                },
              },
              {
                // User is the addressed
                sentFriendships: {
                  some: {
                    addressedId: userId,
                    status: "ACCEPTED",
                  },
                },
              },
            ],
          },
        ],
      },
    });

    return friends;
  } catch (error) {
    console.error("Error getting friends to add:", error);
    throw new Error("Failed to get friends to add");
  }
}
