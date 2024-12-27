"use client";

import { AuthContext } from "@/providers/auth-provider";
import { useContext, useState } from "react";
import { deleteFriend } from "../_actions/actions";

export interface FriendUser {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string | null;
}

export default function FriendCard({ friend }: { friend: FriendsProp }) {
  const { userDetails } = useContext(AuthContext);
  const userId = userDetails?.id;
  const friendData =
    friend.requester.id === userId ? friend.addressed : friend.requester;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await deleteFriend(userId!, friend.id);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete friend:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-3 flex w-full flex-col gap-2">
      <div className="flex w-full flex-row items-center justify-between gap-4">
        <FriendInfo user={friendData} />
        <DeleteFriendDialog
          handleDelete={handleDelete}
          isDeleting={isDeleting}
          open={isOpen}
          onOpenChange={setIsOpen}
        />
      </div>
      <hr />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { FriendsProp } from "../page";

interface DeleteFriendDialogProps {
  handleDelete: (e: React.FormEvent<HTMLFormElement>) => void;
  isDeleting: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteFriendDialog({
  handleDelete,
  isDeleting,
  open,
  onOpenChange,
}: DeleteFriendDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="link">
          <PlusIcon className="size-5 rotate-45" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            You are about to remove this user from your friends list. This also
            means that you will no longer be able to collaborate on movie
            boards.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDelete} className="space-y-2">
          <Button
            variant="secondary"
            type="button"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            type="submit"
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? "Removing..." : "Remove Friend"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface FriendInfoProps {
  user: FriendUser;
}

export function FriendInfo({ user }: FriendInfoProps) {
  return (
    <Link
      href={"/profile/" + user.id}
      className="flex items-center gap-3 md:gap-5"
    >
      <FriendAvatar user={user} />
      <div>
        <CardTitle className="text-xl">{user.name}</CardTitle>
        <p className="block text-sm text-muted-foreground">{user.email}</p>
      </div>
    </Link>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FriendAvatarProps {
  user: FriendUser;
}

export function FriendAvatar({ user }: FriendAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={user.profileImageUrl || ""} alt={user.name || ""} />
      <AvatarFallback>{user.name?.charAt(0) || "F"}</AvatarFallback>
    </Avatar>
  );
}
