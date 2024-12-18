import prisma from "@/db";
import AddMediaSearch from "./_components/AddMediaSearch";
import MediaGrid from "./_components/MediaGrid";
import { revalidatePath } from "next/cache";
import CloudinaryUpload from "./_components/CloudinaryUpload";
import UpdateNameDialog from "@/app/_components/UpdateNameDialog";

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
    await prisma.movieBoard.update({
      where: { id: params.id },
      data: { coverImage: newImageUrl },
    });
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

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-6 py-12 md:flex-row lg:px-8">
      <div className="flex-[1]">
        <CloudinaryUpload
          type="cover"
          uploadPreset={UPLOAD_PRESET}
          currentImage={board.coverImage}
          onUpload={updateCoverImage}
        />
        <div className="mt-3 text-center">
          <UpdateNameDialog name={board?.title} onUpdate={updateTitle}>
            <h1 className="cursor-pointer text-2xl font-bold hover:underline">
              {board?.title}
            </h1>
          </UpdateNameDialog>
          <p className="text-wrap text-sm text-muted-foreground">
            {board?.description}
          </p>
          <AddMediaSearch boardId={board.id} />
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
