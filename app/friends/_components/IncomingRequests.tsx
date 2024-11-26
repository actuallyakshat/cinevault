import { FriendsProp } from "../page";
import IncomingRequestCard from "./IncomingRequestCard";

export function IncomingRequests({ friends }: { friends: FriendsProp[] }) {
  if (friends.length === 0) {
    return (
      <div className="mt-8 text-center">
        <h2 className="mb-2 text-xl font-bold">No incoming requests</h2>
        <p className="text-muted-foreground">
          You haven&apos;t received any incoming requests yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {friends.map((friend) => (
        <IncomingRequestCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
}
