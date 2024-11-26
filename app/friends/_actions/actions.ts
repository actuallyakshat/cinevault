"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function addFriend(userId: string, email: string) {
  try {
    const addressedToUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!addressedToUser) {
      return { success: false, message: "User not found" };
    } else if (userId == addressedToUser.id) {
      return {
        success: false,
        message: "You cannot add yourself as a friend.",
      };
    }

    const alreadyFriends = await prisma.friendship.findFirst({
      where: {
        addressedId: addressedToUser.id,
        requesterId: userId,
      },
    });

    if (alreadyFriends) {
      if (alreadyFriends.status == "PENDING") {
        return { success: false, message: "Friendship already pending" };
      } else {
        return { success: false, message: "Already a friend" };
      }
    }

    await prisma.friendship.create({
      data: {
        status: "PENDING",
        addressedId: addressedToUser.id,
        requesterId: userId,
      },
    });

    revalidatePath("/friends");
    return { success: true, message: "Friend added" };
  } catch (error) {
    console.error("Error adding friend:", error);
    return { success: false, message: "Failed to add friend" };
  }
}

export async function acceptFriendRequest(userId: string, friendId: string) {
  try {
    const friend = await prisma.friendship.findUnique({
      where: {
        id: friendId,
      },
      include: {
        addressed: true,
        requester: true,
      },
    });

    if (!friend) {
      return { success: false, message: "Friendship not found" };
    }

    if (friend.status != "PENDING") {
      return { success: false, message: "Friendship not accepted" };
    }

    await prisma.friendship.update({
      where: {
        id: friendId,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    revalidatePath("/friends");
    return { success: true, message: "Friendship accepted" };
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return { success: false, message: "Failed to accept friend request" };
  }
}

export async function rejectFriendRequest(userId: string, friendId: string) {
  try {
    const friend = await prisma.friendship.findUnique({
      where: {
        id: friendId,
      },
      include: {
        addressed: true,
        requester: true,
      },
    });

    if (!friend) {
      return { success: false, message: "Friendship not found" };
    }

    if (friend.status != "PENDING") {
      return { success: false, message: "Friendship not accepted" };
    }

    await prisma.friendship.delete({
      where: {
        id: friendId,
      },
    });

    revalidatePath("/friends");
    return { success: true, message: "Friendship rejected" };
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    return { success: false, message: "Failed to reject friend request" };
  }
}

export async function cancelFriendRequest(userId: string, friendId: string) {
  try {
    const friend = await prisma.friendship.findUnique({
      where: {
        id: friendId,
      },
      include: {
        addressed: true,
        requester: true,
      },
    });

    if (!friend) {
      return { success: false, message: "Friendship not found" };
    }

    if (friend.status != "PENDING") {
      return { success: false, message: "Friendship not accepted" };
    }

    await prisma.friendship.delete({
      where: {
        id: friendId,
      },
    });

    revalidatePath("/friends");
    return { success: true, message: "Friendship cancelled" };
  } catch (error) {
    console.error("Error cancelling friend request:", error);
    return { success: false, message: "Failed to cancel friend request" };
  }
}
