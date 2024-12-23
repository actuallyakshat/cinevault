import UpdateNameDialog from "@/app/_components/UpdateNameDialog";
import prisma from "@/db";
import { Visibility } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { deleteFromCloudinary } from "./_actions/action";
import AddMediaSearch from "./_components/AddMediaSearch";
import ChangeVisibility from "./_components/ChangeVisibility";
import CloudinaryUpload from "./_components/CloudinaryUpload";
import MediaGrid from "./_components/MediaGrid";

const UPLOAD_PRESET = "cinevault_movieboards";

export default async function MovieBoard({
  params,
}: {
  params: { id: string };
}) {
  const board = await prisma.movieBoard.findUnique({
    where: {
      id: params.id,
    },
    include: {
      media: true,
    },
  });

  if (!board) return <div>Board not found</div>;

  async function updateCoverImage(newImageUrl: string) {
    "use server";

    if (!board) return;

    const oldImageUrl = board.coverImage;

    await prisma.movieBoard.update({
      where: { id: params.id },
      data: { coverImage: newImageUrl },
    });

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

    revalidatePath(`/movieboard/${params.id}`);
  }

  async function updateTitle(newTitle: string) {
    "use server";
    await prisma.movieBoard.update({
      where: { id: params.id },
      data: { title: newTitle },
    });
    revalidatePath(`/movieboard`);
  }

  async function updateVisibility(newVisibility: Visibility) {
    "use server";
    await prisma.movieBoard.update({
      where: { id: params.id },
      data: { visibility: newVisibility },
    });
    revalidatePath(`/movieboard`);
  }

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-10 px-6 py-12 lg:flex-row lg:px-8">
      <div className="flex-[1]">
        <CloudinaryUpload
          type="cover"
          uploadPreset={UPLOAD_PRESET}
          currentImage={board.coverImage}
          onUpload={updateCoverImage}
        />
        <div className="mt-3 text-center">
          <UpdateNameDialog name={board?.title} onUpdate={updateTitle}>
            <h1 className="cursor-pointer text-xl font-bold hover:underline sm:text-2xl">
              {board?.title}
            </h1>
          </UpdateNameDialog>
          <p className="text-wrap text-sm text-muted-foreground">
            {board?.description}
          </p>
          <AddMediaSearch boardId={board.id} />
          <ChangeVisibility
            defaultValue={board.visibility}
            onToggle={updateVisibility}
          />
        </div>
      </div>

      <div className="flex-[3]">
        {board.media.length == 0 ? (
          <p className="font-medium text-muted-foreground">
            This board has no movies yet. Add some to get started
          </p>
        ) : (
          <MediaGrid media={board.media} />
        )}
      </div>
    </div>
  );
}
