import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import MovieBoardsClient from "./[id]/_components/MovieBoardsClient";

export default async function MovieBoards() {
  const { userId } = await auth();

  const boards = await prisma.movieBoard.findMany({
    where: {
      OR: [{ ownerId: userId! }, { collaborators: { some: { id: userId! } } }],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-12 lg:px-8">
      <MovieBoardsClient initialBoards={boards} />
    </div>
  );
}
