import { Media, User, Watched } from "@prisma/client";

interface WatchedWithMedia extends Watched {
  media: Media;
}

export interface UserDetailsWithLists extends User {
  watchlist: Media[];
  favorites: Media[];
  watched: WatchedWithMedia[];
}
