"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/providers/auth-provider";
import { Media } from "@prisma/client";
import React, { useContext, useEffect, useState } from "react";
import {
  getFriendsForRecommendation,
  sendRecommendation,
} from "../_actions/friendActions";

interface Props {
  mediaTitle: string;
  mediaId: string;
  media: Media | undefined;
}

interface Friend {
  id: string;
  name: string;
  email: string;
}

export default function RecommendToAFriendModal(props: Props) {
  const { userDetails } = useContext(AuthContext);
  const [fetchingFriends, setFetchingFriends] = React.useState(false);
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = React.useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mediaId, setMediaId] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const userId = userDetails?.id;

  const { toast } = useToast();

  useEffect(() => {
    async function handleGetFriends() {
      if (!userId || !props?.media) return;
      setFetchingFriends(true);
      try {
        const response = await getFriendsForRecommendation(
          userId,
          props.mediaId,
          props.media,
        );
        if (response.success && response.friends && response.mediaId) {
          setFriends(response.friends);
          setMediaId(response.mediaId);
        } else throw new Error(response.message);
      } catch (e) {
        const error = e as Error;
        console.error(error);
        toast({ title: "Error", description: error.message });
      } finally {
        setFetchingFriends(false);
      }
    }

    handleGetFriends();
  }, [userId, props.mediaId, toast, props.media]);

  async function recommendToFriend() {
    try {
      if (!userId || !mediaId) return;
      setLoading(true);
      const response = await sendRecommendation({
        userId,
        mediaId,
        message,
        friendId: selectedFriend,
      });

      if (response.success) {
        toast({ title: "Success", description: response.message });
        setOpen(false);
      } else {
        toast({ title: "Error", description: response.message });
      }
    } catch (e) {
      const error = e as Error;
      console.error(error);
      toast({ title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mediaCrudButton hover:bg-white/80">
          Recommend to a Friend
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recommend {props.mediaTitle} to a friend</DialogTitle>
          <DialogDescription>
            Select friends you want to recommend this media to.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            recommendToFriend();
          }}
        >
          <Label htmlFor="friend-select">Friend</Label>

          {fetchingFriends && (
            <div className="h-[40px] animate-pulse rounded-lg bg-muted"></div>
          )}

          {!fetchingFriends && (
            <Select onValueChange={setSelectedFriend} value={selectedFriend}>
              <SelectTrigger
                id="friend-select"
                className="h-fit w-full text-left"
              >
                <SelectValue placeholder="Select a Friend" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Friends</SelectLabel>
                  {friends.map((friend) => (
                    <SelectItem key={friend.id} value={friend.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{friend.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {friend.email || friend.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                  {friends.length === 0 && (
                    <SelectItem value="no-friends">
                      <div className="flex flex-col">
                        <span className="font-medium">No friends</span>
                        <span className="text-sm text-muted-foreground">
                          You have no friends yet
                        </span>
                      </div>
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <Label htmlFor="recommendation-message">Message</Label>
          <Textarea
            id="recommendation-message"
            placeholder="Hey buddy! You gotta check this out"
            onChange={(e) => setMessage(e.currentTarget.value)}
            maxLength={100}
          />
          <Button type="submit" disabled={!selectedFriend || loading}>
            Recommend
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
