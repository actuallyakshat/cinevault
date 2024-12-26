export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import prisma from "@/db";
import { imagePrefix } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import EditProfileDialog from "../_components/EditProfileDialog";
import CloudinaryUpload from "@/app/movieboard/[id]/_components/CloudinaryUpload";
import { deleteFromCloudinary } from "@/app/movieboard/[id]/_actions/action";
import { revalidatePath } from "next/cache";

const UPLOAD_PRESET = "cinevault_user_profile_image";

export default async function Profile({ params }: { params: { id: string } }) {
  const { id } = params;
  const { userId } = await auth();
  const userData = await prisma.user.findFirst({
    where: {
      id: id,
    },
    include: {
      favorites: true,
    },
  });

  if (!userData) {
    return <div>User not found</div>;
  }

  const movieboards = await prisma.movieBoard.findMany({
    where: {
      OR: [
        {
          ownerId: id,
          visibilities: {
            some: {
              userId: id,
              visibility: "PUBLIC",
            },
          },
        },
        {
          collaborators: {
            some: { id: id },
          },
          visibilities: {
            some: {
              userId: id,
              visibility: "PUBLIC",
            },
          },
        },
      ],
    },
    include: {
      visibilities: true,
      owner: {
        select: {
          name: true,
        },
      },
    },
  });

  async function updateCoverImage(newImageUrl: string) {
    "use server";

    const oldImageUrl = userData!.profileImageUrl;

    if (oldImageUrl) {
      try {
        const publicId = oldImageUrl
          .split("/upload/")[1]
          .split("/")
          .filter((segment) => !segment.startsWith("v"))
          .join("/")
          .split(".")[0];

        console.log(`Deleting old image: ${publicId}`);

        if (publicId) {
          await deleteFromCloudinary({ publicIds: [publicId] });
          console.log(`Successfully deleted old image: ${publicId}`);
        }
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error);
      }
    }

    await prisma.user.update({
      where: { id: id || userId! },
      data: { profileImageUrl: newImageUrl },
    });
    revalidatePath("/profile/" + userId);
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-12 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row">
        <CloudinaryUpload
          isAuthorised={userId == id}
          type="profile"
          uploadPreset={UPLOAD_PRESET}
          currentImage={userData.profileImageUrl}
          onUpload={updateCoverImage}
        />
        <div className="flex flex-1 flex-col gap-2 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <div>
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              {id === userId && (
                <p className="text-muted-foreground">{userData.email}</p>
              )}
            </div>
            {userId === id && <EditProfileDialog />}
          </div>
          <hr />

          <div className="mt-4 flex flex-col gap-2">
            <h2 className="text-xl font-bold">Movie Boards</h2>
            {movieboards.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                {movieboards.map((board) => (
                  <Link href={"/movieboard/" + board.id} key={board.id}>
                    <div className="flex flex-col">
                      {board.coverImage ? (
                        <Image
                          src={board.coverImage}
                          alt={board.title}
                          width={500}
                          height={500}
                          className="aspect-square cursor-pointer rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-muted">
                          <div className="text-center text-muted-foreground">
                            {board.title.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      )}
                      <h3 className="mt-1.5 text-sm font-medium">
                        {board.title}
                      </h3>
                      {board.ownerId !== id && (
                        <p className="text-xs text-muted-foreground">
                          by {board.owner.name}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                {id === userId
                  ? "You haven't added any public movie boards yet. Add some movie boards and set them to public to get started!"
                  : "This user hasn't added any public movie boards yet."}
              </p>
            )}
          </div>

          {userData.showFavoritesOnProfile && userData.favorites.length > 0 && (
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

          {userData.favorites.length === 0 && (
            <div className="mt-4 flex flex-col gap-2">
              <h2 className="text-xl font-bold">Favorites</h2>
              <p className="text-muted-foreground">
                {id === userId
                  ? "You haven't added any media to favorites yet. Add some favorites to get started!"
                  : "This user hasn't added any media to favorites yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
