import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { MovieBoard } from "@prisma/client";
import Link from "next/link";
import AddMovieBoardDialog from "./_components/AddMovieBoardDialog";
import Image from "next/image";

export default async function MovieBoards() {
  const { userId } = await auth();

  const boards = await prisma.movieBoard.findMany({
    where: {
      ownerId: userId!,
    },
  });

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-12 lg:px-8">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-extrabold">Movie Boards</h1>
        <AddMovieBoardDialog />
      </div>

      <div className="mt-4 grid w-full grid-cols-6 gap-8">
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
}

function BoardCard({ board }: { board: MovieBoard }) {
  return (
    <Link href={"/movieboard/" + board.id}>
      <div className="flex flex-col gap-2">
        <div className="">
          {board.coverImage ? (
            <Image
              loading="lazy"
              src={board.coverImage}
              alt={board.title}
              width={500}
              height={500}
              className="aspect-square w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex aspect-square h-full items-center justify-center rounded-lg bg-muted">
              <p className="text-wrap text-xs text-muted-foreground">
                {board.title}
              </p>
            </div>
          )}
        </div>
        <h2 className="font-medium">{board.title}</h2>
      </div>
    </Link>
  );
}
