import { TMDBMovieSearchQuery, TMDBShowSearchQuery } from "@/types/tmdb";

export function isMovie(
  result: TMDBMovieSearchQuery | TMDBShowSearchQuery,
): result is TMDBMovieSearchQuery {
  return "title" in result;
}
