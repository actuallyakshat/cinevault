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
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { useState } from "react";

export default function LeaveMovieBoardDialog({
  boardTitle,
  boardId,
  onLeave,
}: {
  boardTitle: string;
  boardId: string;
  onLeave: ({ boardId }: { boardId: string }) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLeaving(true);
      await onLeave({ boardId });
    } catch (error) {
      console.error("Error deleting board:", error);
    } finally {
      setIsLeaving(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className="mt-4 text-red-700 hover:text-red-800"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Leave Board
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exit Collaboration?</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave &quot;{boardTitle}&quot;? You will no
            longer be able to add or remove media from this board.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLeaving}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLeaving}
            className="w-full"
          >
            {isLeaving ? "Leaving..." : "Leave"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
