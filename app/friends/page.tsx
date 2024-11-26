import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/db";
import { Friendship, User } from "@prisma/client";
import AddFriendsModal from "./_components/AddFriendModal";
import { SelectFriendCategory } from "./_components/SelectFriendsCategory";
import { Skeleton } from "@/components/ui/skeleton";
import { FriendsData } from "./_components/FriendsData";
import { IncomingRequests } from "./_components/IncomingRequests";
import { OutgoingRequests } from "./_components/OutgoingRequests";

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

  if (!userId) {
    return <div>Please sign in to view your friends.</div>;
  }

  const friends = await getFriends(userId, category);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex w-full flex-col items-center justify-between sm:flex-row">
        <h1 className="mb-4 text-3xl font-extrabold sm:mb-0">Friends</h1>
        <AddFriendsModal />
      </div>
      <SelectFriendCategory selectedCategory={category} />
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-[200px] w-full" />
      ))}
    </div>
  );
}
