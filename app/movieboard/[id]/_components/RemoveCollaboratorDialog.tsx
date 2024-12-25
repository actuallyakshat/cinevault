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
import { useToast } from "@/components/ui/use-toast";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { removeCollaboratorFromBoard } from "../_actions/action";

export default function RemoveCollaboratorDialog({
  boardId,
  userId,
}: {
  boardId: string;
  userId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleRemove = async () => {
    setIsDeleting(true);
    try {
      const response = await removeCollaboratorFromBoard({ boardId, userId });
      if (response) {
        toast({
          title: "Success",
          description: "Collaborator removed from board",
        });
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error removing collaborator:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <TrashIcon className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            You are about to remove this friend from your movie board.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRemove();
          }}
        >
          <Button disabled={isDeleting} className="w-full">
            {isDeleting ? "Removing..." : "Remove"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
