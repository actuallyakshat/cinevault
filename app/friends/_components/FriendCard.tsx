import { FriendsProp } from "../page";
import { CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function FriendCard({ friend }: { friend: FriendsProp }) {
  const { userId } = await auth();
  const friendData =
    friend.requester.id === userId ? friend.addressed : friend.requester;

  return (
    <Link
      href={"/profile/" + friendData.id}
      className="flex w-full flex-col gap-2"
    >
      <div className="flex w-full flex-col gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3 md:gap-5">
          <Avatar>
            <AvatarImage
              src={friendData.profileImageUrl || ""}
              alt={friendData.name || ""}
            />
            <AvatarFallback>{friendData.name?.charAt(0) || "F"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl md:text-2xl">
              {friendData.name}
            </CardTitle>
            <p className="block text-sm text-muted-foreground">
              {friendData.email}
            </p>
          </div>
        </div>
      </div>
      <hr />
    </Link>
  );
}
