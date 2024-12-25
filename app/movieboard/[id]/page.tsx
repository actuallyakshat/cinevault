import UpdateNameDialog from "@/app/_components/UpdateNameDialog";
import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deleteFromCloudinary } from "./_actions/action";
import AddMediaSearch from "./_components/AddMediaSearch";
import ChangeVisibility from "./_components/ChangeVisibility";
import CloudinaryUpload from "./_components/CloudinaryUpload";
import DeleteMovieBoardDialog from "./_components/DeleteMovieBoardDialog";
import EditCollaborators from "./_components/EditCollaborators";
import MediaGrid from "./_components/MediaGrid";
import { VisibilityOption } from "@prisma/client";
import { redirect } from "next/navigation";
import LeaveMovieBoardDialog from "./_components/LeaveMovieBoardDialog";
import { isAbsolute } from "node:path/posix";

const UPLOAD_PRESET = "cinevault_movieboards";

export default async function MovieBoard({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  const board = await prisma.movieBoard.findUnique({
    where: {
      id: params.id,
    },
    include: {
      media: true,
      owner: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
        },
      },
      collaborators: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
        },
      },
      visibilities: {
        select: {
          visibility: true,
          userId: true,
        },
      },
    },
  });

  if (!board) return <div>Board not found</div>;

  const isAuthorised =
    board.owner.id === userId ||
    board.collaborators.some((item) => item.id === userId);

  const isAdmin = board.owner.id === userId;

  const isPublic = board.visibilities.some(
    (item) => item.userId === userId && item.visibility === "PUBLIC",
  );

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

  async function updateVisibility(newVisibility: VisibilityOption) {
    "use server";
    const visibility = await prisma.boardVisibility.findFirst({
      where: {
        boardId: params.id,
        userId: userId!,
      },
    });

    if (!visibility) return;

    await prisma.boardVisibility.update({
      where: { id: visibility.id },
      data: { visibility: newVisibility },
    });

    revalidatePath(`/movieboard`);
  }

  async function removeMedia(mediaId: string) {
    "use server";
    await prisma.movieBoard.update({
      where: { id: params.id },
      data: {
        media: {
          disconnect: {
            id: mediaId,
          },
        },
      },
    });

    revalidatePath(`/movieboard/${params.id}`);
  }

  async function leaveBoard() {
    "use server";
    await prisma.$transaction([
      prisma.movieBoard.update({
        where: { id: params.id },
        data: {
          collaborators: {
            disconnect: {
              id: userId!,
            },
          },
        },
      }),

      prisma.boardVisibility.deleteMany({
        where: {
          userId: userId!,
          boardId: params.id,
        },
      }),
    ]);
    revalidatePath(`/movieboard`);
    revalidatePath(`/movieboard` + params.id);
  }

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-10 px-6 py-12 lg:flex-row lg:px-8">
      <div className="flex-[1]">
        <CloudinaryUpload
          isAuthorised={isAuthorised && isAdmin}
          type="cover"
          uploadPreset={UPLOAD_PRESET}
          currentImage={board.coverImage}
          onUpload={updateCoverImage}
        />
        <div className="mt-3 text-center">
          <UpdateNameDialog
            isAuthorised={isAuthorised && isAdmin}
            name={board?.title}
            onUpdate={updateTitle}
          >
            <h1
              className={`text-xl font-bold ${isAuthorised && isAdmin ? "cursor-pointer hover:underline" : ""} sm:text-2xl`}
            >
              {board?.title}
            </h1>
          </UpdateNameDialog>
          <p className="mt-1 text-center text-sm font-medium text-muted-foreground">
            {board.owner.name}
          </p>
          <p className="text-wrap text-sm text-muted-foreground">
            {board?.description}
          </p>
          {isAuthorised && <AddMediaSearch boardId={board.id} />}
          {isAuthorised && (
            <ChangeVisibility
              defaultValue={isPublic ? "PUBLIC" : "PRIVATE"}
              onToggle={updateVisibility}
            />
          )}
          <EditCollaborators
            isAdmin={isAdmin}
            boardId={board.id}
            collaborators={board.collaborators}
          />
          {isAdmin && (
            <DeleteMovieBoardDialog
              boardTitle={board.title}
              boardId={board.id}
            />
          )}

          {isAuthorised && !isAdmin && (
            <LeaveMovieBoardDialog
              boardTitle={board.title}
              boardId={board.id}
              onLeave={leaveBoard}
            />
          )}
        </div>
      </div>

      <div className="flex-[3]">
        {board.media.length == 0 ? (
          <p className="font-medium text-muted-foreground">
            This board has no movies yet. Add some to get started
          </p>
        ) : (
          <MediaGrid media={board.media} onRemoveMedia={removeMedia} />
        )}
      </div>
    </div>
  );
}
