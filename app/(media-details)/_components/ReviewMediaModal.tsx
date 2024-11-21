import React, { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { getGenreById } from "@/lib/functions";
import { writeReview } from "../_actions/actions";
import { AuthContext } from "@/providers/auth-provider";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
export default function ReviewMediaModal({
  title,
  details,
  mediaType,
  refreshUserDetails,
}: {
  title: string;
  details: any;
  mediaType: string;
  refreshUserDetails: Function;
}) {
  const { toast } = useToast();
  const [rating, setRating] = React.useState<number[]>([5]);
  const [review, setReview] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const buttonStyle =
    "w-full bg-white text-black hover:bg-white/80 flex items-center justify-center gap-2";
  const { userDetails } = useContext(AuthContext);
  const [userId, setUserId] = React.useState<string>("");

  React.useEffect(() => {
    if (userDetails) {
      setUserId(userDetails.id);
    }
  }, [userDetails]);

  async function submitReviewHandler(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const allGenres = details.genres.map((genre: any) =>
        getGenreById(genre.id),
      );

      const payload = {
        id: "",
        tmdbId: details.id.toString() as string,
        title: title as string,
        mediaType: mediaType as string,
        posterUrl: details.poster_path as string,
        releaseYear:
          (details?.release_date?.split("-")[0] as string) ||
          (details?.first_air_date?.split("-")[0] as string),
        genres: allGenres as string[],
      };
      const response = await writeReview(payload, review, rating[0], userId);
      if (response.success) {
        setOpen(false);
        toast({
          title: "Review Added",
          description: `Review for ${title} has been added saved.`,
        });
        refreshUserDetails();
      } else {
        toast({
          title: "Error",
          description: response.message,
        });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className={`${buttonStyle} overflow-hidden`}>
            Already Watched<span className="-ml-1 truncate">{title}?</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review {title}</DialogTitle>
            <DialogDescription asChild>
              <div>
                <p>Write something about your experience.</p>
                <form onSubmit={submitReviewHandler}>
                  <Textarea
                    placeholder="Your review"
                    className="my-4 text-foreground"
                    onChange={(e) => setReview(e.target.value)}
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
                  <div className="mt-4 flex w-full justify-end">
                    <Button className="w-full" disabled={loading}>
                      {loading ? (
                        <Loader className="animate-spin" />
                      ) : (
                        "Add to Watched List"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
