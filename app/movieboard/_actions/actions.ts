"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function createMovieBoard({
  name,
  description,
  creatorId,
}: {
  name: string;
  description: string;
  creatorId: string;
}) {
  try {
    if (!name)
      return { success: false, message: "Missing Fields", board: null };

    const newBoard = await prisma.movieBoard.create({
      data: {
        title: name,
        ownerId: creatorId,
        description,
        visibilities: {
          create: {
            userId: creatorId,
          },
        },
      },
    });

    await revalidatePath("/movieboard");
    return { success: true, message: "New Board Added", board: newBoard };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong", board: null };
  }
}
