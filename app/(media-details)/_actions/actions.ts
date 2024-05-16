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
    console.log(error);
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
    console.log(error);
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
    console.log("mila media? : ", existingMedia);
    if (existingMedia) {
      console.log("Media already exists!");
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
    console.log(newMedia);
    console.log("Media created!");
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
    console.log("Media: ", media);
    const mediaId = await createMedia(media);
    if (!mediaId) {
      console.error("Failed to create media or media ID is undefined");
      return;
    }

    const existingReview = await prisma.watched.findFirst({
      where: {
        mediaId: mediaId,
        userId: userId,
      },
    });

    if (existingReview) {
      console.log("Review already exists!");
      return;
    }

    const newReview = await prisma.watched.create({
      data: {
        userId: userId,
        mediaId: mediaId,
        rating: rating,
        review: review,
      },
    });

    console.log("Review created!");

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

    return newReview;
  } catch (error) {
    console.error("Error writing review:", error);
  }
};

export const addToWatchlist = async (media: Media, userId: string) => {
  try {
    const mediaId = await createMedia(media);
    if (!mediaId) {
      console.error("Failed to create media or media ID is undefined");
      return;
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
      return;
    }

    const existingWatchlist = user.watchlist.find((item) => item.id == mediaId);

    if (existingWatchlist) {
      console.log("Movie already exists in watchlist");
      return;
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
  }
};

export const addToFavorites = async (media: Media, userId: string) => {
  try {
    const mediaId = await createMedia(media);
    if (!mediaId) {
      console.error("Failed to create media or media ID is undefined");
      return;
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
      return;
    }

    const existingFavorites = user.favorites.find((item) => item.id == mediaId);

    if (existingFavorites) {
      console.log("Movie already exists in favorites");
      return;
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
  }
};
