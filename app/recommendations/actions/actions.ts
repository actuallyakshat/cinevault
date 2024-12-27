"use server";

import { addToWatchlist } from "@/app/(media-details)/_actions/actions";
import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function addRecommendationToWatchlist(
  recommendationId: string,
  userId: string,
) {
  try {
    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
      include: { media: true },
    });

    if (!recommendation) {
      throw new Error("Recommendation not found");
    }

    await addToWatchlist(recommendation.media, userId);
    await revalidatePath("/recommendations");
    return { success: true, message: "Recommendation added to watchlist" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error adding recommendation to watchlist",
    };
  }
}

export async function deleteRecommendation(recommendationId: string) {
  try {
    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
    });

    if (!recommendation) {
      throw new Error("Recommendation not found");
    }

    await prisma.recommendation.delete({ where: { id: recommendationId } });
    await revalidatePath("/recommendations");
    return { success: true, message: "Recommendation removed successfully" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error removing recommendation",
    };
  }
}
