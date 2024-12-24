"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface RemoveFromBoardButtonProps {
  onRemove: () => Promise<void>;
}

export function RemoveFromBoardButton({
  onRemove,
}: RemoveFromBoardButtonProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);
    try {
      await onRemove();
    } catch (error) {
      console.error("Failed to remove media from board:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={handleRemove}
      disabled={isRemoving}
      className="absolute right-2 top-2 bg-red-700 opacity-0 transition-opacity hover:bg-red-800 group-hover:opacity-100"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Remove from board</span>
    </Button>
  );
}
