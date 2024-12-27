"use client";
import React, { useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { addCollaboratorToBoard, getFriendsToAdd } from "../_actions/action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { AuthContext } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function AddCollaboratorDialog({
  boardId,
}: {
  boardId: string;
}) {
  const { userDetails } = useContext(AuthContext);
  const [friends, setFriends] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedFriend, setSelectedFriend] = React.useState<any>();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchFriends() {
      if (!userDetails?.id) return;
      const response = await getFriendsToAdd({
        boardId,
        userId: userDetails.id,
      });
      if (response) {
        const filteredFriends = response.filter(
          (user) => user.id != userDetails?.id,
        );
        setFriends(filteredFriends);
      }
    }
    fetchFriends();
  }, [boardId, userDetails?.id]);

  async function handleAdd() {
    if (!selectedFriend) {
      toast({
        title: "Error",
        description: "Please select a friend to add",
      });
      return;
    }
    setLoading(true);
    try {
      await addCollaboratorToBoard({
        boardId,
        userId: selectedFriend.id,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error adding collaborator to board:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Plus className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Collaborator</DialogTitle>
          <DialogDescription>
            Select a friend you wish to add to this movie board.
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-4">
          <Select onValueChange={(value) => setSelectedFriend(value)}>
            <SelectTrigger className="min-h-[50px] w-full">
              <SelectValue placeholder="Select Friend" />
            </SelectTrigger>
            <SelectContent>
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <SelectItem
                    key={friend.id}
                    value={friend}
                    className="min-h-[50px]"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        width={1080}
                        height={1080}
                        src={friend.profileImageUrl}
                        alt={friend.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <p>{friend.name}</p>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={"no-user"} disabled>
                  <p>No friends found</p>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="mt-2 flex w-full flex-col gap-2"
          >
            <Button type="button" variant={"secondary"}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Add
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
