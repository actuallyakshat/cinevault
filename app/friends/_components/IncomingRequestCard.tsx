"use client";

import React, { useContext } from "react";
import { FriendsProp } from "../page";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { acceptFriendRequest, rejectFriendRequest } from "../_actions/actions";
import { AuthContext } from "@/providers/auth-provider";
import { useToast } from "@/components/ui/use-toast";

export default function IncomingRequestCard({
  friend,
}: {
  friend: FriendsProp;
}) {
  const [loading, setLoading] = React.useState(false);
  const { userDetails } = useContext(AuthContext);
  const { toast } = useToast();

  async function handleAcceptFriendRequest(friendId: string) {
    try {
      if (!userDetails) return;

      setLoading(true);
      const repsonse = await acceptFriendRequest(userDetails.id, friendId);
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

  async function handleRejectFriendRequest(friendId: string) {
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
    <div className="friendshipCard">
      <div key={friend.id}>
        <h2 className="text-xl font-bold">{friend.requester.name}</h2>
        <p className="text-muted-foreground">{friend.requester.email}</p>
        <div className="mt-3 flex w-full items-center justify-center gap-3">
          <Button
            variant={"secondary"}
            className="w-full"
            onClick={() => handleRejectFriendRequest(friend.id)}
          >
            {loading ? <Loader className="size-5 animate-spin" /> : "Reject"}
          </Button>
          <Button
            className="w-full"
            onClick={() => handleAcceptFriendRequest(friend.id)}
          >
            {loading ? <Loader className="size-5 animate-spin" /> : "Accept"}
          </Button>
        </div>
      </div>
    </div>
  );
}
