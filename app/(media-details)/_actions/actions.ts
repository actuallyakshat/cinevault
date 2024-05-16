"use server";

import { getUserDetails } from "@/app/dashboard/_actions/actions";
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
      console.log("Review already exists!");
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
      console.log("Movie already exists in watchlist");
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
      console.log("Movie already exists in favorites");
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
