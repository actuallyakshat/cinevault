import { FriendsProp } from "../page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OutgoingRequests({ friends }: { friends: FriendsProp[] }) {
  if (friends.length === 0) {
    return (
      <div className="mt-8 text-center">
        <h2 className="mb-2 text-xl font-bold">No outgoing requests</h2>
        <p className="text-muted-foreground">
          You haven&apos;t sent any outgoing requests yet. Send some friendship
          requests to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {friends.map((friend) => (
        <Card key={friend.id}>
          <CardHeader>
            <CardTitle>{friend.addressed.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{friend.addressed.email}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
