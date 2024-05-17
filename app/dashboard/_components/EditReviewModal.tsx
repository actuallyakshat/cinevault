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
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  removeFromWatchedList,
  updateReview,
} from "@/app/(media-details)/_actions/actions";
import { AuthContext } from "@/providers/auth-provider";
import { getUserDetails } from "../_actions/actions";

export default function EditReviewModal({
  details,
  styles,
}: {
  details: any;
  styles: string;
}) {
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [rating, setRating] = React.useState<number[]>([details.rating]);
  const { toast } = useToast();
  const [review, setReview] = React.useState<string>(details.review || "");
  const { userDetails, setUserDetails } = useContext(AuthContext);

  async function handleUpdateReview(e: React.FormEvent) {
    try {
      e.preventDefault();
      setLoading(true);
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
        await refreshUser();
        setLoading(false);
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
    }
  }

  async function refreshUser() {
    try {
      const res = await getUserDetails({
        name: userDetails.name,
        email: userDetails.email,
      });
      if (res) {
        setUserDetails(res);
      } else {
        toast({
          title: "Error",
          description: "Failed to refresh user details",
        });
      }
    } catch (error) {
      console.error("Error refreshing user details:", error);
      toast({
        title: "Error",
        description: "Failed to refresh user details",
      });
    }
  }

  async function handleDeleteReview() {
    try {
      setLoading(true);
      const res = await removeFromWatchedList(
        details.media.tmdbId,
        details.userId,
      );
      if (res.success) {
        toast({
          title: "Review removed",
          description: res.message,
        });
        await refreshUser();
        setLoading(false);
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
    }
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button
          className={`absolute bottom-0 right-0 xl:left-1/2 xl:w-full xl:-translate-x-1/2 ${styles ? styles : ""} `}
        >
          Edit Review
        </Button>
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
                    disabled={loading}
                    onClick={handleDeleteReview}
                  >
                    {loading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Delete Review"
                    )}
                  </Button>
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Update Review"
                    )}
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
