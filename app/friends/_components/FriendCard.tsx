"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/providers/auth-provider";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";
import { deleteFriend } from "../_actions/actions";

type FriendsProp = {
  id: string;
  requester: {
    id: string;
    name: string;
    email: string;
    profileImageUrl: string | null;
  };
  addressed: {
    id: string;
    name: string;
    email: string;
    profileImageUrl: string | null;
  };
};

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
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link
          href={"/profile/" + friendData.id}
          className="flex items-center gap-3 md:gap-5"
        >
          <Avatar>
            <AvatarImage
              src={friendData.profileImageUrl || ""}
              alt={friendData.name || ""}
            />
            <AvatarFallback>{friendData.name?.charAt(0) || "F"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl md:text-2xl">
              {friendData.name}
            </CardTitle>
            <p className="block text-sm text-muted-foreground">
              {friendData.email}
            </p>
          </div>
        </Link>
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function DeleteFriendDialog({
  handleDelete,
  isDeleting,
  open,
  onOpenChange,
}: {
  handleDelete: (e: React.FormEvent<HTMLFormElement>) => void;
  isDeleting: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
        <form onSubmit={(e) => handleDelete(e)} className="space-y-2">
          <Button variant={"secondary"} type="button" className="w-full">
            Cancel
          </Button>
          <Button
            className="w-full"
            type="submit"
            variant={"destructive"}
            disabled={isDeleting}
          >
            {isDeleting ? "Removing..." : "Remove Friend"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
