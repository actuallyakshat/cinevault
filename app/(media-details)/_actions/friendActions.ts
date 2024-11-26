"use server";
import prisma from "@/db";
import { Media, User } from "@prisma/client";
import { createMedia } from "./actions";

export async function getFriendsForRecommendation(
  userId: string,
  tmdbId: string,
  mediaDetails: Media,
) {
  try {
    const friends = await prisma.friendship.findMany({
      where: {
        AND: [
          {
            OR: [{ addressedId: userId }, { requesterId: userId }],
          },
          {
            status: "ACCEPTED",
          },
        ],
      },
      include: {
        addressed: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const media = await prisma.media.findFirst({
      where: {
        tmdbId,
      },
      select: {
        id: true,
      },
    });

    let mediaId = media?.id;

    if (!media) {
      const newMediaId = await createMedia(mediaDetails);
      if (newMediaId) mediaId = newMediaId;
    }

    const existingRecommendations = await prisma.recommendation.findMany({
      where: {
        senderId: userId,
        mediaId,
      },
      select: {
        receiverId: true,
      },
    });

    const existingReceiverIds = existingRecommendations.map(
      (rec) => rec.receiverId,
    );

    const responseFriends = friends
      .map((friend) =>
        friend.requesterId === userId ? friend.addressed : friend.requester,
      )
      .filter((friend) => !existingReceiverIds.includes(friend.id));

    return { success: true, friends: responseFriends, mediaId: mediaId };
  } catch (error) {
    console.error("Error getting friends for recommendation:", error);
    return {
      success: false,
      message: "Failed to get friends for recommendation",
    };
  }
}

export async function sendRecommendation({
  friendId,
  mediaId,
  userId,
  message,
}: {
  friendId: string;
  mediaId: string;
  userId: string;
  message: string;
}) {
  try {
    const existingRecommendations = await prisma.recommendation.findMany({
      where: {
        senderId: friendId,
        mediaId: mediaId,
      },
    });

    if (existingRecommendations.length > 0) {
      console.error("Recommendation already exists!");
      return { success: false, message: "Recommendation already exists" };
    }

    const newRecommendation = await prisma.recommendation.create({
      data: {
        senderId: userId,
        receiverId: friendId,
        mediaId,
        message,
      },
    });

    return { success: true, message: "Recommendation sent" };
  } catch (error) {
    console.error("Error sending recommendation:", error);
    return { success: false, message: "Failed to send recommendation" };
  }
}
