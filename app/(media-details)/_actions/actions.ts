"use server";

import prisma from "@/db";
import { Media } from "@prisma/client";
import axios from "axios";
const TOKEN = process.env.TMDB_API_TOKEN as string;

export async function getMediaDetails({
  mediaType,
  mediaId,
}: {
  mediaType: string;
  mediaId: string;
}) {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${mediaId}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTrailer({
  mediaId,
  mediaType,
}: {
  mediaId: string;
  mediaType: string;
}) {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${mediaId}/videos?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const createMedia = async (media: Media) => {
  try {
    const existingMedia = await prisma.media.findFirst({
      where: {
        tmdbId: media.tmdbId,
      },
    });
    if (existingMedia) {
      console.error("Media already exists!");
      return existingMedia.id;
    }
    const newMedia = await prisma.media.create({
      data: {
        tmdbId: media.tmdbId,
        title: media.title,
        posterUrl: media.posterUrl,
        releaseYear: media.releaseYear,
        genres: media.genres,
        mediaType: media.mediaType,
      },
    });
    return newMedia.id;
  } catch (error) {
    console.error("Error creating media:", error);
  }
};

export const writeReview = async (
  media: Media,
  review: string,
  rating: number,
  userId: string,
) => {
  try {
    const mediaId = await createMedia(media);
    if (!mediaId) {
      console.error("Failed to create media or media ID is undefined");
      return { sucess: false, message: "Failed to save media to our database" };
    }

    const existingReview = await prisma.watched.findFirst({
      where: {
        mediaId: mediaId,
        userId: userId,
      },
    });

    if (existingReview) {
      console.error("Review already exists!");
      return { success: false, message: "Review already exists" };
    }

    const newReview = await prisma.watched.create({
      data: {
        userId: userId,
        mediaId: mediaId,
        rating: rating,
        review: review,
      },
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        watched: {
          connect: {
            id: newReview.id,
          },
        },
      },
    });

    return { data: newReview, success: true, message: "Review created" };
  } catch (error) {
    console.error("Error writing review:", error);
    return { success: false, message: "Failed to save review to our database" };
  }
};

export const addToWatchlist = async (media: Media, userId: string) => {
  try {
    const mediaId = await createMedia(media);
    if (!mediaId) {
      console.error("Failed to create media or media ID is undefined");
      return {
        success: false,
        message: "Failed to save media to our database",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        watchlist: true,
      },
    });

    if (!user) {
      console.error("User not found");
      return { success: false, message: "User not found" };
    }

    const existingWatchlist = user.watchlist.find((item) => item.id == mediaId);

    if (existingWatchlist) {
      console.error("Movie already exists in watchlist");
      return {
        success: false,
        message: "This media already exists in watchlist",
      };
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        watchlist: {
          connect: {
            id: mediaId,
          },
        },
      },
    });

    return { success: true, message: "Movie added to watchlist" };
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return { success: false, message: "Failed to add to watchlist" };
  }
};

export const addToFavorites = async (media: Media, userId: string) => {
  try {
    const mediaId = await createMedia(media);
    if (!mediaId) {
      console.error("Failed to create media or media ID is undefined");
      return {
        success: false,
        message: "Failed to save media to our database",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        favorites: true,
      },
    });

    if (!user) {
      console.error("User not found");
      return { success: false, message: "User not found" };
    }

    const existingFavorites = user.favorites.find((item) => item.id == mediaId);

    if (existingFavorites) {
      console.error("Movie already exists in favorites");
      return {
        success: false,
        message: "This media already exists in favorites",
      };
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          connect: {
            id: mediaId,
          },
        },
      },
    });

    return { success: true, message: "Movie added to favorites" };
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return { success: false, message: "Failed to add to favorites" };
  }
};

export async function removeFromWatchlist(mediaId: string, userId: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        watchlist: true,
      },
    });

    if (!user) {
      console.error("User not found");
      return { success: false, message: "User not found" };
    }

    const existingWatchlist = user.watchlist.find(
      (item) => item.tmdbId == mediaId,
    );

    if (!existingWatchlist) {
      console.error("Media does not exist in watchlist");
      return {
        success: false,
        message: "This media does not exist in watchlist",
      };
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        watchlist: {
          disconnect: {
            id: existingWatchlist.id,
          },
        },
      },
    });
    const mediaReferences = await prisma.media.findFirst({
      where: { tmdbId: mediaId },
      include: {
        favouritedBy: true,
        watchlistBy: true,
        watchedBy: true,
      },
    });

    if (!mediaReferences) {
      return { success: false, message: "Media not found" };
    }
    if (
      mediaReferences.favouritedBy.length === 0 &&
      mediaReferences.watchlistBy.length === 0 &&
      mediaReferences.watchedBy.length === 0
    ) {
      await prisma.media.delete({ where: { id: mediaReferences.id } });
    }
    return { success: true, message: "Movie removed from watchlist" };
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return { success: false, message: "Failed to remove from watchlist" };
  }
}

export async function removeFromFavorites(mediaId: string, userId: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        favorites: true,
      },
    });

    if (!user) {
      console.error("User not found");
      return { success: false, message: "User not found" };
    }

    const existingFavorites = user.favorites.find(
      (item) => item.tmdbId == mediaId,
    );

    if (!existingFavorites) {
      console.error("Media does not exist in favorites");
      return {
        success: false,
        message: "This media does not exist in favorites",
      };
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          disconnect: {
            id: existingFavorites.id,
          },
        },
      },
    });
    const mediaReferences = await prisma.media.findFirst({
      where: { tmdbId: mediaId },
      include: {
        favouritedBy: true,
        watchlistBy: true,
        watchedBy: true,
      },
    });

    if (!mediaReferences) {
      return { success: false, message: "Media not found" };
    }
    if (
      mediaReferences.favouritedBy.length === 0 &&
      mediaReferences.watchlistBy.length === 0 &&
      mediaReferences.watchedBy.length === 0
    ) {
      await prisma.media.delete({ where: { id: mediaReferences.id } });
    }
    return { success: true, message: "Movie removed from favorites" };
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return { success: false, message: "Failed to remove from favorites" };
  }
}

export async function removeFromWatched(mediaId: string, userId: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        watched: true,
      },
    });

    if (!user) {
      console.error("User not found");
      return { success: false, message: "User not found" };
    }

    const existingWatched = user.watched.find((item) => item.id == mediaId);

    if (!existingWatched) {
      console.error("Media does not exist in watched");
      return {
        success: false,
        message: "This media does not exist in watched",
      };
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        watched: {
          disconnect: {
            id: existingWatched.id,
          },
        },
      },
    });
    const mediaReferences = await prisma.media.findFirst({
      where: { tmdbId: mediaId },
      include: {
        favouritedBy: true,
        watchlistBy: true,
        watchedBy: true,
      },
    });

    if (!mediaReferences) {
      return { success: false, message: "Media not found" };
    }
    if (
      mediaReferences.favouritedBy.length === 0 &&
      mediaReferences.watchlistBy.length === 0 &&
      mediaReferences.watchedBy.length === 0
    ) {
      await prisma.media.delete({ where: { id: mediaReferences.id } });
    }
    return { success: true, message: "Movie removed from watched" };
  } catch (error) {
    console.error("Error removing from watched:", error);
    return { success: false, message: "Failed to remove from watched" };
  }
}

export async function removeFromWatchedList(mediaId: string, userId: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        watched: {
          include: {
            media: true,
          },
        },
      },
    });

    if (!user) {
      console.error("User not found");
      return { success: false, message: "User not found" };
    }

    const existingWatched = user.watched.find(
      (item) => item.media.tmdbId == mediaId,
    );

    if (!existingWatched) {
      return {
        success: false,
        message: "You don't have a review for this media",
      };
    }

    await prisma.watched.delete({
      where: { id: existingWatched.id },
    });

    const mediaReferences = await prisma.media.findFirst({
      where: { tmdbId: mediaId },
      include: {
        favouritedBy: true,
        watchlistBy: true,
        watchedBy: true,
      },
    });

    if (!mediaReferences) {
      return { success: false, message: "Media not found" };
    }
    if (
      mediaReferences.favouritedBy.length === 0 &&
      mediaReferences.watchlistBy.length === 0 &&
      mediaReferences.watchedBy.length === 0
    ) {
      await prisma.media.delete({ where: { id: mediaReferences.id } });
    }

    return { success: true, message: "Review removed from watched list" };
  } catch (error) {
    console.error("Error removing from watched:", error);
    return { success: false, message: "Failed to remove from watched" };
  }
}

export async function updateReview(
  mediaId: string,
  userId: string,
  rating: number,
  review: string,
) {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        watched: {
          include: {
            media: true,
          },
        },
      },
    });

    if (!user) {
      console.error("User not found");
      return { success: false, message: "User not found" };
    }

    const existingWatched = user.watched.find(
      (item) => item.media.tmdbId == mediaId,
    );

    if (!existingWatched) {
      return {
        success: false,
        message: "You don't have a review for this media",
      };
    }

    await prisma.watched.update({
      where: { id: existingWatched.id },
      data: {
        rating: rating,
        review: review,
      },
    });

    return { success: true, message: "Review updated" };
  } catch (error) {
    console.error("Error updating review:", error);
    return { success: false, message: "Failed to update review" };
  }
}
