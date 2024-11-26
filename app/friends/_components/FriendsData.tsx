import { FriendsProp } from "../page";
import FriendCard from "./FriendCard";

export function FriendsData({ friends }: { friends: FriendsProp[] }) {
  if (friends.length === 0) {
    return (
      <div className="mt-8 text-center">
        <h2 className="mb-2 text-xl font-bold">No friends found</h2>
        <p className="text-muted-foreground">
          You haven&apos;t added any friends yet. Add some friends to get
          started!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {friends.map((friend) => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
}
