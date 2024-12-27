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
        OR: [
          { addressedId: addressedToUser.id, requesterId: userId },
          { addressedId: userId, requesterId: addressedToUser.id },
        ],
      },
    });

    if (alreadyFriends) {
      if (alreadyFriends.status == "PENDING") {
        return {
          success: false,
          message: "Friendship status is already pending.",
        };
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

    await revalidatePath("/friends");
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

    await revalidatePath("/friends");
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

    await revalidatePath("/friends");
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

    await revalidatePath("/friends");
    return { success: true, message: "Friendship cancelled" };
  } catch (error) {
    console.error("Error cancelling friend request:", error);
    return { success: false, message: "Failed to cancel friend request" };
  }
}

export async function deleteFriend(userId: string, friendId: string) {
  try {
    const friendship = await prisma.friendship.findUnique({
      where: {
        id: friendId,
      },
      select: {
        requesterId: true,
        addressedId: true,
      },
    });

    if (!friendship) {
      return { success: false, message: "Friendship not found" };
    }

    const otherUserId =
      friendship.requesterId === userId
        ? friendship.addressedId
        : friendship.requesterId;

    // Remove collaborations
    await prisma.$transaction(async (tx) => {
      // Find boards where userId is the owner and otherUserId is a collaborator
      const userOwnedBoards = await tx.movieBoard.findMany({
        where: {
          ownerId: userId,
          collaborators: { some: { id: otherUserId } },
        },
        select: { id: true },
      });

      // Find boards where otherUserId is the owner and userId is a collaborator
      const otherUserOwnedBoards = await tx.movieBoard.findMany({
        where: {
          ownerId: otherUserId,
          collaborators: { some: { id: userId } },
        },
        select: { id: true },
      });

      // Remove otherUser from boards owned by userId
      for (const board of userOwnedBoards) {
        await tx.movieBoard.update({
          where: { id: board.id },
          data: {
            collaborators: {
              disconnect: { id: otherUserId },
            },
          },
        });
      }

      // Remove userId from boards owned by otherUser
      for (const board of otherUserOwnedBoards) {
        await tx.movieBoard.update({
          where: { id: board.id },
          data: {
            collaborators: {
              disconnect: { id: userId },
            },
          },
        });
      }

      // Delete the friendship
      await tx.friendship.delete({
        where: {
          id: friendId,
        },
      });
    });

    await revalidatePath("/friends");
    return { success: true, message: "Friendship and collaborations removed" };
  } catch (error) {
    console.error("Error deleting friend:", error);
    return { success: false, message: "Failed to delete friend" };
  }
}
