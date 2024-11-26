import { FriendsProp } from "../page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function FriendCard({ friend }: { friend: FriendsProp }) {
  const friendData =
    friend.requester.id === friend.addressedId
      ? friend.addressed
      : friend.requester;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-row items-center gap-4">
        <Avatar>
          <AvatarImage
            src={friendData.profileImageUrl || ""}
            alt={friendData.name || ""}
          />
          <AvatarFallback>{friendData.name?.charAt(0) || "F"}</AvatarFallback>
        </Avatar>
        <CardTitle>{friendData.name}</CardTitle>
        <p className="block text-sm text-muted-foreground">
          {friendData.email}
        </p>
      </div>
      <hr />
    </div>
  );
}
