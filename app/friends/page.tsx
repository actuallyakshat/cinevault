import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { Friendship, User } from "@prisma/client";
import { Suspense } from "react";
import AddFriendsModal from "./_components/AddFriendModal";
import { FriendsData } from "./_components/FriendsData";
import { IncomingRequests } from "./_components/IncomingRequests";
import { OutgoingRequests } from "./_components/OutgoingRequests";
import { SelectFriendCategory } from "./_components/SelectFriendsCategory";

export interface FriendsProp extends Friendship {
  requester: User;
  addressed: User;
}

async function getFriends(userId: string, category: string) {
  if (category === "all") {
    return await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { addressedId: userId }],
      },
      include: {
        addressed: true,
        requester: true,
      },
    });
  } else {
    return await prisma.friendship.findMany({
      where: {
        status: "PENDING",
        OR: [{ requesterId: userId }, { addressedId: userId }],
      },
      include: {
        addressed: true,
        requester: true,
      },
    });
  }
}

export default async function Friends({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category || "all";
  const { userId } = await auth();

  const friends = await getFriends(userId!, category);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex w-full flex-row items-center justify-between gap-4 sm:mb-8">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Friends</h1>
        <AddFriendsModal />
      </div>
      <div className="mt-4 sm:mt-6">
        <SelectFriendCategory selectedCategory={category} />
      </div>
      <Suspense fallback={<FriendsSkeleton />}>
        {category === "all" && <FriendsData friends={friends} />}
        {category === "incoming" && (
          <IncomingRequests
            friends={friends.filter((f) => f.addressedId === userId)}
          />
        )}
        {category === "outgoing" && (
          <OutgoingRequests
            friends={friends.filter((f) => f.requesterId === userId)}
          />
        )}
      </Suspense>
    </div>
  );
}

function FriendsSkeleton() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-[140px] w-full sm:h-[200px]" />
      ))}
    </div>
  );
}
