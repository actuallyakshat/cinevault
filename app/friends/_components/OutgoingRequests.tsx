"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FriendsProp } from "../page";
import { useContext, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/providers/auth-provider";
import { rejectFriendRequest } from "../_actions/actions";

export function OutgoingRequests({ friends }: { friends: FriendsProp[] }) {
  const [loading, setLoading] = useState(false);
  const { userDetails } = useContext(AuthContext);
  const { toast } = useToast();

  if (friends.length === 0) {
    return (
      <div className="mt-8 text-left">
        <h2 className="mb-2 text-xl font-bold">No outgoing requests</h2>
        <p className="text-muted-foreground">
          You haven&apos;t sent any outgoing requests yet. Send some friendship
          requests to get started!
        </p>
      </div>
    );
  }

  async function handleCancelFriendshipRequest(friendId: string) {
    try {
      if (!userDetails) return;

      setLoading(true);
      const repsonse = await rejectFriendRequest(userDetails.id, friendId);
      if (repsonse.success) {
        toast({ title: "Success", description: "Friend request accepted." });
      } else {
        toast({ title: "Error", description: repsonse.message });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: error as string });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {friends.map((friend) => (
        <div className="friendshipCard" key={friend.id}>
          <div className="flex items-center gap-3">
            <Image
              src={friend.addressed.profileImageUrl}
              alt="Profile"
              width={400}
              height={400}
              className="size-14 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">{friend.addressed.name}</h2>
              <p className="text-muted-foreground">{friend.addressed.email}</p>
            </div>
          </div>
          <div className="mt-5 flex w-full items-center justify-center gap-3">
            <Button
              className="w-full"
              disabled={loading}
              onClick={() => handleCancelFriendshipRequest(friend.id)}
            >
              {loading ? "Cancelling" : "Cancel"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
