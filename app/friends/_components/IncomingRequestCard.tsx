"use client";

import React, { useContext } from "react";
import { FriendsProp } from "../page";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { acceptFriendRequest, rejectFriendRequest } from "../_actions/actions";
import { AuthContext } from "@/providers/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

export default function IncomingRequestCard({
  friend,
}: {
  friend: FriendsProp;
}) {
  const [acceptLoading, setAcceptLoading] = React.useState(false);
  const [rejectLoading, setRejectLoading] = React.useState(false);
  const { userDetails } = useContext(AuthContext);
  const { toast } = useToast();

  async function handleAcceptFriendRequest(friendId: string) {
    try {
      if (!userDetails) return;

      setAcceptLoading(true);
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
      setAcceptLoading(false);
    }
  }

  async function handleRejectFriendRequest(friendId: string) {
    try {
      if (!userDetails) return;

      setRejectLoading(true);
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
      setRejectLoading(false);
    }
  }

  return (
    <div className="friendshipCard">
      <div key={friend.id} className="flex items-center gap-3">
        <Image
          src={friend.requester.profileImageUrl}
          alt="Profile"
          width={400}
          height={400}
          className="size-14 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{friend.requester.name}</h2>
          <p className="text-muted-foreground">{friend.requester.email}</p>
        </div>
      </div>
      <div className="mt-3 flex w-full items-center justify-center gap-3">
        <Button
          variant={"secondary"}
          className="w-full"
          disabled={acceptLoading || rejectLoading}
          onClick={() => handleRejectFriendRequest(friend.id)}
        >
          {rejectLoading ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            "Reject"
          )}
        </Button>
        <Button
          className="w-full"
          disabled={acceptLoading || rejectLoading}
          onClick={() => handleAcceptFriendRequest(friend.id)}
        >
          {acceptLoading ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            "Accept"
          )}
        </Button>
      </div>
    </div>
  );
}
