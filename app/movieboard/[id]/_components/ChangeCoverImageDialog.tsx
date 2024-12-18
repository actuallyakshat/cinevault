"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import CloudinaryUpload from "./CloudinaryUpload";

interface ChangeCoverImageDialogProps {
  currentImage: string | null;
  onImageChange: (newImageUrl: string) => Promise<void>;
}

export default function ChangeCoverImageDialog({
  currentImage,
  onImageChange,
}: ChangeCoverImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageUpload = async (url: string) => {
    await onImageChange(url);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {currentImage ? (
          <Image
            src={currentImage}
            alt="Cover Image"
            width={500}
            height={500}
            className="aspect-square w-full cursor-pointer rounded-lg object-cover"
          />
        ) : (
          <div className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg bg-muted">
            <p className="text-wrap text-xs text-muted-foreground">
              Click to add cover image
            </p>
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Cover Image</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <CloudinaryUpload onUpload={handleImageUpload} />
          {currentImage && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">
                Current Image:
              </p>
              <Image
                src={currentImage}
                alt="Current Cover Image"
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
