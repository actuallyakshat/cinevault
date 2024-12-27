import { FriendsProp } from "../page";
import FriendCard from "./FriendCard";

export function FriendsData({ friends }: { friends: FriendsProp[] }) {
  if (friends.length === 0) {
    return (
      <div className="mt-6 text-left sm:mt-8">
        <h2 className="mb-2 text-lg font-bold sm:text-xl">No friends found</h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          You haven&apos;t added any friends yet. Add some friends to get
          started!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {friends.map((friend) => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
}
