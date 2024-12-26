"use client";

import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  removeFromWatchedList,
  updateReview,
} from "@/app/(media-details)/_actions/actions";
import { AuthContext } from "@/providers/auth-provider";
import { WatchedWithMedia } from "@/types/user";

export default function EditReviewModal({
  details,
  styles,
}: {
  details: WatchedWithMedia;
  styles: string;
}) {
  const [openModal, setOpenModal] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [rating, setRating] = React.useState<number[]>([details.rating]);
  const { toast } = useToast();
  const [review, setReview] = React.useState<string>(details.review || "");
  const { refreshUserDetails } = useContext(AuthContext);

  async function handleUpdateReview(e: React.FormEvent) {
    try {
      e.preventDefault();
      setIsUpdating(true);
      const res = await updateReview(
        details.media.tmdbId,
        details.userId,
        rating[0],
        review,
      );
      if (res.success) {
        toast({
          title: "Review updated",
          description: res.message,
        });
        await refreshUserDetails();
        setIsUpdating(false);
        setOpenModal(false);
      } else {
        toast({
          title: "Error",
          description: res.message,
        });
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: "Error",
        description: "Failed to update review",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteReview() {
    try {
      setIsDeleting(true);
      const res = await removeFromWatchedList(
        details.media.tmdbId,
        details.userId,
      );
      if (res.success) {
        toast({
          title: "Review removed",
          description: res.message,
        });
        await refreshUserDetails();
        setIsDeleting(false);
        setOpenModal(false);
      } else {
        toast({
          title: "Error",
          description: res.message,
        });
      }
    } catch (error) {
      console.error("Error removing from watched:", error);
      toast({
        title: "Error",
        description: "Failed to remove from watched",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button className="w-full">Edit Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {details.media.title}</DialogTitle>
          <DialogDescription asChild>
            <div>
              <p>Write something about your experience.</p>
              <form onSubmit={handleUpdateReview}>
                <Textarea
                  placeholder="Your review"
                  className="my-4 h-32 text-foreground"
                  onChange={(e) => setReview(e.target.value)}
                  defaultValue={details.review}
                />
                <Slider
                  defaultValue={rating}
                  onValueChange={(rating) => setRating(rating)}
                  max={10}
                  min={1}
                  step={1}
                  className="pb-3 pt-2"
                />
                <div className="flex justify-end">
                  <Label className="pr-2 text-lg font-semibold">
                    {rating[0]}
                  </Label>
                </div>
                <div className="mt-4 flex w-full gap-3">
                  <Button
                    className="w-full"
                    variant={"destructive"}
                    type="button"
                    disabled={isDeleting || isUpdating}
                    onClick={handleDeleteReview}
                  >
                    {isDeleting ? "Deleting..." : "Delete Review"}
                  </Button>
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isDeleting || isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Review"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
