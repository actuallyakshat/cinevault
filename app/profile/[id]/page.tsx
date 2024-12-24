export const dynamic = "force-dynamic";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import prisma from "@/db";
import { imagePrefix } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Profile({ params }: { params: { id: string } }) {
  const { id } = params;
  const { userId } = await auth();
  const userData = await prisma.user.findFirst({
    where: {
      id: id,
    },
    include: {
      movieBoards: true,
      favorites: true,
    },
  });

  if (!userData) {
    return <div>User not found</div>;
  }

  const publicMovieBoards = userData.movieBoards.filter(
    (board) => board.visibility === "PUBLIC",
  );

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-12 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row">
        <Avatar className="mx-auto size-72">
          <AvatarImage
            src={userData.profileImageUrl || ""}
            alt={userData.name || ""}
          />
          <AvatarFallback>{userData.name?.charAt(0) || "F"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-2 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <div>
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              {id == userId && (
                <p className="text-muted-foreground">{userData.email}</p>
              )}
            </div>
            {userId == id && <Button variant={"link"}>Edit Profile</Button>}
          </div>
          <hr />

          <div className="mt-4 flex flex-col gap-2">
            <h2 className="text-xl font-bold">Movie Boards</h2>
            {publicMovieBoards.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                {publicMovieBoards.map((board) => (
                  <Link href={"/movieboard/" + board.id} key={board.id}>
                    {board.coverImage && (
                      <Image
                        src={board.coverImage}
                        alt={board.title}
                        width={500}
                        height={500}
                        className="aspect-square cursor-pointer rounded-lg object-cover"
                      />
                    )}
                    <h3 className="mt-1 font-medium">{board.title}</h3>
                  </Link>
                ))}
              </div>
            )}
            {publicMovieBoards.length == 0 && (
              <p className="text-muted-foreground">
                You haven&apos;t added any movie boards yet. Add some movie
                boards to get started!
              </p>
            )}
          </div>

          {userData.favorites.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              <h2 className="text-xl font-bold">Favorites</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {userData.favorites.map(
                  (fav: (typeof userData.favorites)[0]) => (
                    <Link
                      href={"/" + fav.mediaType + "/" + fav.tmdbId}
                      key={fav.id}
                      className="group col-span-1"
                    >
                      <Image
                        loading="lazy"
                        src={`${imagePrefix}${fav.posterUrl}`}
                        alt={fav.title}
                        width={500}
                        height={500}
                        className="h-full w-full cursor-pointer rounded-lg object-cover transition-all duration-300 md:group-hover:scale-105"
                      />
                    </Link>
                  ),
                )}
              </div>
            </div>
          )}

          {userData.favorites.length == 0 && (
            <div className="mt-4 flex flex-col gap-2">
              <h2 className="text-xl font-bold">Favorites</h2>
              <p className="text-muted-foreground">
                You haven&apos;t added any media to favorites yet. Add some
                movie boards to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
