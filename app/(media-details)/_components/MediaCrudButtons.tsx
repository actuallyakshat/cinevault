import { Button } from "@/components/ui/button";
import { Heart, Popcorn } from "lucide-react";
import React from "react";

export default function MediaCrudButtons({ title }: { title: string }) {
  const buttonStyle =
    "w-full bg-white text-black hover:bg-white/80 flex items-center justify-center gap-2";
  return (
    <div className="mx-auto max-w-xl space-y-3 lg:mx-0">
      <div className="flex items-center gap-3">
        <Button className={buttonStyle}>
          Add To Watchlist <Popcorn className="size-4" />
        </Button>
        <Button className={buttonStyle}>
          Add To Favorites <Heart className="size-4" />
        </Button>
      </div>
      <Button className={`${buttonStyle} overflow-hidden`}>
        Already Watched<span className="truncate">{title}?</span>
      </Button>
    </div>
  );
}
