"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function updateUserProfile({
  userId,
  name,
  email,
  showFavorites,
}: {
  userId: string;
  name: string;
  email: string;
  showFavorites: boolean;
}) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) return false;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        showFavoritesOnProfile: showFavorites,
      },
    });

    await revalidatePath("/profile");
    await revalidatePath("/profile/" + userId);
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    return false;
  }
}
