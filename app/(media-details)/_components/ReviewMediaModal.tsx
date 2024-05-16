import React, { useEffect } from "react";
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
import { release } from "os";
import { getGenreById } from "@/lib/functions";
import { writeReview } from "../_actions/actions";
enum MediaType {
  MOVIE,
  TV,
}
export default function ReviewMediaModal({
  title,
  details,
  mediaType,
}: {
  title: string;
  details: any;
  mediaType: string;
}) {
  const [rating, setRating] = React.useState<number[]>([5]);
  const [review, setReview] = React.useState<string>("");
  const buttonStyle =
    "w-full bg-white text-black hover:bg-white/80 flex items-center justify-center gap-2";

  async function submitReviewHandler(e: React.FormEvent) {
    e.preventDefault();
    try {
      const allGenres = details.genres.map((genre: any) =>
        getGenreById(genre.id),
      );

      const payload = {
        id: "",
        tmdbId: details.id.toString() as string,
        title: title as string,
        mediaType: "MOVIE",
        posterUrl: details.poster_path as string,
        releaseYear:
          (details?.release_date?.split("-")[0] as string) ||
          (details?.first_air_date?.split("-")[0] as string),
        genres: allGenres as string[],
      };
      console.log(payload);
      const userId = "45f50a5c-863a-4876-8537-ecc33d35f337";
      const response = await writeReview(payload, review, rating[0], userId);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className={`${buttonStyle} overflow-hidden`}>
            Already Watched<span className="truncate">{title}?</span>
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
                    <Button className="w-full">Add to Watched List</Button>
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
